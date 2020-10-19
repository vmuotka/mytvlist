import React from 'react'

const Button = ({ type, value, className, onClick, icon, style, children, color }) => {
  return (
    <button
      className={`${color ? color : 'bg-pink-400 hover:bg-pink-500'}  text-white font-bold rounded focus:outline-none ${className}`}
      type={type ? type : 'button'}
      onClick={onClick}
      style={style}
    >
      {children}
      {icon}
      {value}
    </button>
  )
}

export default Button