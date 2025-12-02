"use client"
import React, { useState, useRef, useEffect } from 'react'
import BottomNavbar from '../components/homepage/navbar'

export default function ChatPage() {
  const defaultMessage = { role: 'bot', text: 'Halo! Ada yang bisa aku bantu soal jadwal atau tugas?' };
  
  const [messages, setMessages] = useState<any[]>([defaultMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // STATE BARU: Penanda apakah data lama sudah dimuat?
  const [isLoaded, setIsLoaded] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- 1. LOAD HISTORY (Hanya sekali saat pertama buka) ---
  useEffect(() => {
    // Cek apakah ada data di browser?
    const savedChats = localStorage.getItem('chat_history');
    
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        // Hanya set jika datanya valid array
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Gagal baca history", e);
      }
    }
    
    // PENTING: Tandai bahwa loading selesai!
    setIsLoaded(true);
  }, []);

  // --- 2. SAVE HISTORY (Setiap ada pesan baru) ---
  useEffect(() => {
    // PENTING: Jangan simpan jika belum selesai loading (mencegah overwrite)
    if (!isLoaded) return;

    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages, isLoaded]); // Jalankan efek ini jika messages atau isLoaded berubah

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearChat = () => {
    if (confirm("Hapus semua riwayat chat?")) {
      setMessages([defaultMessage]);
      localStorage.removeItem('chat_history');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    
    // Simpan riwayat SEBELUM ditambah pesan baru ini
    const currentHistory = messages; 

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: userMessage, // Pesan baru
            history: currentHistory // <-- OBAT ALZHEIMER: Kirim riwayat masa lalu
        })
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
      
      {/* Header */}
      <div className='bg-[#2051A2] px-6 pt-4 pb-4 rounded-b-3xl shadow-md shrink-0 flex justify-between items-center'>
        <div>
            <h1 className='text-white text-2xl font-bold'>Asisten Kelas</h1>
            <p className='text-blue-100 text-sm'>Tanya apapun tentang jadwal, tugas, & lainnya!</p>
        </div>
        
        <button 
            onClick={handleClearChat}
            className='p-2 bg-white/10 rounded-full text-white hover:bg-red-500 hover:text-white transition-colors'
            title="Hapus Riwayat Chat"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>

      {/* Chat Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 pb-36'>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-[#D06E49] text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'}
              `}
            >
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

      {/* Input Area */}
      <div className='fixed bottom-22 left-0 w-full px-4'>
        <div className='bg-white p-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2'>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pertanyaan..."
            className='flex-1 bg-transparent px-4 py-2 outline-none text-gray-700 placeholder-gray-400'
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className='bg-[#2051A2] p-3 rounded-full text-white hover:bg-blue-800 transition-colors disabled:opacity-50'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"/></svg>
          </button>
        </div>
      </div>

      <BottomNavbar />
    </div>
  )
}