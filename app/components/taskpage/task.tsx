"use client"
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import TaskDetailModal from '../../components/taskpage/TaskDetailModal';
import AddTaskModal from '../../components/taskpage/AddTaskModal';
import { Task } from '../../components/taskpage/types';
import TugasCard from './tugascard';
import Link from 'next/link';

// Helper format date
const formatDeadline = (isoString: string) => {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
    const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { datePart, timePart };
}

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    // FIX: Removed duplicate isLoading, kept just 'loading'
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // State Modal
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setIsAdmin(true);
        }
    };

    // --- FETCH DATA (Active Tasks Only) ---
    const fetchTasks = async () => {
        setLoading(true);

        // Calculate Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

       const { data, error } = await supabase
            .from('assignments')
            .select(`
                id, title, description, deadline, submission_link, attachments, status,
                subjects ( name, lecturers ( name ) )
            `)
            .gte('deadline', todayISO) // Ambil tugas masa depan
            .neq('status', 'completed') // <--- WAJIB DITAMBAH: Jangan ambil yang sudah selesai
            .order('deadline', { ascending: true });

        if (error) {
            console.error("Error fetching tasks:", error);
        } else {
            const formattedData: Task[] = (data || []).map((item: any) => {
                const { datePart, timePart } = formatDeadline(item.deadline);
                return {
                    id: item.id,
                    subject: item.subjects?.name || 'Unknown', // Added safety check
                    lecturer: item.subjects?.lecturers?.name || 'Unknown',
                    title: item.title,
                    description: item.description,
                    deadlineDate: datePart,
                    deadlineTime: timePart,
                    submissionLink: item.submission_link,
                    attachments: item.attachments,
                    status: 'pending',
                    deadline: item.deadline // Keep raw deadline if needed
                };
            });
            setTasks(formattedData);
        }
        setLoading(false);
    };

    // --- KOMPONEN TOMBOL TAMBAH (Reusable Style) ---
    const TombolTambah = () => (
        <div className='sm:container sm:mx-auto sm:max-w-1/3 mb-4'>
            <div className='flex justify-center px-4'>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className='w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#D06E49] hover:text-[#D06E49] hover:bg-orange-50 transition-all flex justify-center items-center gap-2 group'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-gray-400 group-hover:text-[#D06E49] transition-colors"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6z" /></svg>
                    Tambah Tugas Baru
                </button>
            </div>
        </div>
    );

    return (
        <div className='bg-[#EDEBE8] min-h-screen pb-24'>

            {/* Header */}
            <div className='bg-[#2051A2] pt-4 pb-4 px-6 rounded-b-3xl shadow-lg mb-6 flex justify-between items-center'>
                <div>
                    <h1 className='text-white text-2xl font-bold'>Daftar Tugas</h1>
                    <p className='text-blue-100 text-sm'>Selesaikan sebelum deadline!</p>
                </div>

                <Link href={'/taskpage/archive'}>
                    <button
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm11-5.5l-4 4l-4-4l1.41-1.41L11 13.67V10h2v3.67l1.59-1.58L16 13.5z" /></svg>
                        Arsip
                    </button>
                </Link>
            </div>

            {/* List Tugas */}
            <div className='px-2'>
                {loading ? (
                    <div className='text-center py-10 text-gray-400 animate-pulse'>Memuat tugas...</div>
                ) : tasks.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-10'>
                        <div className="w-full mb-8">
                            {/* Show Add Button even if empty, if Admin */}
                            {isAdmin && <TombolTambah />}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 14 14"><g fill="none" stroke="#ABAEB5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7"><path d="M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13" /><path d="M8.367 5.69c.157-.255.5-.418.834-.418s.678.163.835.417m-4.403.001c-.157-.255-.5-.418-.834-.418s-.678.163-.835.417m.216 2.945a1.41 1.41 0 1 0 2.819 0a1.41 1.41 0 0 0 2.82 0" /></g></svg>
                        <h2 className='text-xl font-bold text-gray-600'>Horee! 🎉</h2>
                        <p className='text-sm mt-1 text-gray-500'>Tidak ada tugas aktif.</p>
                    </div>
                ) : (
                    <>
                        {tasks.map((task) => (
                            <TugasCard
                                key={task.id}
                                data={task}
                                onDetailClick={() => setSelectedTask(task)} // Ensure TugasCard handles this prop
                            />
                        ))}
                        {/* Tombol di bawah jika ada data */}
                        {isAdmin && (
                            <TombolTambah />
                        )}
                    </>
                )}

            </div>

            {/* --- MODAL DETAILS --- */}
            {selectedTask && (
                <TaskDetailModal
                    isOpen={true}
                    onClose={() => setSelectedTask(null)}
                    task={selectedTask}
                />
            )}

            {/* --- MODAL TAMBAH (BARU) --- */}
            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchTasks} // Refresh data setelah tambah sukses
            />

        </div>
    )
}