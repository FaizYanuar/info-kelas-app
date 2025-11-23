import React from 'react'
import Tanggal from '../components/homepage/tanggal'
import JadwalCard from '../components/homepage/jadwal'
import BottomNavbar from '../components/homepage/navbar'

export default function Homepage() {
  return (
    <div className='bg-[#EDEBE8] h-screen'>

    <Tanggal/>
    <JadwalCard/>
    <BottomNavbar/>
    </div>
  )
}
