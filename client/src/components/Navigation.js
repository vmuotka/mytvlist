import React, { useState, useRef } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'

// project hooks
import { useAuth } from '../context/auth'
import useOutsideListener from '../context/outsideListener'



const Navigation = ({ children }) => {

  const { authTokens, setAuthTokens } = useAuth()
  // hide or show nav when clicking the burger menu button
  const [showNav, setShowNav] = useState(false)
  const onMenuClick = () => {
    setShowNav(!showNav)
  }

  let token = ''
  if (authTokens)
    token = JSON.parse(window.atob(authTokens.token.split('.')[1]))

  const routes = [
    {
      title: 'Discover',
      href: '/discover',
      hidden: authTokens ? false : true
    },
    {
      title: 'Search Tv',
      href: '/search/tv'
    },
    {
      title: 'Search Users',
      href: '/search/users'
    },
    {
      title: 'My Profile',
      href: `/user/${token.username}`,
      hidden: authTokens ? false : true
    }
  ]

  // get current route to highlight open page on navigation
  const location = useLocation().pathname

  const history = useHistory()

  const handleSignOut = () => {
    setAuthTokens(null)
    history.push('/')
  }

  const navRef = useRef(null)
  useOutsideListener(navRef, () => { setShowNav(false) })

  return (
    <>
      <nav ref={navRef} className='flex items-center justify-between flex-wrap bg-pink-500 p-6 select-none'>
        {/* Page Logo */}
        <Link className='flex items-center flex-shrink-0 text-white mr-6' to='/'>
          <span className='font-bold text-xl tracking-tight'>MyTvList</span>
        </Link>
        {/* Small Screen Width Hamburger Menu Button */}
        <div className='block md:hidden'>
          <button onClick={onMenuClick} className='flex items-center px-3 py-2 border rounded text-pink-200 border-pink-400 hover:text-white hover:border-white'>
            <svg className='fill-current h-3 w-3' viewBox='0 0 20 20'><title>Menu</title><path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' /></svg>
          </button>
        </div>
        {/* Navigation Links */}
        <div className={`${showNav ? 'block' : 'hidden'} w-full flex-grow md:flex md:items-center md:w-auto`} >
          <div className='text-sm md:flex-grow'>
            {
              routes.map(route => (
                route.hidden ? null : <Link to={route.href} key={route.title} className={`block text-base font-semibold mt-4 md:inline-block md:mt-0 ${location === route.href ? 'text-white' : 'text-pink-200'} hover:text-white mr-4`}>{route.title}</Link>
              ))
            }
          </div>
          <div>
            {
              authTokens ?
                <button type='button' onClick={handleSignOut} value='Sign Out' className='inline-block text-xs font-bold px-3 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-pink-500 hover:bg-white mt-4 md:mt-0'>Sign Out</button> :
                <>
                  <Link to={{ pathname: '/signin', state: { referer: location } }} className='inline-block text-xs font-bold px-3 py-2 leading-none rounded text-white border-white hover:border-transparent hover:text-pink-500 hover:bg-white mt-4 md:mt-0 mr-1'>Sign In</Link>
                  <Link to={{ pathname: '/signup', state: { referer: location } }} className='inline-block text-xs font-bold px-3 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-pink-500 hover:bg-white mt-4 md:mt-0  ml-2'>Sign Up</Link>
                </>
            }
          </div>
        </div>
      </nav>
      {children}
    </>
  )
}

export default Navigation