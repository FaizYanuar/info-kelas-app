"use client"
import React, { useState, useRef, useEffect } from 'react'
import BottomNavbar from '../components/homepage/navbar' // Sesuaikan path

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Halo! Ada yang bisa aku bantu soal jadwal atau tugas?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Tampilkan pesan user
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Kirim ke API Route yang kita buat tadi
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await res.json();

      // 3. Tampilkan balasan AI
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
      <div className='bg-[#2051A2] p-4 pt-8 shadow-md shrink-0'>
        <h1 className='text-white font-bold text-xl'>Asisten Kelas 🤖</h1>
        <p className='text-blue-200 text-xs'>Tanya apa saja tentang jadwal & tugas</p>
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
              {/* Render baris baru jika ada */}
              {msg.text.split('\n').map((line, i) => (
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
      <div className='fixed bottom-20 left-0 w-full px-4'>
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