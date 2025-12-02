"use client"
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Tanggal from '../components/homepage/tanggal'
import JadwalCard from '../components/homepage/jadwal'
import BottomNavbar from '../components/homepage/navbar'
import AddScheduleModal from '../components/homepage/schedulemodal'

export default function Homepage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State untuk Modal Tambah
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchSchedules = async (date: Date) => {
    setLoading(true);
    const dayOfWeek = date.getDay();
    const dateString = date.toLocaleDateString('en-CA');

    // --- QUERY BARU DENGAN FILTER SEMESTER ---
    const regularQuery = supabase
      .from('weekly_schedules')
      .select(`
        id, room, time_text, sort_index,
        subjects ( name, lecturers ( name ) ),
        session_logs ( id, status, note, room_override, time_text_override ),
        semesters!inner ( is_active )  // <--- JOIN KE TABEL SEMESTER
      `)
      .eq('day_of_week', dayOfWeek)
      .eq('semesters.is_active', true) // <--- HANYA AMBIL YANG AKTIF
      .eq('session_logs.date', dateString); // (Cek log hari ini - teknik left join filter)

    // 2. Ambil Jadwal Tambahan (Sekarang ambil status & note juga)
    const additionalQuery = supabase
      .from('additional_schedules')
      .select(`
        id, room, time_text, sort_index, status, note,
        subjects ( name, lecturers ( name ) )
      `)
      .eq('date', dateString);

    const [regularRes, additionalRes] = await Promise.all([regularQuery, additionalQuery]);

    if (regularRes.error || additionalRes.error) {
      console.error('Error fetching data');
    } else {
      // --- PERBAIKAN: Tambahkan 'as any[]' ---

      // 1. Proses Data Regular
      // Kita paksa TS menganggap ini array (as any[]) agar tidak error saat map
      const regularData = ((regularRes.data as any[]) || []).map(item => ({
        ...item,
        is_additional: false
      }));

      // 2. Proses Data Tambahan
      // Kita paksa TS menganggap ini array (as any[]) juga
      const additionalData = ((additionalRes.data as any[]) || []).map(item => ({
        id: item.id,
        room: item.room,
        time_text: item.time_text,
        sort_index: item.sort_index,
        subjects: item.subjects,
        is_additional: true,

        // Trik: Masukkan status/note item ini ke dalam array session_logs palsu
        session_logs: [{
          status: item.status || 'present_offline',
          note: item.note
        }]
      }));

      // Gabungkan
      const combined = [...regularData, ...additionalData];

      // Urutkan
      combined.sort((a, b) => a.sort_index - b.sort_index);

      setSchedules(combined);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  // Tombol Tambah (Reusable Component)
  const TombolTambah = () => (
    <button
      onClick={() => setIsAddModalOpen(true)} // Buka Modal saat diklik
      className='w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#D06E49] hover:text-[#D06E49] hover:bg-orange-50 transition-all flex justify-center items-center gap-2 group'
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-gray-400 group-hover:text-[#D06E49] transition-colors"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6z" /></svg>
      Tambah Jadwal Pengganti
    </button>
  );

  return (
    <div className='bg-[#EDEBE8] h-screen overflow-auto'>
      <Tanggal selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <div className='pb-24 sm:px-4 sm:container sm:mx-auto sm:max-w-1/3 px-4'>
        {loading ? (
          <div className='text-center text-gray-400 py-10 animate-pulse'>Memuat jadwal...</div>
        ) : schedules.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-1'>
            <div className="w-full mb-10 px-4">
              <TombolTambah />
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 14 14"><g fill="none" stroke="#ABAEB5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7"><path d="M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13" /><path d="M8.367 5.69c.157-.255.5-.418.834-.418s.678.163.835.417m-4.403.001c-.157-.255-.5-.418-.834-.418s-.678.163-.835.417m.216 2.945a1.41 1.41 0 1 0 2.819 0a1.41 1.41 0 0 0 2.82 0" /></g></svg>
            <h2 className='text-xl font-bold text-gray-600'>Horee! 🎉</h2>
            <p className='text-sm mt-1 text-gray-500'>Hari ini tidak ada mata kuliah.</p>
          </div>
        ) : (
          <>
            {schedules.map((item) => (
              <JadwalCard
                key={item.id}
                data={item}
                selectedDate={selectedDate}
                onUpdate={() => fetchSchedules(selectedDate)}
              />
            ))}
            <TombolTambah />
          </>
        )}
      </div>

      <BottomNavbar />

      {/* Render Modal di sini */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedDate={selectedDate}
        onSuccess={() => fetchSchedules(selectedDate)} // Refresh data setelah tambah
      />

    </div>
  )
}