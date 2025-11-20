"use client"
import React, { useState } from 'react';

// Helper: Format tanggal pill atas (e.g., "16 NOV, SUN")
const formatDisplayDate = (date: Date) => {
    const month = date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const day = date.getDate();
    return `${day} ${month}, ${weekday}`;
}

// Helper: Buat array 7 hari ke depan, mulai dari 'baseDate'
const getWeekDays = (baseDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        days.push({
            key: date.toISOString(),
            day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: date.getDate(),
            fullDate: date,
        });
    }
    return days;
};

// Helper: Cek jika 2 tanggal adalah hari yang sama
const isSameDay = (d1: Date, d2: Date) => {
    return d1.toDateString() === d2.toDateString();
};


export default function Tanggal() {

    // State utama untuk tanggal yang sedang aktif
    const [currentDate, setCurrentDate] = useState(new Date());

    // Handler: Mundur 1 hari
    const handlePrevDay = () => {
        setCurrentDate(prevDate => {
            const prev = new Date(prevDate);
            prev.setDate(prev.getDate() - 1);
            return prev;
        });
    };

    // Handler: Maju 1 hari
    const handleNextDay = () => {
        setCurrentDate(prevDate => {
            const next = new Date(prevDate);
            next.setDate(next.getDate() + 1);
            return next;
        });
    };

    const handleGoToday = () => {
        setCurrentDate(new Date());
    };

    // Format tanggal untuk pill atas (berdasarkan state)
    const formattedDate = formatDisplayDate(currentDate);

    // Hitung ulang 7 hari (berdasarkan state)
    // Ini membuat slider "bergeser"
    const weekDays = getWeekDays(currentDate);

    return (
        <div>
            {/* --- PILL ATAS --- */}
            <div className="flex justify-center p-4">
                <div className=" mt-6 flex justify-between w-screen">
                    <div className='inline-flex items-center gap-2 py-1 px-4 bg-white rounded-xl shadow-sm  border border-gray-200'>
                        {/* Tombol "Prev" */}
                        <button onClick={handlePrevDay} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="34" viewBox="0 0 12 24">
                                <g transform="rotate(180 6 12)">
                                    <path fill="currentColor" fillRule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414" />
                                </g>
                            </svg>
                        </button>

                        {/* Teks tanggal dinamis */}
                        <span className="font-medium text-gray-900 text-xl tracking-wide w-36 text-center">
                            {formattedDate}
                        </span>

                        {/* Tombol "Next" */}
                        <button onClick={handleNextDay} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="34" viewBox="0 0 12 24"><path fill="currentColor" fillRule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414" /></svg>
                        </button>
                    </div>
                    <button 
                    onClick={handleGoToday}
                    // Saya menyalin class dari snippet yang Anda kirim
                    className='inline-flex items-center gap-4 py-1 px-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all'
                >
                    <h1 className='font-medium text-gray-900 text-lg tracking-wide'>TODAY</h1>
                </button>
                </div>

            </div>

            {/* --- SLIDER KARTU BAWAH --- */}
            <div className='p-4 sm:flex sm:justify-center '>
                <div className='bg-[#2051A2] py-10 px-5 rounded-xl shadow-[0px_6px_4px_0px_rgba(0,0,0,0.25)]'>
                    {/* 'no-scrollbar' adalah kelas custom dari globals.css */}
                    <div className='flex gap-3 overflow-x-auto pb-1 no-scrollbar'>

                        {/* Loop untuk 7 kartu hari */}
                        {weekDays.map((day, index) => (
                            <button
                                key={day.key}
                                // Update state saat kartu diklik
                                onClick={() => setCurrentDate(day.fullDate)}

                                // Ganti style: Kartu pertama (index 0) selalu aktif
                                className={`
                                    shrink-0 
                                    w-16 
                                    py-2 px-2 text-center rounded-lg shadow-sm 
                                    transition-colors duration-200
                                    ${index === 0
                                        ? 'bg-[#D06E49] text-white' // Aktif
                                        : 'bg-white/10 text-[#CFCFCF] hover:bg-white/20' // Inaktif
                                    }
                                `}
                            >
                                <h1 className='text-lg font-medium'>{day.day}</h1>
                                <h1 className='text-3xl font-bold'>{day.date}</h1>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}