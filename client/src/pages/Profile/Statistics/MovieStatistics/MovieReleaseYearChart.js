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


const MovieReleaseYearChart = () => {
    const { profile } = useProfile()
    let data = []
    profile.movielist.forEach(movie => {
        let found = false
        for (let i = 0; i < data.length; i++) {
            if (+data[i].name === +movie.info.release_date.split('-')[0]) {
                data[i].value++
                found = true
                break
            }
        }
        if (!found)
            data.push({ name: movie.info.release_date.split('-')[0], value: 1 })
    })
    data.sort((a, b) => {
        return +a.name - +b.name
    })
    const labels = data.map(item => item.name)
    const datasets = [
        {
            label: 'Release Year',
            data: data.map(item => item.value),
            backgroundColor
        }
    ]
    return (
        <div classx='relative' style={{ height: '20rem' }}>
            <Bar data={{ labels, datasets }} options={options} />
        </div>
    )
}

export default MovieReleaseYearChart