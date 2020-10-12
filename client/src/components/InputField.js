import React from 'react'

const InputField = ({ type, value, name, label, placeholder, size, onChange, className, required, minLength }) => {
  return (
    <>
      {label && <label className='block text-sm font-bold mb-2 text-gray-600 capitalize select-none' htmlFor={name}>{label}</label>}
      <input
        className={`rounded-md border-2 p-2 border-gray-300 hover:border-pink-300 focus:border-pink-300 outline-none ${className}`}
        type={type ? type : 'text'}
        value={value}
        placeholder={placeholder}
        name={name}
        id={name}
        size={size}
        onChange={onChange}
        required={required ? required : false}
        minLength={minLength}
      />
    </>
  )
}

export default InputField