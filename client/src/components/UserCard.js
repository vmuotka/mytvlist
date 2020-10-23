import React from 'react'
import { Link } from 'react-router-dom'

const UserCard = ({ user }) => {
  console.log(user)
  return (
    <div className='border border-pink-400 rounded px-4 py-2 w-full'>
      <span className='block text-indigo-500 text-xl'><Link to={`/user/${user.username}`}>{user.username}</Link></span>
      <span className='block text-gray-700'>Number of shows: {user.show_count}</span>
      <span className='block text-gray-700'>User since: {new Intl.DateTimeFormat('en-GB').format(new Date(user.createdAt))}</span>
    </div>
  )
}

export default UserCard