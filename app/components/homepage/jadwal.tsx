"use client"
import React, { useState } from 'react'

// Definisikan bentuk data yang diterima dari Parent
interface JadwalProps {
    data: {
        id: number;
        room: string;
        time_text: string;
        subjects: {
            name: string;
            lecturers: {
                name: string;
            };
        };
        // session_logs adalah array, bisa kosong (hadir) atau ada isinya (absen/catatan)
        session_logs: {
            status: string;
            note: string | null;
        }[];
    }
}

export default function JadwalCard({ data }: JadwalProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Cek apakah ada log untuk hari ini
    const log = data.session_logs?.[0]; // Ambil log pertama jika ada
    const isAbsent = log?.status === 'absent';
    const note = log?.note;

    // Tentukan warna status (Merah jika absen, Hijau/Default jika hadir)
    const statusColor = isAbsent ? 'bg-red-600' : 'bg-green-600';

    return (
        <div className='sm:container sm:mx-auto sm:max-w-1/3 mb-4'> {/* mb-4 untuk jarak antar kartu */}
            <div className='flex justify-center px-4'>
                <div className={`items-center w-full gap-2 py-1 px-4 bg-white rounded-xl shadow-[0px_4px_4px_0px_rgba(99,104,114,0.25)] border ${isAbsent ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                    
                    {/* --- HEADER --- */}
                    <div className='flex justify-between items-center w-full border-b py-2 border-[#D9D9D9]'>
                        <div className='flex-1 pr-2'>
                            <h1 className='font-medium truncate'>{data.subjects.name}</h1>
                            <h1 className='uppercase font-medium text-[#834646] text-sm'>{data.subjects.lecturers.name}</h1>
                            
                            {/* Tampilkan Status */}
                            {isAbsent ? (
                                <h1 className='bg-red-200 text-red-800 text-xs mt-1 px-2 py-1 w-fit rounded-xl font-bold'>DIBATALKAN</h1>
                            ) : (
                                <h1 className='bg-[#D9D9D9] text-[#834646] text-xs mt-1 px-2 py-1 w-fit rounded-xl'>OFFLINE</h1>
                            )}
                        </div>
                        {/* Indikator Bulat (Status) */}
                        <div className={`${statusColor} w-[35px] h-[35px] rounded-full shadow-inner`}></div>
                    </div>

                    {/* --- BODY --- */}
                    <div className={`${isExpanded ? 'flex flex-col py-2' : 'flex justify-between items-center'}`}>
                        
                        {!isExpanded ? (
                            // TAMPILAN TUTUP
                            <div className='flex'>
                                <h1 className='text-xl font-medium py-2 pr-5 border-r border-gray-200 w-fit'>{data.room}</h1>
                                <h1 className='text-xl font-medium py-2 pl-5'>{data.time_text}</h1>
                            </div>
                        ) : (
                            // TAMPILAN BUKA
                            <div className='flex flex-col gap-0 mt-2 animate-in fade-in zoom-in duration-300'>
                                <div className='flex items-center gap-4'>
                                    <h1 className='text-[#834646] font-semibold text-sm uppercase w-16 tracking-wide'>RUANG</h1>
                                    <h1 className='text-3xl font-medium text-black'>{data.room}</h1>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <h1 className='text-[#834646] font-semibold text-sm uppercase w-16 tracking-wide'>JAM</h1>
                                    <h1 className='text-3xl font-medium text-black'>{data.time_text}</h1>
                                </div>

                                {/* Area Catatan (Muncul jika ada note ATAU dosen absen) */}
                                {(note || isAbsent) && (
                                    <div className='mt-3 pt-2 border-t border-dashed border-gray-300'>
                                        <p className='text-xs font-bold text-gray-500'>Catatan:</p>
                                        <p className='text-sm text-gray-600 leading-relaxed'>
                                            {isAbsent ? "Dosen berhalangan hadir." : note}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`font-medium text-[10px] bg-[#D06E49] rounded-xl py-1.5 px-3 text-white transition-all ${isExpanded ? 'ml-auto mt-4' : ''}`}
                        >
                            {isExpanded ? 'Tutup' : 'Lihat Selengkapnya'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}