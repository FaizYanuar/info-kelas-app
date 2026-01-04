"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  // State untuk form login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // State untuk status session (Apakah sudah login?)
  const [session, setSession] = useState<any>(null)
  const [isLoadingCheck, setIsLoadingCheck] = useState(true) // Loading saat cek status login
  const [loadingLogin, setLoadingLogin] = useState(false) // Loading saat proses login tombol ditekan

  const router = useRouter()

  // 1. CEK STATUS LOGIN SAAT HALAMAN DIBUKA
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setIsLoadingCheck(false)
    }
    checkSession()
  }, [])

  // 2. FUNGSI LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLogin(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("Login Gagal: " + error.message)
      setLoadingLogin(false)
    } else {
      // Sukses login -> Refresh halaman agar state berubah jadi tampilan Logout
      window.location.reload() 
    }
  }

  // 3. FUNGSI LOGOUT
  const handleLogout = async () => {
    const confirmLogout = confirm("Yakin ingin keluar dari akun Admin?");
    if (confirmLogout) {
      await supabase.auth.signOut()
      setSession(null) // Kosongkan session di state
      router.refresh() // Refresh agar komponen lain tau kita logout
    }
  }

  // --- TAMPILAN LOADING (Saat ngecek status) ---
  if (isLoadingCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2051A2]"></div>
      </div>
    )
  }

  // --- TAMPILAN JIKA SUDAH LOGIN (HALAMAN LOGOUT) ---
  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-[#2051A2] mb-2">Anda Sudah Login</h1>
          <p className="text-gray-500 text-sm mb-6">
            Login sebagai: <br/>
            <span className="font-semibold text-gray-800">{session.user.email}</span>
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-[#2051A2] text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
            >
              Kembali ke Beranda
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full bg-white border border-red-500 text-red-500 py-3 rounded-lg font-bold hover:bg-red-50 transition"
            >
              Logout (Keluar)
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- TAMPILAN JIKA BELUM LOGIN (FORM LOGIN BIASA) ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#2051A2] mb-6 text-center">Login Admin</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:border-[#2051A2]"
              placeholder="admin@kelas.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:border-[#2051A2]"
              placeholder="••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loadingLogin}
            className="w-full bg-[#2051A2] text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loadingLogin ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <button onClick={() => router.push('/')} className="mt-4 text-sm text-gray-500 w-full text-center">
          Kembali ke Beranda
        </button>
      </div>
    </div>
  )
}