import React from 'react'

// project hooks
import { useProfile } from '../../context/profile'
import { useAuth } from '../../context/auth'

// project components
import Button from '../../components/Button'
import Heart from '../../components/icons/Heart'

// project services
import userService from '../../services/userService'

const ProfileNavigation = ({ active, onClick }) => {
  const { profile, setProfile } = useProfile()
  const { authTokens } = useAuth()
  const navs = [
    'TvList',
    'Statistics',
    'Progress',
    'Activity'
  ]

  const handleFollow = () => {
    userService.followUser({ username: profile.username, id: profile.id }, !profile.followed, authTokens)
    setProfile({
      ...profile,
      followed: !profile.followed
    })
  }

  const decodedToken = authTokens ? JSON.parse(window.atob(authTokens.token.split('.')[1])) : null
  const myProfile = decodedToken ? decodedToken.id === profile.id : false
  return (
    <>
      <nav className='flex items-center justify-between flex-wrap bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-sm shadow-lg p-4 select-none mb-2'>
        <div className='flex items-center flex-shrink-0 text-white mr-6'>
          <h1 className='font-semibold text-xl tracking-tight'>
            {profile.username}
          </h1>
        </div>
        <div className='w-full flex-grow md:flex md:items-center md:w-auto'>
          <div className='text-md md:flex-grow'>
            {navs.map(nav =>
              <button key={nav} onClick={onClick(nav)} className={`${active === nav ? 'text-white' : 'text-indigo-200'} font-semibold hover:text-indigo-300 mr-4 focus:outline-none`}>{nav}</button>
            )}
          </div>
        </div>
        {(!myProfile && authTokens) && <Button
          onClick={handleFollow}
          value={profile.followed ? 'Unfollow' : 'Follow'}
          icon={<Heart filled={profile.followed} className='h-4 w-4 inline' />}
          className='py-1 px-2 mt-2 md:mt-0'
        />}
      </nav>
    </>
  )
}

export default ProfileNavigation