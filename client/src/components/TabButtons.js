import React from 'react'

const TabButtons = ({ options, value, onChange }) => (
    <div className='flex justify-center my-4'>
        {
            options.map(option =>
                <button
                    key={option}
                    className={`capitalize border first:rounded-l last:rounded-r border-pink-500 py-1 w-24 font-semibold focus:outline-none ${value === option ? 'bg-pink-500 text-white' : 'hover:bg-pink-500 hover:text-white text-pink-500'} `}
                    onClick={() => { onChange(option) }}
                >
                    {option}
                </button>
            )
        }
    </div>
)

export default TabButtons