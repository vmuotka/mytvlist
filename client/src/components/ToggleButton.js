import React from 'react'

import Check from './icons/Check'
import Cross from './icons/Cross'

const ToggleButton = ({ className, toggled, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`${toggled ?
                'from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600'
                : 'from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600'} 
                bg-gradient-to-l text-white p-1 rounded focus:outline-none ${className}`
            }
        >
            {toggled ? <Check className='h-6' /> : <Cross className='h-6' />}
        </button>
    )
}

export default ToggleButton