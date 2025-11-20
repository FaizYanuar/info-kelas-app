import React from 'react'

export default function JadwalCard() {
    return (
        <div className='sm:container sm:mx-auto sm:max-w-1/3'>
            <div className='flex justify-center p-4'>
                <div className=' items-center w-full gap-2 py-1 px-4 bg-white rounded-xl shadow-[0px_4px_4px_0px_rgba(99,104,114,0.25)]  border border-gray-200'>
                    <div className='flex justify-between items-center w-full border-b py-2 border-[#D9D9D9]'>
                        <div>
                            <h1 className='font-medium '>Pemrograman Berbasis Web **</h1>
                            <h1 className='uppercase font-medium text-[#834646] text-sm'>Hengky Mulyono</h1>
                            <h1 className='bg-[#D9D9D9] text-[#834646] text-xs mt-1 px-2 py-1 w-fit rounded-xl'>OFFLINE</h1>
                        </div>

                        <div className='bg-red-700 w-[35px] h-[35px] rounded-full'> </div>
                    </div>

                    <div className='flex justify-between items-center'>
                        <div className='flex'>
                            <h1 className='text-xl font-medium py-2 pr-5 border-r border-gray-200 w-fit '>K152</h1>
                            <h1 className='text-xl font-medium py-2 pl-5'>1/2</h1>
                        </div>
                        
                        <h1 className='font-medium text-[10px] bg-[#D06E49] rounded-xl py-1.5 px-3 text-white'>Lihat Selengkapnya</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
