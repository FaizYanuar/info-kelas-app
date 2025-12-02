"use client"
import React, { useState, useRef, useEffect } from 'react'
import BottomNavbar from '../components/homepage/navbar'

export default function ChatPage() {
  const defaultMessage = { role: 'bot', text: 'Halo! Ada yang bisa aku bantu soal jadwal atau tugas?' };
  
  const [messages, setMessages] = useState<any[]>([defaultMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // 1. REF UNTUK TEXTAREA (Agar bisa kita atur tingginya)
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ... (Bagian useEffect load & save history TETAP SAMA seperti sebelumnya) ...
  useEffect(() => {
    const savedChats = localStorage.getItem('chat_history');
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      } catch (e) { console.error(e); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages, isLoaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. FUNGSI AUTO-RESIZE TEXTAREA
  // Setiap kali 'input' berubah, kita sesuaikan tinggi kotaknya
  useEffect(() => {
    if (textareaRef.current) {
      // Reset tinggi dulu ke 'auto' biar bisa menyusut kalau teks dihapus
      textareaRef.current.style.height = 'auto'; 
      // Set tinggi sesuai konten (scrollHeight), tapi batasi max 120px (sekitar 5 baris)
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleClearChat = () => {
    if (confirm("Hapus semua riwayat chat?")) {
      setMessages([defaultMessage]);
      localStorage.removeItem('chat_history');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    
    // Reset tinggi textarea setelah kirim
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Kirim history juga (sesuai perbaikan "Alzheimer" sebelumnya)
        body: JSON.stringify({ message: userMessage, history: messages }) 
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || "Maaf, error." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Gagal terhubung ke server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-[#EDEBE8] h-screen flex flex-col'>
      
      {/* Header (Tetap Sama) */}
      <div className='bg-[#2051A2] px-6 pt-4 pb-4 shadow-md shrink-0 flex justify-between items-center rounded-b-3xl'>
        <div>
            <h1 className='text-white text-2xl font-bold'>Asisten Kelas</h1>
            <p className='text-blue-100 text-sm'>Tanyakan tentang jadwal, tugas, & lainnya!</p>
        </div>
        <button onClick={handleClearChat} className='p-2 bg-white/10 rounded-full text-white hover:bg-red-500 transition-colors'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>

      {/* Chat Area (Tetap Sama) */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 pb-40'>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#D06E49] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'}`}>
              {typeof msg.text === 'string' && msg.text.split('\n').map((line: string, i: number) => (
                <p key={i} className="min-h-4">{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 flex gap-1 items-center'>
              <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
              <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100'></div>
              <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200'></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* --- INPUT AREA YANG DIPERBARUI --- */}
      <div className='fixed bottom-24 left-0 w-full px-4'>
        {/* Ubah rounded-full jadi rounded-3xl agar lebih bagus saat textarea membesar */}
        <div className='bg-white p-2 rounded-3xl shadow-lg border border-gray-200 flex items-end gap-2'>
          
          {/* GANTI INPUT DENGAN TEXTAREA */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // HAPUS onKeyDown agar 'Enter' membuat baris baru, bukan kirim
            placeholder="Ketik pertanyaan..."
            rows={1} // Mulai dengan 1 baris
            className='flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 placeholder-gray-400 resize-none max-h-[120px] overflow-y-auto'
            style={{ minHeight: '44px' }} // Tinggi minimum agar rapi
          />

          <button 
            onClick={handleSend}
            disabled={isLoading}
            // Ubah 'rounded-full' jadi 'rounded-2xl' agar serasi dengan kotak input
            className='bg-[#2051A2] mb-1 p-3 rounded-2xl text-white hover:bg-blue-800 transition-colors disabled:opacity-50 shrink-0 h-11 w-11 flex items-center justify-center'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"/></svg>
          </button>
        </div>
      </div>

      <BottomNavbar />
    </div>
  )
}