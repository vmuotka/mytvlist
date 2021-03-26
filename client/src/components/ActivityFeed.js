import React from 'react'
import { Link } from 'react-router-dom'

const getDate = (days) => {
  return new Date(new Date() - days * 24 * 60 * 60 * 1000)
}

const ActivityFeed = ({ activities }) => {
  const activity_feed = []

  activity_feed.push({
    name: 'today',
    entries: activities.filter(activity => new Date(activity.updatedAt) >= getDate(1))
  })
  activity_feed.push({
    name: 'yesterday',
    entries: activities.filter(activity => new Date(activity.updatedAt) >= getDate(2) && new Date(activity.updatedAt) < getDate(1))
  })
  activity_feed.push({
    name: 'this week',
    entries: activities.filter(activity => new Date(activity.updatedAt) >= getDate(7) && new Date(activity.updatedAt) < getDate(2))
  })
  activity_feed.push({
    name: 'this month',
    entries: activities.filter(activity => new Date(activity.updatedAt) >= getDate(28) && new Date(activity.updatedAt) < getDate(7))
  })
  activity_feed.push({
    name: 'earlier',
    entries: activities.filter(activity => new Date(activity.updatedAt) >= getDate(28) && new Date(activity.updatedAt) < getDate(28))
  })

  return (
    <div className='mx-4 divide-y'>
      {activities.length === 0 && <p className='text-gray-600'>There is no activity.</p>}
      {
        activity_feed.filter(feed => feed.entries.length > 0).map(feed =>
          <div key={feed.name}>
            <h3 className='text-gray-700 text-lg capitalize'>{feed.name}</h3>
            <div className='ml-2'>
              {feed.entries.map(activity =>
                <p key={activity.id} className='text-gray-600 py-1 italic'>
                  <Link className='font-semibold text-pink-500 not-italic' to={`/user/${activity.user.username}`}>{activity.user.username}</Link> {activity.desc}
                </p>
              )}
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ActivityFeed