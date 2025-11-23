import React from 'react'
import Tanggal from './tanggal'
import JadwalCard from './jadwal'
import BottomNavbar from './navbar'

export default function Homepage() {
  return (
    <div className='bg-[#EDEBE8] h-screen'>

    <Tanggal/>
    <JadwalCard/>
    <BottomNavbar/>
    </div>
  )
}
