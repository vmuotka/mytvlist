import React from 'react'

// project components
import { useProfile } from '../../../../context/profile'

const BasicStatisticsBar = () => {
    const { profile } = useProfile()
    let minutes = 0
    let rewatches = 0
    let watched = 0
    profile.movielist.forEach(movie => {
        movie.watch_times.forEach(watch => {
            minutes += movie.info.runtime
        })

        if (movie.watch_times.length >= 1)
            watched++

        if (movie.watch_times.length > 1) {
            const movie_rewatches = movie.watch_times.length - 1
            rewatches += movie_rewatches
        }

    })
    return (
        <div className='w-full bg-gradient-to-t from-pink-500 to-pink-400  text-white px-6 py-4 grid sm:grid-cols-4 divide-white divide-y sm:divide-y-0 sm:divide-x shadow rounded font-medium'>
            <div className='text-center py-2 sm:py-0'>
                <span className='block text-lg'>
                    Number of movies
                </span>
                {profile.movielist.length}
            </div>
            <div className='text-center py-2 sm:py-0'>
                <span className='block text-lg'>
                    Rewatches
                </span>
                {rewatches}
            </div>
            <div className='text-center py-2 sm:py-0'>
                <span className='block text-lg'>
                    Hours watched
                </span>
                {Math.floor(minutes / 60 * 10) / 10}
            </div>
            <div className='text-center py-2 sm:py-0'>
                <span className='block text-lg'>
                    % of movies
                </span>
                {Math.floor(watched / profile.movielist.length * 100 * 10) / 10}
            </div>
        </div>
    )
}

export default BasicStatisticsBar