import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'


// project hooks
import { useProfile } from '../../../../context/profile'

ChartJS.register(ArcElement, Tooltip, Legend)

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true
        },
        title: {
            display: false,
        },
    },
}

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

    const data = {
        labels: ['Watched', 'Planned'],
        datasets: [{
            data: [watched.value, not_watched.value],
            backgroundColor: ['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']
        }]
    }
    return (
        <div className='relative h-64'>
            <Pie data={data} options={options} />
        </div>
    )
}

export default MovieCompletionPercentageChart