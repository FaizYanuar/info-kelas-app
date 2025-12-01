"use client"
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface AddModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
    onSuccess: () => void;
}

export default function AddScheduleModal({ isOpen, onClose, selectedDate, onSuccess }: AddModalProps) {
    // State Form
    const [subjectList, setSubjectList] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [room, setRoom] = useState('');
    const [timeText, setTimeText] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Ambil daftar matkul saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            const fetchSubjects = async () => {
                const { data } = await supabase
                    .from('subjects')
                    .select('id, name, lecturers(name)');
                setSubjectList(data || []);
            };
            fetchSubjects();
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!selectedSubject || !room || !timeText) {
            alert("Mohon lengkapi semua data");
            return;
        }

        setIsSaving(true);
        const dateString = selectedDate.toLocaleDateString('en-CA');

        const { error } = await supabase
            .from('additional_schedules')
            .insert({
                date: dateString,
                subject_id: parseInt(selectedSubject),
                room: room,
                time_text: timeText,
                sort_index: parseInt(timeText.split('/')[0]) || 1 // Ambil angka depan jam sebagai sort
            });

        setIsSaving(false);

        if (!error) {
            // Reset Form
            setRoom('');
            setTimeText('');
            setSelectedSubject('');
            onSuccess(); // Refresh halaman utama
            onClose();   // Tutup modal
        } else {
            alert("Gagal menambah jadwal");
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="bg-[#2051A2] p-4">
                    <h2 className="text-white font-semibold text-lg">Tambah Jadwal Pengganti</h2>
                    <p className="text-blue-100 text-xs">
                        Untuk tanggal: {selectedDate.toLocaleDateString('id-ID', { dateStyle: 'full' })}
                    </p>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    
                    {/* Dropdown Matkul */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Mata Kuliah</label>
                        <select 
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Pilih Mata Kuliah --</option>
                            {subjectList.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name} ({sub.lecturers?.name})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3">
                        {/* Input Ruang */}
                        <div className="w-1/2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Ruang</label>
                            <input 
                                type="text"
                                placeholder="K..."
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Input Jam */}
                        <div className="w-1/2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Jam</label>
                            <input 
                                type="text"
                                placeholder="1/2/3"
                                value={timeText}
                                onChange={(e) => setTimeText(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={isSaving}
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#D06E49] hover:bg-[#b55c3b] rounded-lg transition-colors"
                    >
                        {isSaving ? 'Menyimpan...' : 'Tambah'}
                    </button>
                </div>
            </div>
        </div>
    )
}