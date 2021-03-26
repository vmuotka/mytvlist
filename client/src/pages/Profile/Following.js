import React from 'react'

// project hooks
import { useProfile } from '../../context/profile'

import UserCard from '../../components/UserCard'

const Following = () => {
  const { profile } = useProfile()
  return (
    <>
      <p className='mt-4 mb-2 text-gray-600 font-semibold select-none'>Following {profile.following.length} users</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mx-2'>
        {profile.following.map(user => <UserCard key={user.id} user={user} />)}
      </div>
    </>
  )
}

export default Following