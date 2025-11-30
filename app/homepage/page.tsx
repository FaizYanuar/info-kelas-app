"use client"
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' // Pastikan path ini benar sesuai struktur folder Anda
import Tanggal from '../components/homepage/tanggal'
import JadwalCard from '../components/homepage/jadwal'
import BottomNavbar from '../components/homepage/navbar'

export default function Homepage() {
  
  // 1. STATE: Menyimpan tanggal yang dipilih (Default: Hari ini)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 2. STATE: Menyimpan data jadwal dari database
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 3. FUNGSI: Mengambil data dari Supabase
  const fetchSchedules = async (date: Date) => {
    setLoading(true);

    // Ambil hari dalam angka (0=Minggu, 1=Senin, dst)
    const dayOfWeek = date.getDay();

    // Format tanggal ke YYYY-MM-DD untuk mencocokkan dengan tabel logs
    // 'en-CA' adalah trik cepat untuk dapat format YYYY-MM-DD lokal
    const dateString = date.toLocaleDateString('en-CA'); 

    // Query ke Supabase
    const { data, error } = await supabase
      .from('weekly_schedules')
      .select(`
        id,
        room,
        time_text,
        sort_index,
        subjects (
          name,
          lecturers ( name )
        ),
        session_logs (
          status,
          note
        )
      `)
      .eq('day_of_week', dayOfWeek) // Filter sesuai hari (Senin/Selasa/dst)
      .eq('session_logs.date', dateString) // Filter log KHUSUS tanggal ini
      .order('sort_index', { ascending: true }); // Urutkan berdasarkan jam mulai

    if (error) {
      console.error('Error fetching schedules:', error);
    } else {
      setSchedules(data || []);
    }
    
    setLoading(false);
  };

  // 4. EFFECT: Jalankan fetch setiap kali 'selectedDate' berubah
  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  return (
    <div className='bg-[#EDEBE8] h-screen overflow-auto'>

      {/* Kirim State ke komponen Tanggal:
        1. selectedDate: Agar Tanggal tahu hari apa yang harus di-highlight (oranye)
        2. onDateChange: Agar Tanggal bisa mengubah state di sini saat tombol diklik
      */}
      <Tanggal 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      <div className='pb-24 px-2 mt-4'> {/* Tambah px-2 dan mt-4 agar rapi */}
        
        {/* LOGIKA RENDERING JADWAL */}
        {loading ? (
          // Tampilan Loading
          <div className='text-center text-gray-400 py-10 animate-pulse'>
            Memuat jadwal...
          </div>
        ) : schedules.length === 0 ? (
          // Tampilan Jika Kosong (Hari Libur/Minggu)
          <div className='flex flex-col items-center justify-center py-10 text-gray-400 opacity-70'>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z"/></svg>
            <p className='mt-2 font-medium'>Tidak ada jadwal kuliah.</p>
          </div>
        ) : (
          // Tampilan Data (Looping Kartu)
          schedules.map((item) => (
            <JadwalCard key={item.id} data={item} />
          ))
        )}

      </div>
      
      <BottomNavbar />
    </div>
  )
}