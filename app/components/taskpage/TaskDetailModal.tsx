"use client"
import { useEffect, useState } from 'react'
import { Task, Attachment } from './types' // <--- IMPORT DARI TYPES
import { supabase } from '@/lib/supabase'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null; 
}

// Helper untuk deteksi file
const getFileDetails = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'doc' || ext === 'docx') {
        return { label: 'Microsoft Word', colorClass: 'text-blue-600', bgClass: 'bg-blue-50 border-blue-200', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/><path fill="currentColor" d="M10.12 9.98L8.6 17h1.68l.9-4.88l.97 4.91h1.58l.98-4.91l.9 4.88h1.66l-1.5-7.02h-1.7l-1.07 5.4l-1.07-5.4z"/></svg> };
    }
    if (ext === 'ppt' || ext === 'pptx') {
        return { label: 'PowerPoint', colorClass: 'text-orange-600', bgClass: 'bg-orange-50 border-orange-200', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/><path fill="currentColor" d="M9 11v6h1.5v-2h1.5a1.5 1.5 0 0 0 1.5-1.5v-1a1.5 1.5 0 0 0-1.5-1.5H9zm1.5 2.5v-1h1.5v1h-1.5z"/></svg> };
    }
    if (ext === 'pdf') {
        return { label: 'PDF Document', colorClass: 'text-red-600', bgClass: 'bg-red-50 border-red-200', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8.267 14.68c-.116-.56-.167-1.318-.127-1.92c.163-1.09.774-1.917 1.487-1.89c.355.013.555.227.604.426c.036.215.016.516-.07.868c-.183.754-.926 1.83-1.894 2.516zM17.654 16c-.033-.285-.595-.45-1.332-.496c-1.144-.066-2.227.274-3.23.633c-1.066.38-2.126.762-3.174.82c-.89.05-1.285-.296-1.353-.59c-.066-.3.125-.85.69-1.55c.757-.935 2.44-2.52 2.72-4.48c.075-1.07-.11-2.42-1.29-2.92c-.777-.33-1.636.03-2.07.87c-.643 1.23-.42 3.126.37 5.1c.32.796.81 1.63 1.375 2.384c-.375.92-.81 2.376-.856 3.328c-.015.32.037.9.46 1.21c.29.213.727.29 1.15.204c.95-.19 1.52-1.07 1.77-1.61c.427-.912.23-1.935.035-2.558c.875-.537 1.99-1.06 2.87-1.29c.775-.203 1.955-.386 2.127.14c.05.155.016.382-.262.705zm-4.72-1.99c.767-.32 1.635-.615 2.345-.73c-1.05.35-1.99.55-2.345.73zm-6.66 4.3c.097-.056.66-.45.895-1.127c.07-.202.164-.52.227-.893c-.412.45-.693.92-.81 1.255c-.14.39-.327 1.03.22.82c-.173-.02-.332-.055-.533-.055zm1.5-8.32c.18-.34.55-.55.855-.42c.315.132.327.766.305 1.082c-.07.97-.84 1.95-1.42 2.39c-.49-1.16-.36-2.3.26-3.05z"/><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg> };
    }
    return { label: 'File Document', colorClass: 'text-gray-500', bgClass: 'bg-gray-50 border-gray-200', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> };
};

export default function TaskDetailModal({ isOpen, onClose, task }: ModalProps) {
    if (!isOpen || !task) return null;

     const [isAdmin, setIsAdmin] = useState(false);
    
      useEffect(() => {
        checkUser();
      }, []);
    
      const checkUser = async () => {
        // Pastikan supabase sudah diimport di atas
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAdmin(true);
        }
      };
    

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="bg-[#2051A2] p-5 shrink-0">
                    <h2 className="text-white font-bold text-lg leading-tight">{task.subject}</h2>
                    <p className="text-blue-200 text-xs mt-1">{task.lecturer}</p>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{task.title}</h3>
                    
                    {/* Waktu */}
                    <div className="flex gap-4 mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className='flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm12-4v4M8 3v4m-4 4h16m-9 4h1m0 0v3"/></svg>
                            <span>{task.deadlineDate}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/></svg>
                            <span>{task.deadlineTime}</span>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Deskripsi</h4>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                            {task.description}
                        </p>
                    </div>

                    {/* Lampiran */}
                    {task.attachments && task.attachments.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Lampiran</h4>
                            <div className="space-y-2">
                                {task.attachments.map((file, index) => {
                                    const fileDetails = getFileDetails(file.name);
                                    return (
                                        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                            {file.type === 'image' ? (
                                                <div>
                                                    <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
                                                    <div className="p-2 bg-gray-50 flex justify-between items-center">
                                                        <span className="text-xs font-medium text-gray-600 truncate max-w-[200px]">{file.name}</span>
                                                        <a href={file.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold hover:underline">LIHAT</a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-3 flex items-center gap-3 bg-white hover:bg-gray-50 transition-colors">
                                                    <div className={`p-2 rounded-lg border ${fileDetails.bgClass} ${fileDetails.colorClass}`}>
                                                        {fileDetails.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                                        <p className="text-xs text-gray-400">{fileDetails.label}</p>
                                                    </div>
                                                    <a href={file.url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5l5-5m-5-7v12"/></svg>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Link Pengumpulan */}
                    {task.submissionLink && (
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Pengumpulan</h4>
                            <a href={task.submissionLink} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors group">
                                <div className='flex items-center gap-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 7h10v2H7zm0 4h7v2H7z"/><path fill="currentColor" d="M20 2H4c-1.103 0-2 .897-2 2v18l4-4h14c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 16V4h16v12H4z"/></svg>
                                    <span className="font-medium text-sm">Link Pengumpulan Tugas</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="transform group-hover:translate-x-1 transition-transform"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"/></svg>
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors border border-gray-200">Tutup</button>
                    {isAdmin && (
                    <button onClick={() => alert("Sudah dikumpulkan!")} className="flex-1 py-2.5 rounded-xl bg-[#D06E49] text-white font-medium hover:bg-[#b55c3b] transition-colors shadow-lg shadow-orange-200">Tandai Selesai</button>
                    )}
                </div>
            </div>
        </div>
    )
}