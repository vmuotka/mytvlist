import React from 'react'
import { Link } from 'react-router-dom'

const ActivityFeed = ({ activities }) => {
  return (
    <div className='mx-4 divide-y'>
      {
        activities.map(activity =>
          <p key={activity.id} className='text-gray-600 py-1 italic'>
            <Link className='font-semibold text-pink-500 not-italic' to={`/user/${activity.user.username}`}>{activity.user.username}</Link> {activity.desc}
          </p>
        )
      }
    </div>
  )
}

export default ActivityFeed