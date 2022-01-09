import React from 'react'
import { Link } from 'react-router-dom'

const ActorCard = ({ actor }) => {
    actor.roles && actor.roles.sort((a, b) => {
        if (a.episode_count > b.episode_count)
            return -1
        if (a.episode_count < b.episode_count)
            return 1

        return 0
    })
    return (
        <div className='w-full flex rounded'>
            <img
                alt={` `}
                className='h-auto w-24 flex-none object-cover rounded-l overflow-hidden bg-pink-500'
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
            />
            <div className='w-full flex flex-col border-b border-r border-t rounded-r border-pink-500 p-4 leading-tight'>
                <span className='text-gray-700 text-lg'>
                    <Link to={`/actor/${actor.id}`} >{actor.name}</Link>
                </span>
                {actor.roles &&
                    <span className='flex flex-col' title={actor.roles.map(role => role.character).join('\n')}>
                        {actor.roles.slice(0, 2).map(role =>
                            <span key={role.credit_id} className='text-gray-600 text-sm'>
                                {role.character} ({role.episode_count}&nbsp;ep)
                            </span>
                        )}
                    </span>}
                {
                    actor.character ?
                        <span className='text-gray-600 text-sm'>
                            {actor.character}
                        </span> :
                        actor.known_for &&
                        <>
                            <div className='text-gray-700 font-medium text-sm'>
                                Known for
                            </div>
                            <ul className='ml-2 text-gray-600 text-sm'>
                                {actor.known_for.slice(0, 3).map(entry =>
                                    <li key={entry.id}>{entry.title}</li>
                                )}
                            </ul>

                        </>
                }
            </div>
        </div>
    )
}

export default ActorCard