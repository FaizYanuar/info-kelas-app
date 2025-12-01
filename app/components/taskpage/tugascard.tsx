import React from 'react'
import { Task } from './types'

interface CardProps {
    data: Task; // Gunakan tipe Task, bukan any
    onDetailClick: () => void;
}

export default function TugasCard({ data, onDetailClick }: CardProps) {
    return (
        <div className='sm:container sm:mx-auto sm:max-w-1/3 mb-4'>
            <div className='flex justify-center px-4'>
                <div className='items-center w-full gap-2 py-1 px-4 bg-white rounded-xl shadow-[0px_4px_4px_0px_rgba(99,104,114,0.25)] border border-gray-200'>
                    
                    {/* Header: Matkul */}
                    <div className='flex justify-between items-center w-full border-b py-2 border-[#D9D9D9]'>
                        <div>
                            <h1 className='font-medium truncate pr-4'>{data.subject}</h1>
                        </div>
                    </div>

                    {/* Body: Detail Singkat */}
                    <div className='py-2'>
                        <p className='font-semibold text-sm pt-1 pb-2 line-clamp-2'>
                            {data.title}
                        </p>
                        
                        <div className='flex flex-col gap-2 text-gray-600 mb-3'>
                            <div className='flex gap-3 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="8.5" /><path strokeLinecap="round" d="M12 6.5v5.25c0 .138.112.25.25.25h4.25" /></g></svg>
                                <h1 className='text-sm'>{data.deadlineTime}</h1>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm0 4h16m-4-5v2M8 3v2" strokeWidth="1.5" /></svg>
                                <h1 className='text-sm'>{data.deadlineDate}</h1>
                            </div>
                        </div>

                        {/* Tombol Lihat Selengkapnya */}
                        <button 
                            onClick={onDetailClick} // Panggil fungsi parent
                            className='w-fit ml-auto block font-medium text-[10px] bg-[#D06E49] rounded-xl py-2 px-4 text-white hover:bg-[#b55c3b] transition-colors'
                        >
                            Lihat Selengkapnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}