import React from 'react'

const Button = (props) => {
  return (
    <button
      className={`${props.color ? props.color : 'bg-gradient-to-l from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600'}  text-white font-bold rounded focus:outline-none ${props.className}`}
      type={props.type ? props.type : 'button'}
      onClick={props.onClick}
      style={props.style}
      name={props.name && props.name}
    >
      {props.children}
      {props.icon}
      {props.value}
    </button>
  )
}

export default Button