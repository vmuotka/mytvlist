import React from 'react'

const PaginationButton = ({ page, label, active, onClick, className }) => {
  return (
    <li>
      <button className={`px-3 py-1 hover:bg-indigo-600 hover:text-white ${active ? 'bg-indigo-500 text-white' : 'text-gray-600'} ${className}`} onClick={onClick(page)}>
        {label ? label : page}
      </button>
    </li>
  )
}

const Pagination = ({ currentPage, totalPages, ariaLabel, onClick, className }) => {
  const btns = []

  btns.push(<PaginationButton key='previous' page={currentPage > 1 ? currentPage - 1 : 1} label='Previous' onClick={onClick} />)

  for (let i = currentPage > 1 + 2 ? currentPage + 2 <= totalPages ? currentPage - 2 : totalPages - 4 : 1; i <= totalPages && (i <= currentPage + 2 || i <= 5); i++)
    btns.push(<PaginationButton key={i} page={i} active={i === currentPage} onClick={onClick} />)

  btns.push(<PaginationButton key='next' page={currentPage !== totalPages ? currentPage + 1 : totalPages} label='Next' onClick={onClick} />)

  return (
    <nav className={`flex ${className}`} aria-label={ariaLabel}>
      <ul className='flex border border-gray-600 rounded-md divide-x divide-gray-600 select-none'>
        {btns.map(btn => btn)}
      </ul>
    </nav >
  )
}

export default Pagination