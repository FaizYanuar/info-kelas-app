"use client"

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation';

export default function BottomNavbar() {
    const pathname = usePathname();

    // Definisikan warna agar mudah diganti nanti
    const activeColor = "#D06E49"; // Oranye
    const inactiveColor = "#fff";   // Putih

    return (
        <div className='fixed bottom-0 left-0 w-full z-50 bg-[#2051A2] py-4 rounded-t-2xl'>
            <div className='flex justify-center gap-14'>
                
                {/* --- 1. HOME ICON --- */}
                <Link href={'/'}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="45" 
                        height="45" 
                        viewBox="0 0 24 24"
                    >
                        {/* Logika: Jika URL adalah '/', pakai warna aktif */}
                        <path 
                            fill={pathname === '/' ? activeColor : inactiveColor} 
                            d="M4 21V9l8-6l8 6v12h-6v-7h-4v7z"
                        />
                    </svg>
                </Link>

                {/* --- 2. TASK ICON --- */}
                <Link href={'/taskpage'}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="45" 
                        height="45" 
                        viewBox="0 0 24 24"
                    >
                        <g fill="none" fillRule="evenodd">
                            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                            {/* Logika: Jika URL adalah '/taskpage', pakai warna aktif */}
                            <path 
                                fill={pathname === '/taskpage' ? activeColor : inactiveColor} 
                                d="M12 4a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M9.354 3c.705-.622 1.632-1 2.646-1s1.94.378 2.646 1H18a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.126 5H6v15h12V5h-2.126q.124.481.126 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6q.002-.519.126-1M8 11a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"
                            />
                        </g>
                    </svg>
                </Link>

                {/* --- 3. CHAT ICON --- */}
                {/* Saya ubah href ke '/chat' agar beda dengan home */}
                <Link href={'/chatpage'}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="45" 
                        height="45" 
                        viewBox="0 0 24 24"
                    >
                        {/* Logika: Jika URL adalah '/chat', pakai warna aktif */}
                        <path 
                            fill={pathname === '/chatpage' ? activeColor : inactiveColor} 
                            d="M2 22V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18H6zm4-8h8v-2H6zm0-3h12V9H6zm0-3h12V6H6z"
                        />
                    </svg>
                </Link>
                
            </div>
        </div>
    )
}