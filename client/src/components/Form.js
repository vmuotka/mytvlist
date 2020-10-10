import React from 'react'

const Form = ({ onSubmit, children, className }) => {
  return (
    <form className={`w-full mx-auto ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  )
}

export default Form