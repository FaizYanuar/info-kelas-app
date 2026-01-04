import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
    try {
        // 1. Terima Pesan DAN History
        const { message, history } = await req.json();

        // 2. Ambil Data Database (Konteks)
        // (Kode query Supabase tetap sama, saya singkat biar fokus ke logika chat)
        const { data: schedules } = await supabase.from('weekly_schedules').select(`
        day_of_week, room, time_text, subjects ( name, lecturers ( name ) ),
        session_logs ( date, status, note, room_override, time_text_override )
    `);
        const { data: additional } = await supabase.from('additional_schedules').select(`*`);
        const { data: assignments } = await supabase.from('assignments').select(`*, subjects(name)`);

        const contextData = JSON.stringify({
            jadwal_rutin: schedules,
            jadwal_tambahan: additional,
            tugas_tugas: assignments,
            hari_ini: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        });

        // 3. SIAPKAN HISTORY UNTUK GEMINI
        let formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        // --- PERBAIKAN: Hapus pesan pertama jika itu dari Bot ---
        // Gemini mewajibkan history dimulai dari USER. 
        // Jadi sapaan "Halo" dari bot harus kita buang dari memori API.
        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift(); // Hapus elemen pertama
        }
        // 4. INISIALISASI MODEL DENGAN SYSTEM INSTRUCTION
        // Kita taruh "Otak Database" di System Instruction agar dia selalu ingat tugasnya
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `
        Kamu adalah asisten kelas. 
        Jawablah pertanyaan berdasarkan DATA TERBARU ini:
        ${contextData}
        
        PANDUAN MENJAWAB:
        1. **PRIORITAS UTAMA:** Cek apakah pertanyaan user berkaitan dengan Jadwal, Dosen, Ruangan, atau Tugas.
            - Jika YA: Jawablah **HANYA** berdasarkan data JSON di atas. Jika jadwal batal/kosong (status 'absent'), katakan sejujurnya.
            - JANGAN PERNAH mengarang info jadwal yang tidak ada di data.
            - Jika ada tugas yang sudah lewat dari deadline jangan sebut kembali tugas itu kecuali diminta

        2. **TOPIK UMUM:** Jika pertanyaan user **TIDAK** berkaitan dengan data kelas (misalnya: coding, tips belajar, resep masakan, atau curhat):
            - Jawablah menggunakan pengetahuan umummu yang luas.
            - Jadilah teman belajar yang asik, ramah, dan membantu.

        3. Gaya bahasa: Santai, sopan, dan khas anak kuliah Indonesia.

        4. Jika user bertanya "Tadi kita bahas apa?", lihat history chat.
      `
        });

        // 5. MULAI CHAT (START CHAT)
        // Ini fitur Gemini untuk mengingat konteks percakapan
        const chat = model.startChat({
            history: formattedHistory, // Masukkan memori masa lalu
        });

        // 6. KIRIM PESAN BARU
        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return NextResponse.json({ reply: responseText });

    } catch (error: any) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: "Maaf, AI sedang pusing." }, { status: 500 });
    }
}