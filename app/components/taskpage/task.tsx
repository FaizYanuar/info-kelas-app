import React from 'react'
import TugasCard from './tugascard'

export default function Task() {
  return (
    <div className='bg-[#EDEBE8] fixed top-20 w-full rounded-t-3xl h-screen'>
        <h1 className='font-semibold text-2xl text-center pt-5'>TUGAS</h1>
        <TugasCard/>
    </div>
  )
}
