import React from 'react'

const formatDisplayDate = (date: Date) => {
    const month = date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const day = date.getDate();
    
    return `${day} ${month}, ${weekday}`;
}

export default function Tanggal() {
    const today = new Date();
    
    const formattedDate = formatDisplayDate(today);
    return (
        <div className="flex justify-center p-4">
            <div className=" mt-12 inline-flex items-center gap-4 py-1 px-4 bg-white rounded-xl shadow-sm  border border-gray-200">

                <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="34" viewBox="0 0 12 24">
                        <g transform="rotate(180 6 12)">
                            <path fill="currentColor" fillRule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414" />
                        </g>
                    </svg>
                </button>

                <span className="font-medium text-gray-900 text-xl tracking-wide">
                    {formattedDate}
                </span>

                <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="34" viewBox="0 0 12 24"><path fill="currentColor" fill-rule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414" /></svg>
                </button>
            </div>
        </div>
    )
}