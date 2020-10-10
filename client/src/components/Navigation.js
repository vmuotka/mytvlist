import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const routes = [
  {
    title: 'Discover',
    href: '/discover'
  },
  {
    title: 'Search',
    href: '/search'
  }
]

const Navigation = () => {
  // hide or show nav when clicking the burger menu button
  const [showNav, setShowNav] = useState(false)
  const onMenuClick = () => {
    setShowNav(!showNav)
  }

  return (
    <nav className='flex items-center justify-between flex-wrap bg-pink-500 p-6'>
      <div className='flex items-center flex-shrink-0 text-white mr-6'>
        {/* <svg className='fill-current h-8 w-8 mr-2' width='54' height='54' viewBox='0 0 54 54' xmlns='http://www.w3.org/2000/svg'><path d='M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z' /></svg> */}
        <span className='font-semibold text-xl tracking-tight'>MyTvList</span>
      </div>
      <div className='block md:hidden'>
        <button onClick={onMenuClick} className='flex items-center px-3 py-2 border rounded text-pink-200 border-pink-400 hover:text-white hover:border-white'>
          <svg className='fill-current h-3 w-3' viewBox='0 0 20 20'><title>Menu</title><path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' /></svg>
        </button>
      </div>
      <div className={`${showNav ? 'block' : 'hidden'} w-full md:block flex-grow md:flex md:items-center md:w-auto`} >
        <div className='text-sm md:flex-grow'>
          {
            routes.map(route => (
              <Link to={route.href} key={route.title} className='block text-base mt-4 md:inline-block md:mt-0 text-pink-200 hover:text-white mr-4'>{route.title}</Link>
            ))
          }
        </div>
      </div>
    </nav>
  )
}

export default Navigation