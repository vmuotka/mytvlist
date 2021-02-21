import React from 'react'

const ActorCard = ({ actor }) => {
  actor.roles.sort((a, b) => {
    if (a.episode_count > b.episode_count)
      return -1
    if (a.episode_count < b.episode_count)
      return 1

    return 0
  })
  return (
    <div className='w-full flex rounded'>
      <img
        alt={`${actor.name}`}
        className='h-auto w-24 flex-none object-cover rounded-l overflow-hidden bg-pink-500'
        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
      />
      <div className='w-full flex flex-col border-b border-r border-t rounded-r border-pink-500 p-4 leading-tight'>
        <span className='text-gray-700 text-lg'>
          {actor.name}
        </span>
        <span className='flex flex-col' title={actor.roles.map(role => role.character).join('\n')}>
          {actor.roles.slice(0, 2).map(role =>
            <span key={role.credit_id} className='text-gray-600 text-sm'>
              {role.character} ({role.episode_count}&nbsp;ep)
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

export default ActorCard