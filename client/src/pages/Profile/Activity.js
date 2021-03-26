import React from 'react'


// project hooks
import { useProfile } from '../../context/profile'

import ActivityFeed from '../../components/ActivityFeed'

const Activity = () => {
  const { profile } = useProfile()
  return (
    <>
      <ActivityFeed activities={profile.activity} />
    </>
  )
}

export default Activity