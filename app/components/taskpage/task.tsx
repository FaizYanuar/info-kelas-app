"use client"
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import TaskDetailModal from '../../components/taskpage/TaskDetailModal';
import AddTaskModal from '../../components/taskpage/AddTaskModal'; 
import { Task } from '../../components/taskpage/types';
import TugasCard from './tugascard';

const formatDeadline = (isoString: string) => {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
    const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { datePart, timePart };
}

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State Modal
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // <--- STATE MODAL TAMBAH

    // --- FETCH DATA (Dipisah jadi fungsi agar bisa dipanggil ulang) ---
    const fetchTasks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('assignments')
            .select(`
                id, title, description, deadline, submission_link, attachments,
                subjects ( name, lecturers ( name ) )
            `)
            .order('deadline', { ascending: true });

        if (error) {
            console.error("Error fetching tasks:", error);
        } else {
            const formattedData: Task[] = (data || []).map((item: any) => {
                const { datePart, timePart } = formatDeadline(item.deadline);
                return {
                    id: item.id,
                    subject: item.subjects.name,
                    lecturer: item.subjects.lecturers.name,
                    title: item.title,
                    description: item.description,
                    deadlineDate: datePart, 
                    deadlineTime: timePart,
                    submissionLink: item.submission_link,
                    attachments: item.attachments,
                    status: 'pending'
                };
            });
            setTasks(formattedData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // --- KOMPONEN TOMBOL TAMBAH (Reusable Style) ---
    const TombolTambah = () => (
        <div className='sm:container sm:mx-auto sm:max-w-1/3 mb-4'>
            <div className='flex justify-center px-4'>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className='w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#D06E49] hover:text-[#D06E49] hover:bg-orange-50 transition-all flex justify-center items-center gap-2 group'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-gray-400 group-hover:text-[#D06E49] transition-colors"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6z"/></svg>
                    Tambah Tugas Baru
                </button>
            </div>
        </div>
    );

    return (
        <div className='bg-[#EDEBE8] min-h-screen pb-24'>
            
            {/* Header */}
            <div className='bg-[#2051A2] pt-4 pb-4 px-6 rounded-b-3xl shadow-lg mb-6'>
                <h1 className='text-white text-2xl font-bold'>Daftar Tugas</h1>
                <p className='text-blue-100 text-sm'>Selesaikan sebelum deadline!</p>
            </div>

            {/* List Tugas */}
            <div className='px-2'>
                {loading ? (
                    <div className='text-center py-10 text-gray-400 animate-pulse'>Memuat tugas...</div>
                ) : tasks.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-10'>
                        {/* Tombol di atas jika kosong */}
                        <div className="w-full mb-8">
                            <TombolTambah />
                        </div>
                        <p className='text-gray-400'>Tidak ada tugas aktif. Horee! 🎉</p>
                    </div>
                ) : (
                    <>
                        {tasks.map((task) => (
                            <TugasCard 
                                key={task.id} 
                                data={task} 
                                onDetailClick={() => setSelectedTask(task)} 
                            />
                        ))}
                        {/* Tombol di bawah jika ada data */}
                        <TombolTambah />
                    </>
                )}
                
            </div>

            {/* --- MODAL DETAILS --- */}
            <TaskDetailModal 
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
            />

            {/* --- MODAL TAMBAH (BARU) --- */}
            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchTasks} // Refresh data setelah tambah sukses
            />
            
        </div>
    )
}