import React from 'react'

const Button = ({ type, value, className, onClick, icon, style }) => {
  return (
    <button
      className={`bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded focus:outline-none ${className}`}
      type={type ? type : 'button'}
      onClick={onClick}
      style={style}
    >
      {icon}
      {value}
    </button>
  )
}

export default Button