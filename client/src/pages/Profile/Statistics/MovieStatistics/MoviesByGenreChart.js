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


const backgroundColor = ['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391', '#fc8181', '#63b3ed', '#d53f8c', '#f6e05e', '#805ad5', '#d53f8c', '#e53e3e', '#48bb78', '#38b2ac', '#667eea', '#ed64a6', '#d69e2e']


const MoviesByGenreChart = () => {
    const { profile } = useProfile()
    let genres = []
    profile.movielist.forEach(movie => {
        for (let i = 0; i < movie.info.genres.length; i++) {
            let genreFound = false
            for (let j = 0; j < genres.length; j++) {
                if (genres[j].id === movie.info.genres[i].id) {
                    genres[j].value += 1
                    genreFound = true
                }
            }
            if (!genreFound) {
                genres.push(
                    {
                        name: movie.info.genres[i].name,
                        id: movie.info.genres[i].id,
                        value: 1
                    })
            }
        }
    })
    genres.sort((a, b) => {
        if (a.value > b.value)
            return -1
        if (a.value < b.value)
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
            <Pie data={data} options={options} />
        </div>
    )
}

export default MoviesByGenreChart