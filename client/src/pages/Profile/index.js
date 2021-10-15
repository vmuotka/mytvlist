import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { connect, useDispatch } from 'react-redux'

// project services
import userService from '../../services/userService'
import { setProfile } from '../../redux/profileReducer'

// project components
import ProfileNavigation from './ProfileNavigation'
import TvList from './TvList'
import Progress from './Progress'
import Statistics from './Statistics/'
import Activity from './Activity'
import Following from './Following'
import Reviews from './Reviews'
import Achievements from './Achievements'
import Spinner from '../../components/Spinner'

// project hooks
import { ProfileContext } from '../../context/profile'
import { useNotification } from '../../context/notification'

const Profile = ({ user, profile }) => {
    const { username } = useParams()
    const { setNotifications } = useNotification()
    const [profileNav, setProfileNav] = useState('TvList')
    const dispatch = useDispatch()

    const onNavClick = (nav) => e => {
        setProfileNav(nav)
    }

    useEffect(() => {
        if (username)
            userService.profile(username).then(data => {
                dispatch(setProfile(data))

                setProfileNav('TvList')
            }).catch(err => {
                setNotifications([{ title: err.message, message: 'User not found', type: 'error' }])
            }
            )
        // eslint-disable-next-line
    }, [username, setProfile, user])

    return (
        <>
            <div className='w-full md:w-4/5 mx-auto mt-3'>
                {
                    profile ?
                        <>
                            <ProfileNavigation active={profileNav} onClick={onNavClick} />
                            {profileNav === 'TvList' && <TvList />}
                            {profileNav === 'Statistics' && <Statistics />}
                            {profileNav === 'Progress' && <Progress />}
                            {profileNav === 'Activity' && <Activity />}
                            {profileNav === 'Following' && <Following />}
                            {profileNav === 'Reviews' && <Reviews reviews={profile.reviews} />}
                            {profileNav === 'Achievements' && <Achievements />}
                        </>
                        : <Spinner show={true} color='bg-pink-500' className='mx-auto mt-4' />
                }
            </div>
        </>
    )
}

const mapProps = (state) => {
    return {
        user: state.user,
        profile: state.profile
    }
}

const connectedProfile = connect(mapProps)(Profile)

export default connectedProfile