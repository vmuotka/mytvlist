import React, { useState, useRef } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'

// project hooks
import useOutsideListener from '../context/outsideListener'

import { useDispatch, connect } from 'react-redux'
import { logout } from '../redux/userReducer'

import Cog from './icons/Cog'

const Navigation = ({ user, children }) => {

    // hide or show nav when clicking the burger menu button
    const [showNav, setShowNav] = useState(false)
    const onMenuClick = () => {
        setShowNav(!showNav)
    }

    const dispatch = useDispatch()

    const routes = [
        {
            title: 'Discover',
            href: '/discover',
            hidden: user ? false : true
        },
        {
            title: 'Search',
            href: '/search'
        },
        {
            title: 'My Profile',
            href: `/user/${user?.username}`,
            hidden: user ? false : true
        }
    ]

    // get current route to highlight open page on navigation
    const location = useLocation().pathname

    const history = useHistory()

    const handleSignOut = () => {
        dispatch(logout())
        history.push('/')
    }

    const navRef = useRef(null)
    useOutsideListener(navRef, () => { setShowNav(false) })

    return (
        <>
            <nav ref={navRef} className='fixed md:static bottom-0 flex-col-reverse md:flex-row w-full z-50 flex items-center justify-between flex-wrap bg-pink-500 p-6 select-none'>
                <div className='flex'>
                    <Link className='flex items-center flex-shrink-0 text-white mr-6' to='/'>
                        <span className='font-bold text-xl tracking-tight'>MyTvList</span>
                    </Link>
                    {/* Small Screen Width Hamburger Menu Button */}
                    <div className='block md:hidden'>
                        <button onClick={onMenuClick} className='flex items-center px-3 py-2 border rounded text-pink-200 border-pink-400 hover:text-white hover:border-white focus:outline-none'>
                            <svg className='fill-current h-3 w-3' viewBox='0 0 20 20'><title>Menu</title><path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' /></svg>
                        </button>
                    </div>
                </div>
                {/* Navigation Links */}
                <div className={`${showNav ? 'block' : 'hidden'} w-full flex-grow md:flex md:items-center md:w-auto`} >
                    <div className='text-sm md:flex-grow grid grid-cols-2 md:flex text-center pt-4 pb-8 md:pt-0 md:pb-0 gap-6 md:gap-0'>
                        {
                            routes.map(route => (
                                route.hidden ? null : <Link to={route.href} key={route.title} onClick={() => setShowNav(false)} className={`block text-base font-semibold md:inline-block md:mt-0 ${location === route.href ? 'text-white' : 'text-pink-200'} hover:text-white md:mr-4 focus:outline-none`}>{route.title}</Link>
                            ))
                        }
                    </div>
                    <div className='border-t md:border-t-0  mb-4 md:mb-0'>
                        {
                            user ?
                                <div className='flex gap-2 justify-center md:justify-start'>
                                    <Link
                                        to='/user_settings'
                                        className='inline-block focus:outline-none  self-center mt-4 md:mt-0'
                                        title='Settings'
                                    >
                                        <Cog className='h-6 text-white' />
                                    </Link>
                                    <button type='button' onClick={handleSignOut} value='Sign Out' className='inline-block text-xs font-bold px-3 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-pink-500 hover:bg-white mt-4 md:mt-0'>Sign Out</button>
                                </div> :
                                <div className='flex gap-2 justify-center md:justify-start'>
                                    <Link to={{ pathname: '/signin', state: { referer: location } }} className='inline-block text-xs font-bold px-3 py-2 leading-none rounded text-white border-white hover:border-transparent hover:text-pink-500 hover:bg-white mt-4 md:mt-0 mr-1'>Sign In</Link>
                                    <Link to={{ pathname: '/signup', state: { referer: location } }} className='inline-block text-xs font-bold px-3 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-pink-500 hover:bg-white mt-4 md:mt-0  ml-2'>Sign Up</Link>
                                </div>
                        }
                    </div>
                </div>
            </nav>
            <div className='mb-24'>
                {children}
            </div>
        </>
    )
}

const mapDispatchToProps = {
    logout
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user,
        children: ownProps.children
    }
}

const connectedNavigation = connect(mapStateToProps, mapDispatchToProps)(Navigation)

export default connectedNavigation