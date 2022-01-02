import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// project hooks
import { useProfile } from '../../../../context/profile'


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: false,
        },
    },
}

const backgroundColor = ['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391', '#fc8181', '#63b3ed', '#d53f8c', '#f6e05e', '#805ad5', '#d53f8c', '#e53e3e', '#48bb78', '#38b2ac', '#667eea', '#ed64a6', '#d69e2e']

const MovieHoursByGenreChart = () => {
    const { profile } = useProfile()
    let genres = []
    profile.movielist.forEach((movie) => {
        if (movie.watch_times.length >= 1) {
            let minutes = 0
            movie.watch_times.forEach(watch => {
                minutes += movie.info.runtime
            })
            for (let i = 0; i < movie.info.genres.length; i++) {
                let genreFound = false
                for (let j = 0; j < genres.length; j++) {
                    if (genres[j].id === movie.info.genres[i].id) {
                        genres[j].value += minutes
                        genreFound = true
                    }
                }
                if (!genreFound) {
                    genres.push(
                        {
                            name: movie.info.genres[i].name,
                            id: movie.info.genres[i].id,
                            value: minutes
                        })
                }
            }
        }
    })

    for (let i = 0; i < genres.length; i++) {
        genres[i].value = Math.floor(genres[i].value / 60 * 10) / 10
    }
    genres.sort((a, b) => {
        if (a.name < b.name)
            return -1
        if (a.name > b.name)
            return 1
        return 0
    })


    const data = {
        labels: genres.map(genre => genre.name),
        datasets: [
            {
                data: genres.map(genre => genre.value),
                backgroundColor
            }
        ]
    }

    return (
        <div className='relative' style={{ height: '20rem' }}>
            <Bar data={data} options={options} />
        </div>
    )
}

export default MovieHoursByGenreChart