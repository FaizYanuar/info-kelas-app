import React from 'react'

export default function TugasCard() {
    return (
        <div className='sm:container sm:mx-auto sm:max-w-1/3'>
            <div className='flex justify-center p-4'>
                <div className=' items-center w-full gap-2 py-1 px-4 bg-white rounded-xl shadow-[0px_4px_4px_0px_rgba(99,104,114,0.25)]  border border-gray-200'>
                    <div className='flex justify-between items-center w-full border-b py-2 border-[#D9D9D9]'>
                        <div>
                            <h1 className='font-medium '>Pemrograman Berbasis Web **</h1>
                            <h1 className='uppercase font-medium text-[#834646] text-sm'>Hengky Mulyono</h1>
                        </div>

                    </div>

                    <div className=''>
                        <p className='font-semibold text-sm pt-1 pb-1'>Membuat Website e-Commerce Full Stack</p>
                        <div className='flex gap-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="8.5" /><path strokeLinecap="round" d="M5 2.804A6 6 0 0 0 2.804 5M19 2.804A6 6 0 0 1 21.196 5M12 6.5v5.25c0 .138.112.25.25.25h4.25" /></g></svg>
                            <h1 className='text-sm'>12.59 PM</h1>
                        </div>
                        <div className='flex gap-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm0 4h16m-4-5v2M8 3v2" strokeWidth="1" /></svg>                            
                            <h1 className='text-sm'>Selasa, 21 Nov</h1>
                        </div>
                        <h1 className='mb-2 w-fit ml-auto font-medium text-[10px] bg-[#D06E49] rounded-xl py-1.5 px-3 text-white'>Lihat Selengkapnya</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
