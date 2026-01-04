"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
// Pastikan path import ini sesuai dengan struktur folder Anda
import TugasCard from '../../components/taskpage/tugascard'; 
import TaskDetailModal from '../../components/taskpage/TaskDetailModal';
import { useRouter } from 'next/navigation';

// Helper untuk format tanggal (Sama seperti di halaman utama)
const formatDeadline = (isoString: string) => {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
    const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { datePart, timePart };
}

export default function ArchivePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null); // State untuk Modal
  const router = useRouter();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const fetchArchivedTasks = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('assignments') 
      .select(`
        *, 
        subjects ( name, lecturers ( name ) )
      `) 
      .lt('deadline', todayISO) // Ambil yang sudah lewat (Masa Lalu)
      .order('deadline', { ascending: false }); // Yang paling baru lewat di atas

    if (error) {
        console.error(error);
    } else {
        // KITA FORMAT DULU DATANYA AGAR COCOK DENGAN TUGASCARD
        const formattedData = (data || []).map((item: any) => {
            const { datePart, timePart } = formatDeadline(item.deadline);
            return {
                id: item.id,
                subject: item.subjects?.name || 'Unknown',
                lecturer: item.subjects?.lecturers?.name || 'Unknown',
                title: item.title,
                description: item.description,
                deadlineDate: datePart, // TugasCard butuh ini
                deadlineTime: timePart, // TugasCard butuh ini
                submissionLink: item.submission_link,
                attachments: item.attachments,
                status: 'pending',
                deadline: item.deadline 
            };
        });
        setTasks(formattedData);
    }
    setIsLoading(false);
  };

  return (
    <div className='pb-24 pt-6 px-4 min-h-screen bg-gray-100'>
       
       {/* HEADER */}
       <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()} 
            className="bg-white p-2 rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <div>
            <h1 className='text-xl font-bold text-gray-700'>Arsip Tugas</h1>
            <p className='text-gray-500 text-xs'>Riwayat tugas yang sudah lewat</p>
          </div>
       </div>

       {/* LIST TUGAS ARSIP */}
       <div className='space-y-4 opacity-80 grayscale-50'> 
          {isLoading ? (
             <p className="text-center text-gray-400 mt-10">Memuat arsip...</p>
          ) : tasks.length === 0 ? (
             <p className="text-center text-gray-400 mt-10">Belum ada tugas yang diarsipkan.</p>
          ) : (
             tasks.map((item) => (
                <TugasCard 
                    key={item.id} 
                    data={item}
                    // INI YANG MEMPERBAIKI ERROR ANDA:
                    onDetailClick={() => setSelectedTask(item)} 
                />
             ))
          )}
       </div>

       {/* MODAL DETAIL (Agar bisa diklik) */}
       {selectedTask && (
            <TaskDetailModal
                isOpen={true}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
            />
       )}

    </div>
  )
}