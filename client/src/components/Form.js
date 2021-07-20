import React from 'react'

const Form = ({ onSubmit, children, className }) => {
  return (
    <form className={`w-full mx-auto ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  )
}

export const FormGroup = ({ groupName, children }) => {
  return (
    <div>
      <h2 className='text-xl text-gray-600 font-semibold'>
        {groupName}
      </h2>
      <div className='flex flex-col gap-2 mx-4 mt-4'>
        {children}
      </div>
    </div>
  )
}

export default Form