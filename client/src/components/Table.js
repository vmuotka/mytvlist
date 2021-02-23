import React from 'react'

export const Table = (props) => {
  return (
    <table id={props.id} className='w-full border-collapse bg-pink-150'>
      {props.children}
    </table>
  )
}

export const Thead = (props) => {
  return (
    <thead className={`bg-pink-400 text-white ${props.className && props.className}`}>
      {props.children}
    </thead>
  )
}

export const Th = (props) => {
  return (
    <th className={`py-2 px-2 md:text-xl ${props.className && props.className}`}>{props.children}</th>
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
    <td className={`py-2 px-2 text-center ${props.className}`}>
      {props.children}
    </td>
  )
}