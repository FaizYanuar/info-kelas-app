import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "API Key belum diset di .env.local" }, { status: 500 });
  }

  // URL resmi Google untuk melihat daftar model
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Kita filter hanya model yang bisa "generateContent" (Chatbot)
    const chatModels = data.models?.filter((m: any) => 
      m.supportedGenerationMethods.includes("generateContent")
    ).map((m: any) => m.name);

    return NextResponse.json({
      available_models: chatModels, // Daftar nama model yang BISA Anda pakai
      full_data: data // Data lengkap (jika ingin detail)
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}