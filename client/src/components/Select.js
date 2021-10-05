import React from 'react'

const Select = (props) => {
    return (
        <div className={`${props.className}`}>
            {props.label && <label className='block uppercase tracking-wide text-gray-700 text-sm font-semibold mb-1 select-none' htmlFor='label'>
                {props.label}
            </label>}
            <div className='relative'>
                <select
                    value={props.value}
                    onChange={props.onChange}
                    className='block appearance-none w-full bg-gray-200 focus:bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-transparent focus:border-gray-500 capitalize h-full'
                    id='label'
                >
                    {props.options.map(option => <option className='appearance-none bg-gray-300 focus:bg-gray-500 capitalize' value={option.value !== undefined ? option.value : option.name} key={option.name ? option.name : option}>{option.name ? option.name : option}</option>)}
                </select>
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' /></svg>
                </div>
            </div>
        </div>
    )
}

export default Select