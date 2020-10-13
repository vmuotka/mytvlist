import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'

// project services
import userService from '../services/userService'

// project components
import ProfileNavigation from '../components/ProfileNavigation'
import TvCard from '../components/TvCard'

// project hooks
import { useAuth } from '../context/auth'
import { useNotification } from '../context/notification'

const Profile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState({})
  const { authTokens } = useAuth()
  const { setNotifications } = useNotification()

  useEffect(() => {
    if (id)
      userService.profile(id, authTokens).then(data =>
        setProfile(data)
      ).catch(err => {
        setNotifications([{ title: err.message, message: 'User not found', type: 'error' }])
      }
      )
    // eslint-disable-next-line
  }, [id, setProfile, authTokens])
  console.log(profile)
  return (
    <>
      <div className='w-full md:w-3/4 mx-auto mt-4'>
        <ProfileNavigation profile={profile} />
        <div class='xl:grid grid-cols-2 gap-6 mt-4 xl:mx-4'>
          {profile.tvlist && profile.tvlist.map(show => <TvCard className='mt-4 xl:mt-0' key={show.tv_id} show={show.tv_info} />)}
        </div>
      </div>
    </>
  )
}

export default Profile