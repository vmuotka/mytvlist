import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'

// project services
import userService from '../services/userService'

// project components
import ProfileNavigation from '../components/ProfileNavigation'
import TvCard from '../components/TvCard'
import Select from '../components/Select'

// project hooks
import { useAuth } from '../context/auth'
import { useNotification } from '../context/notification'

const Profile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState({})
  const { authTokens } = useAuth()
  const { setNotifications } = useNotification()
  const [profileNav, setProfileNav] = useState('TvList')
  const [orderBy, setOrderBy] = useState('newest')

  const onNavClick = (nav) => e => {
    setProfileNav(nav)
  }

  useEffect(() => {
    if (id)
      userService.profile(id, authTokens).then(data => {
        setProfile({
          ...data,
          tvlist: data.tvlist.reverse()
        })
      }).catch(err => {
        setNotifications([{ title: err.message, message: 'User not found', type: 'error' }])
      }
      )
    // eslint-disable-next-line
  }, [id, setProfile, authTokens])

  const changeOrderBy = e => {
    setOrderBy(e.target.value)
    if (e.target.value !== orderBy) {
      setProfile({
        ...profile,
        tvlist: profile.tvlist.reverse()
      })
    }
  }

  return (
    <>
      <div className='w-full md:w-4/5 mx-auto mt-4'>
        <ProfileNavigation profile={profile} active={profileNav} onClick={onNavClick} />
        {profileNav === 'TvList' && <div>
          <Select onChange={changeOrderBy} className='w-full' value={orderBy} options={['newest', 'oldest']} label='Sort by' />
          <div className='xl:grid grid-cols-2 gap-5 mt-4 xl:mx-2'>
            {profile.tvlist && profile.tvlist.map(show => <TvCard className='mt-4 xl:mt-0' key={show.tv_id} show={show.tv_info} />)}
          </div>
        </div>}
      </div>
    </>
  )
}

export default Profile