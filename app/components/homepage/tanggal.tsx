"use client"
import React, { useEffect, useState } from 'react';

// --- 1. DEFINISI PROPS (Agar bisa komunikasi dengan Homepage) ---
interface TanggalProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

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

// --- KOMPONEN UTAMA ---
// Menerima props 'selectedDate' dan 'onDateChange' dari Homepage
export default function Tanggal({ selectedDate, onDateChange }: TanggalProps) {

    // Kita gunakan state lokal ini agar slider terasa responsif
    // Slider selalu dimulai dari tanggal yang dipilih (agar selected date selalu di kiri/index 0)
    const [sliderStartDate, setSliderStartDate] = useState(selectedDate);

    // Sinkronisasi: Jika Parent mengubah tanggal, update slider lokal kita
    useEffect(() => {
        setSliderStartDate(selectedDate);
    }, [selectedDate]);

    // Handler: Mundur 1 hari
    const handlePrevDay = () => {
        const prev = new Date(selectedDate);
        prev.setDate(selectedDate.getDate() - 1);

        onDateChange(prev); // Lapor ke Homepage
        setSliderStartDate(prev); // Geser slider
    };

    // Handler: Maju 1 hari
    const handleNextDay = () => {
        const next = new Date(selectedDate);
        next.setDate(selectedDate.getDate() + 1);

        onDateChange(next); // Lapor ke Homepage
        setSliderStartDate(next); // Geser slider
    };

    // Handler: Kembali ke Hari Ini
    const handleGoToday = () => {
        const today = new Date();
        onDateChange(today);    // Lapor ke Homepage
        setSliderStartDate(today); // Geser slider
    };

    // Format tampilan tanggal berdasarkan apa yang dipilih di Homepage
    const formattedDate = formatDisplayDate(selectedDate);

    // Generate list kartu berdasarkan sliderStartDate
    const weekDays = getWeekDays(sliderStartDate);

    return (
        <div className='sm:container sm:mx-auto'>
            <div className='bg-[#2051A2] px-6 pt-4 pb-4 rounded-b-3xl shadow-md shrink-0 flex justify-between items-center'>
                <div>
                    <h1 className='text-white text-2xl font-bold'>Jadwal Kelas</h1>
                    <p className='text-blue-100 text-sm'>Ada jadwal apa hari ini ya?</p>
                </div>
            </div>
            {/* --- PILL ATAS --- */}
            <div className="flex justify-center px-4">
                <div className=" mt-6 flex justify-between w-screen">
                    <div className='inline-flex items-center gap-2 py-1 px-4 bg-white rounded-xl shadow-sm border border-gray-200'>
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

                    {/* Tombol Today */}
                    <button
                        onClick={handleGoToday}
                        className='inline-flex items-center gap-4 py-1 px-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all'
                    >
                        <h1 className='font-medium text-gray-900 text-lg tracking-wide'>TODAY</h1>
                    </button>
                </div>
            </div>

            {/* --- SLIDER KARTU BAWAH --- */}
            <div className='py-4 sm:flex sm:justify-center px-4'>
                <div className='bg-[#2051A2] py-10 px-5 rounded-xl shadow-[0px_6px_4px_0px_rgba(0,0,0,0.25)]'>
                    {/* 'no-scrollbar' adalah kelas custom dari globals.css */}
                    <div className='flex gap-3 overflow-x-auto pb-1 no-scrollbar'>

                        {/* Loop untuk 7 kartu hari */}
                        {weekDays.map((day) => {
                            // Cek apakah ini hari yang dipilih (untuk pewarnaan)
                            const isSelected = day.fullDate.toDateString() === selectedDate.toDateString();

                            return (
                                <button
                                    key={day.key}
                                    // Update Parent saat kartu diklik
                                    onClick={() => {
                                        onDateChange(day.fullDate);
                                        setSliderStartDate(day.fullDate); // Agar slider tetap diam di posisi tanggal terpilih (index 0)
                                    }}

                                    className={`shrink-0 w-16 py-2 px-2 text-center rounded-lg shadow-sm transition-colors duration-200
                                    ${isSelected
                                            ? 'bg-[#D06E49] text-white' // Aktif
                                            : 'bg-white/10 text-[#CFCFCF] hover:bg-white/20' // Inaktif
                                        }
                                    `}
                                >
                                    <h1 className='text-lg font-medium'>{day.day}</h1>
                                    <h1 className='text-3xl font-bold'>{day.date}</h1>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}