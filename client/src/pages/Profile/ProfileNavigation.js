import React from 'react'

// project hooks
import { useProfile } from '../../context/profile'

const ProfileNavigation = ({ active, onClick }) => {
  const { profile } = useProfile()
  const navs = [
    'TvList',
    'Statistics',
    'Progress'
  ]
  return (
    <>
      <nav className='flex items-center justify-between flex-wrap bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-sm shadow-lg p-4 select-none mb-2'>
        <div className='flex items-center flex-shrink-0 text-white mr-6'>
          <h1 className='font-semibold text-xl tracking-tight'>
            {profile.username}
          </h1>
        </div>
        <div className='w-full md:block flex-grow md:flex md:items-center md:w-auto'>
          <div className='text-md md:flex-grow'>
            {navs.map(nav =>
              <button key={nav} onClick={onClick(nav)} className={`${active === nav ? 'text-white' : 'text-indigo-200'} font-semibold hover:text-indigo-300 mr-4`}>{nav}</button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default ProfileNavigation