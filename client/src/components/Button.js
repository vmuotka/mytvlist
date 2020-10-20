import React from 'react'

const Button = (props) => {
  return (
    <button
      className={`${props.color ? props.color : 'bg-pink-400 hover:bg-pink-500'}  text-white font-bold rounded focus:outline-none ${props.className}`}
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