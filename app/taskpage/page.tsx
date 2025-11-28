import React from 'react'
import BottomNavbar from '../components/homepage/navbar'
import Task from '../components/taskpage/task'

export default function Taskpage() {
  return (
    <div className='bg-[#2051A2] h-screen'>
      <Task/>
      <BottomNavbar/>
    </div>
  )
}
