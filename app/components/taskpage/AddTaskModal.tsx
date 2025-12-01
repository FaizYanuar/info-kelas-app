"use client"
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface AddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddTaskModal({ isOpen, onClose, onSuccess }: AddModalProps) {
    // State Form
    const [subjectList, setSubjectList] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [link, setLink] = useState('');

    // State File Upload
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    // 1. Ambil daftar Matkul
    useEffect(() => {
        if (isOpen) {
            const fetchSubjects = async () => {
                const { data } = await supabase.from('subjects').select('id, name');
                setSubjectList(data || []);
            };
            fetchSubjects();
        }
    }, [isOpen]);

    // Helper: Handle File Change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Ubah FileList ke Array biasa
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
    };

    // Helper: Hapus file dari list sebelum upload
    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // 2. Fungsi Simpan & Upload
    const handleSave = async () => {
        if (!selectedSubject || !title || !date || !time) {
            alert("Mohon lengkapi Judul, Matkul, dan Deadline.");
            return;
        }

        setIsSaving(true);
        setUploadProgress('Mengupload file...');

        // A. PROSES UPLOAD FILE KE SUPABASE STORAGE
        const uploadedAttachments = [];

        for (const file of selectedFiles) {
            // Buat nama file unik: timestamp_namafile
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            
            // Upload ke bucket 'task-attachments'
            const { data, error } = await supabase.storage
                .from('task-attachments') // <--- Pastikan nama bucket ini SAMA dengan di dashboard
                .upload(fileName, file);

            if (error) {
                console.error("Gagal upload:", error);
                continue; // Skip file yang gagal, lanjut yang lain
            }

            // Dapatkan Public URL
            const { data: publicUrlData } = supabase.storage
                .from('task-attachments')
                .getPublicUrl(fileName);

            // Tentukan tipe (image atau file)
            const isImage = file.type.startsWith('image/');
            
            uploadedAttachments.push({
                type: isImage ? 'image' : 'file',
                name: file.name,
                url: publicUrlData.publicUrl
            });
        }

        setUploadProgress('Menyimpan tugas...');

        // B. SIMPAN DATA KE DATABASE
        const deadlineISO = new Date(`${date}T${time}`).toISOString();

        const { error } = await supabase
            .from('assignments')
            .insert({
                subject_id: parseInt(selectedSubject),
                title: title,
                description: description,
                deadline: deadlineISO,
                submission_link: link,
                attachments: uploadedAttachments // Simpan array JSON hasil upload
            });

        setIsSaving(false);
        setUploadProgress('');

        if (!error) {
            // Reset Form
            setTitle(''); setDescription(''); setDate(''); setTime(''); setLink(''); setSelectedSubject('');
            setSelectedFiles([]); // Reset file
            
            onSuccess();
            onClose();
        } else {
            alert("Gagal menambah tugas");
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="bg-[#2051A2] p-4">
                    <h2 className="text-white font-semibold text-lg">Tambah Tugas Baru</h2>
                    <p className="text-blue-100 text-xs">Upload materi PPT, PDF, atau Word di sini.</p>
                </div>

                {/* Form Body */}
                <div className="p-5 space-y-4 overflow-y-auto">
                    
                    {/* Judul & Matkul */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Mata Kuliah</label>
                        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Pilih Mata Kuliah --</option>
                            {subjectList.map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Judul Tugas</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Deadline */}
                    <div className="flex gap-3">
                        <div className="w-2/3">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tanggal</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Jam</label>
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Deskripsi</label>
                        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* --- INPUT FILE UPLOAD --- */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Lampiran (PDF, Word, PPT, Gambar)</label>
                        
                        {/* Tombol Upload Custom */}
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-6 h-6 text-gray-400 mb-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                <p className="text-xs text-gray-500">Klik untuk upload</p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                multiple 
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" // Batasi tipe file
                                onChange={handleFileChange} 
                            />
                        </label>

                        {/* List File Terpilih */}
                        {selectedFiles.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {selectedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg border border-blue-100">
                                        <span className="text-xs text-blue-700 truncate max-w-[200px]">{file.name}</span>
                                        <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Link Pengumpulan */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Link Pengumpulan</label>
                        <input type="url" value={link} onChange={(e) => setLink(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-blue-600" />
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg" disabled={isSaving}>Batal</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#D06E49] hover:bg-[#b55c3b] rounded-lg min-w-[100px]">
                        {isSaving ? (uploadProgress || 'Menyimpan...') : 'Tambah'}
                    </button>
                </div>
            </div>
        </div>
    )
}