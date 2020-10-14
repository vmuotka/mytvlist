import React from 'react'

export const Table = (props) => {
  return (
    <table className='w-full table-auto border-collapse bg-pink-100'>
      {props.children}
    </table>
  )
}

export const Thead = (props) => {
  return (
    <thead className='bg-pink-400 text-white'>
      <tr>
        {props.headers.map(header => <th key={header} className='py-2 px-2'>{header}</th>)}
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
    <tr className={`odd:bg-pink-150 hover:bg-pink-300 ${props.className}`}>
      {props.children}
    </tr>
  )
}

export const Td = (props) => {
  return (
    <td className={`py-2 px-2 text-center ${props.className}`}>
      {props.children}
    </td>
  )
}