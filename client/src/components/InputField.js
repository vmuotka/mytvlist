import React from 'react'

const InputField = ({ type, value, name, size, onChange, className }) => {
  return (
    <input
      className={`rounded-md border-2 p-2 border-gray-300 hover:border-pink-300 focus:border-pink-300 ${className}`}
      type={type ? type : 'text'}
      value={value}
      name={name}
      size={size}
      onChange={onChange}
    />
  )
}

export default InputField