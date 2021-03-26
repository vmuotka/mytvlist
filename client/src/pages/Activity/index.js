import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// project services
import userService from '../../services/userService'

// project hooks
import { useAuth } from '../../context/auth'

import Spinner from '../../components/Spinner'

const Activity = () => {
  const { authTokens } = useAuth()
  const [activities, setActivities] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (authTokens) {
      console.log(authTokens)
      userService.getActivities(authTokens)
        .then(data => {
          console.log(data)
          setActivities(data.activities)
          setFollowing(data.following)
          setLoading(false)
        })
    }
  }, [authTokens])
  return (
    <div className='w-full md:w-4/5 mx-auto mt-3'>
      {loading ? <Spinner className='mx-auto mt-4' color='bg-pink-500' show={true} /> :
        <div className='flex flex-col-reverse md:flex-row'>
          <div className='md:w-4/5'>
            <h2 className='text-xl text-gray-700 text-semibold'>Activity Feed</h2>
            <div className='mx-4 divide-y'>
              {
                activities.map(activity =>
                  <p key={activity.id} className='text-gray-600 py-1 italic'>
                    <Link className='font-semibold text-pink-500 not-italic' to={`/user/${activity.user.username}`}>{activity.user.username}</Link> {activity.desc}
                  </p>
                )
              }
            </div>
          </div>
          {following.length > 0 && <div>
            <h2 className='text-xl text-gray-700 text-semibold'>Following ({following.length})</h2>
            <ul className='w-1/5 ml-2'>
              {
                following.map(user =>
                  <li className='text-gray-600 hover:text-gray-700 hover:font-semibold' key={user.id}><Link to={`/user/${user.username}`} >{user.username}</Link></li>
                )
              }
            </ul>
          </div>}

        </div>}
    </div>
  )
}

export default Activity