"use client"
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

// Tambahkan is_additional ke interface
interface JadwalProps {
    selectedDate: Date;
    onUpdate: () => void;
    data: {
        id: number;
        is_additional?: boolean; // <--- PROPS BARU DARI PAGE.TSX
        room: string;
        time_text: string;
        subjects: {
            name: string;
            lecturers: { name: string };
        };
        session_logs: {
            id?: number;
            status: string;
            note: string | null;
        }[];
    }
}

export default function JadwalCard({ data, selectedDate, onUpdate }: JadwalProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const log = data.session_logs?.[0];
    
    const [editStatus, setEditStatus] = useState(log?.status || 'present_offline');
    const [editNote, setEditNote] = useState(log?.note || '');

    // ... (Logika Status Badge TETAP SAMA, tidak perlu diubah) ...
    let statusBadge;
    let containerBorder = 'border-gray-200';
    let statusIndicatorColor = 'bg-green-600';

    if (log?.status === 'absent') {
        statusBadge = <h1 className='bg-red-200 text-red-800 text-xs mt-1 px-2 py-1 w-fit rounded-xl font-bold'>TIDAK HADIR</h1>;
        containerBorder = 'border-red-200 bg-red-50';
        statusIndicatorColor = 'bg-red-600';
    } else if (log?.status === 'present_online') {
        statusBadge = <h1 className='bg-blue-200 text-blue-800 text-xs mt-1 px-2 py-1 w-fit rounded-xl font-bold'>ONLINE</h1>;
        statusIndicatorColor = 'bg-blue-500';
    } else {
        statusBadge = <h1 className='bg-[#D9D9D9] text-[#834646] text-xs mt-1 px-2 py-1 w-fit rounded-xl'>OFFLINE</h1>;
    }


    // --- FUNGSI SIMPAN BARU (DUA JALUR) ---
    const handleSave = async () => {
        setIsSaving(true);
        let error;

        // JALUR 1: JIKA INI JADWAL TAMBAHAN
        if (data.is_additional) {
            // Update langsung ke tabel additional_schedules berdasarkan ID-nya
            const res = await supabase
                .from('additional_schedules')
                .update({ 
                    status: editStatus, 
                    note: editNote 
                })
                .eq('id', data.id); // ID di sini adalah ID additional_schedules
            
            error = res.error;
        } 
        
        // JALUR 2: JIKA INI JADWAL RUTIN MINGGUAN
        else {
            const dateString = selectedDate.toLocaleDateString('en-CA');
            const payload = {
                weekly_schedule_id: data.id, // ID di sini adalah weekly_schedule_id
                date: dateString,
                status: editStatus,
                note: editNote
            };

            // Pakai Upsert seperti sebelumnya
            const res = await supabase
                .from('session_logs')
                .upsert(payload, { onConflict: 'weekly_schedule_id, date' });
            
            error = res.error;
        }

        setIsSaving(false);
        if (!error) {
            setIsModalOpen(false);
            onUpdate(); // Refresh halaman
        } else {
            alert("Gagal menyimpan perubahan!");
            console.error(error);
        }
    };

    return (
        // ... (Render JSX TETAP SAMA PERSIS dengan sebelumnya) ...
        // ... Pastikan Anda menggunakan kode JSX return yang sama ...
        <>
            {/* Kartu Utama */}
            <div className='sm:container sm:mx-auto mb-4'>
                <div className='flex justify-center px-4'>
                    <div className={`items-center w-full gap-2 py-1 px-4 bg-white rounded-xl shadow-md border ${containerBorder}`}>
                        
                        {/* Header */}
                        <div className='flex justify-between items-center w-full border-b py-2 border-[#D9D9D9]'>
                            <div className='flex-1 pr-2'>
                                <h1 className='font-medium truncate'>{data.subjects.name}</h1>
                                <h1 className='uppercase font-medium text-[#834646] text-sm'>{data.subjects.lecturers.name}</h1>
                                {statusBadge}
                            </div>
                            <div className={`${statusIndicatorColor} w-[35px] h-[35px] rounded-full shadow-inner`}></div>
                        </div>

                        {/* Body */}
                        <div className={`${isExpanded ? 'flex flex-col py-2' : 'flex justify-between items-center'}`}>
                            {!isExpanded ? (
                                <div className='flex'>
                                    <h1 className='text-xl font-medium py-2 pr-5 border-r border-gray-200 w-fit'>{data.room}</h1>
                                    <h1 className='text-xl font-medium py-2 pl-5'>{data.time_text}</h1>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-0 mt-2 animate-in fade-in zoom-in duration-300'>
                                    <div className='flex items-center gap-4'>
                                        <h1 className='text-[#834646] font-semibold text-sm uppercase w-16 tracking-wide'>RUANG</h1>
                                        <h1 className='text-3xl font-medium text-black'>{data.room}</h1>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <h1 className='text-[#834646] font-semibold text-sm uppercase w-16 tracking-wide'>JAM</h1>
                                        <h1 className='text-3xl font-medium text-black'>{data.time_text}</h1>
                                    </div>

                                    {/* Note Section */}
                                    <div className='mt-3 pt-2 border-t border-dashed border-gray-300'>
                                        <p className='text-xs font-bold text-gray-500'>Catatan:</p>
                                        <p className='text-sm text-gray-600 leading-relaxed min-h-5'>
                                            {log?.note ? log.note : "-"}
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Buttons */}
                            <div className={`flex gap-2 transition-all ${isExpanded ? 'ml-auto mt-4' : ''}`}>
                                {isExpanded && (
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className='font-medium text-[10px] bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl py-1.5 px-3 transition-all'
                                    >
                                        Edit
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className='font-medium text-[10px] bg-[#D06E49] rounded-xl py-1.5 px-3 text-white transition-all'
                                >
                                    {isExpanded ? 'Tutup' : 'Lihat Selengkapnya'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit (Copy paste modal yang sama dari kode sebelumnya) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="bg-[#2051A2] p-4">
                            <h2 className="text-white font-semibold text-lg">Edit Info Kelas</h2>
                            <p className="text-blue-100 text-xs">{data.subjects.name}</p>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Status Kehadiran</label>
                                <select 
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="present_offline">Hadir (Offline)</option>
                                    <option value="present_online">Hadir (Online)</option>
                                    <option value="absent">Tidak Hadir</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Catatan / Info</label>
                                <textarea 
                                    rows={3}
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                    placeholder="Contoh: Bawa laptop..."
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg">Batal</button>
                            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#D06E49] hover:bg-[#b55c3b] rounded-lg">
                                {isSaving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}