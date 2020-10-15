import React from 'react'
import './modal.css'

// project components
import Button from '../Button'

const Modal = (props) => {
  return (
    <>
      <div className={`fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 ${props.hidden ? 'hidden' : 'block'}`}>
      </div>
      <table className={`w-full max-w-lg modal bg-pink-150 rounded-lg z-20 ${props.hidden ? 'hidden' : 'table'}`}>
        <thead>
          <tr className='w-full bg-pink-500'>
            <th colSpan='3' className='p-4 text-white'>
              {props.title}
            </th>
            <th className='p-4'>
              <Button onClick={props.closeFunction()} value='Close' className='' /></th>
          </tr>
        </thead>
        {props.children}
      </table>
    </>
  )
}

export default Modal