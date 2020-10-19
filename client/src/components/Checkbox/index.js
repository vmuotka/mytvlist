import React from 'react'
import './checkbox.css'

const Checkbox = (props) => {
  return (
    <>
      <label className={`checkbox ${props.className && props.className}`}>
        <span className='checkbox__input'>
          <input
            type='checkbox'
            name={props.name && props.name}
            checked={props.checked}
            onChange={props.onChange}
          />
          <span className='checkbox__control'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
              <path fill='none' stroke='currentColor' strokeWidth='3' d='M1.73 12.91l6.37 6.37L22.79 4.59' /></svg>
          </span>
        </span>
        <span className='radio__label'>{props.label && props.label}</span>
      </label>
    </>
  )
}

export default Checkbox