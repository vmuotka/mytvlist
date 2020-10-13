import React from 'react'

const navs = [
  'Profile',
  'Statistics'
]

const ProfileNavigation = ({ profile }) => {
  return (
    <>
      <nav className='flex items-center justify-between flex-wrap bg-indigo-400 p-4 select-none'>
        <div className='flex items-center flex-shrink-0 text-white mr-6'>
          <h1 className='font-semibold text-xl tracking-tight'>
            {profile.username}
          </h1>
        </div>
        <div className='w-full md:block flex-grow md:flex md:items-center md:w-auto'>
          <div className='text-sm md:flex-grow'>
            {navs.map(nav =>
              <button key={nav} className='text-white hover:text-indigo-200 mr-4'>{nav}</button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default ProfileNavigation