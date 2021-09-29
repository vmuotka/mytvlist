import React from 'react'

const InputField = ({ type, value, name, label, placeholder, size, onChange, onBlur, className, required, minLength, min, max }) => {
    return (
        <>
            {label && <label className='block uppercase tracking-wide text-gray-700 text-sm font-semibold mb-1 select-none' htmlFor={name}>{label}</label>}
            <input
                className={`rounded-md border-2 p-2 border-gray-300 hover:border-pink-300 focus:border-pink-300 outline-none ${className}`}
                type={type ? type : 'text'}
                value={type === 'number' ? Number(value).toString() : value}
                placeholder={placeholder}
                name={name}
                id={name}
                size={size}
                onChange={onChange}
                onBlur={onBlur}
                required={required ? required : false}
                minLength={minLength}
                min={min}
                max={max}
            />
        </>
    )
}

export default InputField