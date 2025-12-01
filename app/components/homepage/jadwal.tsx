"use client"
import React, { useState } from 'react'
import EditScheduleModal from './EditScheduleModal' // Import Modal Baru

interface JadwalProps {
    selectedDate: Date;
    onUpdate: () => void;
    data: any; // Bisa disederhanakan jadi any atau definisikan tipe lengkap
}

export default function JadwalCard({ data, selectedDate, onUpdate }: JadwalProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const log = data.session_logs?.[0];
    
    // --- LOGIKA TAMPILAN DINAMIS ---
    // Jika ada override di log, pakai itu. Jika tidak, pakai data asli jadwal.
    const displayRoom = log?.room_override || data.room;
    const displayTime = log?.time_text_override || data.time_text;

    // Logika Status Badge (Sama seperti sebelumnya)
    let statusBadge;
    let containerBorder = 'border-gray-200';
    let statusIndicatorColor = 'bg-[#2BCB1F]';

    if (log?.status === 'absent') {
        statusBadge = <h1 className='bg-red-200 text-red-800 text-xs mt-1 px-2 py-1 w-fit rounded-xl font-bold'>TIDAK HADIR</h1>;
        containerBorder = 'border-red-200 bg-[#CB1F1F]';
        statusIndicatorColor = 'bg-red-600';
    } else if (log?.status === 'present_online') {
        statusBadge = <h1 className='bg-blue-200 text-blue-800 text-xs mt-1 px-2 py-1 w-fit rounded-xl font-bold'>ONLINE</h1>;
        statusIndicatorColor = 'bg-blue-500';
    } else {
        statusBadge = <h1 className='bg-[#D9D9D9] text-[#834646] text-xs mt-1 px-2 py-1 w-fit rounded-xl'>OFFLINE</h1>;
    }

    return (
        <>
            <div className='sm:container sm:mx-auto mb-4'>
                <div className='flex justify-center px-4'>
                    <div className={`items-center w-full gap-2 py-1 px-4 bg-white rounded-xl shadow-md border ${containerBorder}`}>
                        
                        {/* Header */}
                        <div className='flex justify-between items-center w-full border-b py-2 border-[#D9D9D9] gap-3'>
                            <div className='flex-1 min-w-0'>
                                <h1 className='font-medium truncate'>{data.subjects.name}</h1>
                                <h1 className='uppercase font-medium text-[#834646] text-sm'>{data.subjects.lecturers.name}</h1>
                                {statusBadge}
                            </div>
                            <div className={`${statusIndicatorColor} w-[35px] h-[35px] rounded-full shadow-inner shrink-0`}></div>
                        </div>

                        {/* Body */}
                        <div className={`${isExpanded ? 'flex flex-col py-2' : 'flex justify-between items-center'}`}>
                            {!isExpanded ? (
                                <div className='flex'>
                                    {/* Gunakan variabel displayRoom/displayTime agar terupdate */}
                                    <h1 className='text-xl font-medium py-2 pr-5 border-r border-gray-200 w-fit'>{displayRoom}</h1>
                                    <h1 className='text-xl font-medium py-2 pl-5'>{displayTime}</h1>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-0 mt-2 animate-in fade-in zoom-in duration-300'>
                                    <div className='flex items-center gap-4'>
                                        <h1 className='text-[#834646] font-semibold text-sm uppercase w-16 tracking-wide'>RUANG</h1>
                                        <h1 className='text-3xl font-medium text-black'>{displayRoom}</h1>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <h1 className='text-[#834646] font-semibold text-sm uppercase w-16 tracking-wide'>JAM</h1>
                                        <h1 className='text-3xl font-medium text-black'>{displayTime}</h1>
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

            {/* Panggil Komponen Modal Terpisah */}
            <EditScheduleModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={onUpdate}
                data={data}
                selectedDate={selectedDate}
            />
        </>
    )
}