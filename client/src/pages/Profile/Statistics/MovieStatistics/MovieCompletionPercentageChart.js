import React from 'react'


// project hooks
import { useProfile } from '../../../../context/profile'

// project components
import PieChart from '../../../../components/Charts/PieChart'

const MovieCompletionPercentageChart = () => {
    const { profile } = useProfile()
    let watched = { name: 'Watched', value: 0 }
    let not_watched = { name: 'Planned', value: 0 }

    profile.movielist.forEach(movie => {
        if (movie.watch_times.length >= 1)
            watched.value++
        else
            not_watched.value++
    })

    const data = [watched, not_watched]
    return (
        <div className='relative h-64'>
            <PieChart data={data} colors={['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']} />
        </div>
    )
}

export default MovieCompletionPercentageChart