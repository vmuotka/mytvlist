import React from 'react'

export const Table = (props) => {
  return (
    <table className='w-full border-collapse bg-pink-150'>
      {props.children}
    </table>
  )
}

export const Thead = (props) => {
  return (
    <thead className='bg-pink-400 text-white'>
      <tr>
        {props.headers.map((header, index) => <th colSpan={props.colSpan && props.colSpan[index]} key={header} className='py-2 px-2'>{header}</th>)}
      </tr>
    </thead>
  )
}

export const Tbody = (props) => {
  return (
    <tbody className='text-gray-700'>
      {props.children}
    </tbody>
  )
}

export const Tr = (props) => {
  return (
    <tr className={`odd:bg-pink-100 hover:bg-pink-300 ${props.className}`}>
      {props.children}
    </tr>
  )
}

export const Td = (props) => {
  return (
    <td className={`py-2 px-2 text-center ${props.className}`} colSpan={props.colSpan && props.colSpan}>
      {props.children}
    </td>
  )
}