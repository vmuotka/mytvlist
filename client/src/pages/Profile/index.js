import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'

// project services
import userService from '../../services/userService'

// project components
import ProfileNavigation from './ProfileNavigation'
import TvList from './TvList'
import Progress from './Progress'
import Statistics from './Statistics/'

// project hooks
import { ProfileContext } from '../../context/profile'
import { useAuth } from '../../context/auth'
import { useNotification } from '../../context/notification'

const Profile = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState({})
  const { authTokens } = useAuth()
  const { setNotifications } = useNotification()
  const [profileNav, setProfileNav] = useState('Statistics')

  const onNavClick = (nav) => e => {
    setProfileNav(nav)
  }

  useEffect(() => {
    if (username)
      userService.profile(username, authTokens).then(data => {
        setProfile({
          ...data,
          tvlist: data.tvlist.reverse()
        })
      }).catch(err => {
        setNotifications([{ title: err.message, message: 'User not found', type: 'error' }])
      }
      )
    // eslint-disable-next-line
  }, [username, setProfile, authTokens])

  return (
    <>
      <ProfileContext.Provider value={{ profile, setProfile }} >
        <div className='w-full md:w-4/5 mx-auto mt-4'>
          <ProfileNavigation active={profileNav} onClick={onNavClick} />
          {profileNav === 'TvList' && <TvList />}
          {profileNav === 'Statistics' && <Statistics />}
          {profileNav === 'Progress' && <Progress />}
        </div>
      </ProfileContext.Provider>
    </>
  )
}

export default Profile