import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("----------------------------------------");
  console.log("🤖 1. API Chat Dipanggil");

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // 2. CEK KONEKSI SUPABASE
    // (Kode query Supabase Anda tetap sama, tidak perlu diubah)
    // ... [BAGIAN QUERY SUPABASE SEPERTI SEBELUMNYA] ... 
    // Agar singkat saya tulis query intinya saja di bawah:
    
    const { data: schedules } = await supabase.from('weekly_schedules').select(`
        day_of_week, room, time_text,
        subjects ( name, lecturers ( name ) ),
        session_logs ( date, status, note, room_override, time_text_override )
    `);
    
    const { data: additional } = await supabase.from('additional_schedules').select(`
        date, room, time_text, subjects ( name, lecturers ( name ) )
    `);

    const { data: assignments } = await supabase.from('assignments').select(`
        title, description, deadline, submission_link, subjects ( name )
    `);

    // 3. RAKIT KONTEKS
    const contextData = JSON.stringify({
      jadwal_rutin: schedules,
      jadwal_tambahan: additional,
      tugas_tugas: assignments,
      hari_ini: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    });

    // 4. MENGHUBUNGI GEMINI (FIXED MODEL NAME)
    console.log("🧠 4. Menghubungi Gemini...");
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // --- PERBAIKAN UTAMA DI SINI ---
    // Gunakan 'gemini-1.5-flash' (Model terbaru, tercepat, dan gratis)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Kamu adalah asisten AI pintar ("Bot Kelas") untuk sebuah kelas mahasiswa.
      
      DATA KONTEKS (Jadwal & Tugas) SAAT INI:
      ${contextData}

      PANDUAN MENJAWAB:
      1. **PRIORITAS UTAMA:** Cek apakah pertanyaan user berkaitan dengan Jadwal, Dosen, Ruangan, atau Tugas.
         - Jika YA: Jawablah **HANYA** berdasarkan data JSON di atas. Jika jadwal batal/kosong (status 'absent'), katakan sejujurnya.
         - JANGAN PERNAH mengarang info jadwal yang tidak ada di data.

      2. **TOPIK UMUM:** Jika pertanyaan user **TIDAK** berkaitan dengan data kelas (misalnya: coding, tips belajar, resep masakan, atau curhat):
         - Jawablah menggunakan pengetahuan umummu yang luas.
         - Jadilah teman belajar yang asik, ramah, dan membantu.

      3. Gaya bahasa: Santai, sopan, dan khas anak kuliah Indonesia.

      Pertanyaan User: "${message}"
    `;

    // 4. KIRIM KE GEMINI

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log("✅ 5. Sukses!");
    return NextResponse.json({ reply: responseText });

  } catch (error: any) {
    console.error("❌ ERROR GEMINI:", error); 
    return NextResponse.json({ 
        error: "Server Error", 
        details: error.message 
    }, { status: 500 });
  }
}