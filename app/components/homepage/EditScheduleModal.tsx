"use client"
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    data: any;         // Data jadwal saat ini
    selectedDate: Date;
}

export default function EditScheduleModal({ isOpen, onClose, onSuccess, data, selectedDate }: EditModalProps) {
    const log = data.session_logs?.[0];
    
    // Initial State
    const [status, setStatus] = useState(log?.status || 'present_offline');
    const [note, setNote] = useState(log?.note || '');
    
    // State Ruang & Waktu (Defaultnya ambil dari log override jika ada, kalau gak ada ambil dari jadwal asli)
    const [room, setRoom] = useState(log?.room_override || data.room);
    const [timeText, setTimeText] = useState(log?.time_text_override || data.time_text);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        let error;

        // JALUR 1: Jadwal Tambahan (Langsung update row di tabel additional_schedules)
        if (data.is_additional) {
            const res = await supabase
                .from('additional_schedules')
                .update({ 
                    status, 
                    note,
                    room,       // Update Ruang
                    time_text: timeText // Update Waktu
                })
                .eq('id', data.id);
            error = res.error;
        } 
        
        // JALUR 2: Jadwal Rutin (Simpan ke session_logs)
        else {
            const dateString = selectedDate.toLocaleDateString('en-CA');
            const payload = {
                weekly_schedule_id: data.id,
                date: dateString,
                status,
                note,
                room_override: room,          // Simpan perubahan ruang
                time_text_override: timeText  // Simpan perubahan waktu
            };

            const res = await supabase
                .from('session_logs')
                .upsert(payload, { onConflict: 'weekly_schedule_id, date' });
            error = res.error;
        }

        setIsSaving(false);
        if (!error) {
            onSuccess();
            onClose();
        } else {
            alert("Gagal menyimpan!");
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="bg-[#2051A2] p-4">
                    <h2 className="text-white font-semibold text-lg">Edit Info Kelas</h2>
                    <p className="text-blue-100 text-xs truncate">{data.subjects.name}</p>
                </div>

                {/* Form Body */}
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    
                    {/* Status */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Status Kehadiran</label>
                        <select 
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="present_offline">Hadir (Offline)</option>
                            <option value="present_online">Hadir (Online)</option>
                            <option value="absent">Tidak Hadir</option>
                        </select>
                    </div>

                    {/* Ruang & Waktu (Row) */}
                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Ruang</label>
                            <input 
                                type="text"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Jam</label>
                            <input 
                                type="text"
                                value={timeText}
                                onChange={(e) => setTimeText(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Catatan */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Catatan</label>
                        <textarea 
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Contoh: Bawa laptop..."
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg">Batal</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#D06E49] hover:bg-[#b55c3b] rounded-lg">
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    )
}