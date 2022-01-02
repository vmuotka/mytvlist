import React, { useState, useEffect } from 'react'
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


const ProgressChart = ({ startDate, endDate }) => {
    const { profile } = useProfile()
    const [hoursByGenre, setHoursByGenre] = useState(null)
    useEffect(() => {
        if (profile.tvlist) {
            let genres = []
            profile.tvlist.forEach((show) => {
                let w = 0
                const progressArray = [...show.watch_progress]
                progressArray.forEach(progress => {
                    let watched_episodes = progress.episodes.filter(ep => ep.watched)
                    if (startDate) {
                        watched_episodes = watched_episodes.filter(ep => ep.updatedAt >= startDate)
                    }
                    if (endDate) {
                        watched_episodes = watched_episodes.filter(ep => ep.updatedAt <= endDate)
                    }

                    w += watched_episodes.length
                })

                let minutes = w * +show.tv_info.episode_run_time[0]
                if (minutes > 0) {
                    for (let i = 0; i < show.tv_info.genres.length; i++) {
                        let genreFound = false
                        for (let j = 0; j < genres.length; j++) {
                            if (genres[j].id === show.tv_info.genres[i].id) {
                                genres[j].minutes += minutes
                                genreFound = true
                            }
                        }
                        if (!genreFound) {
                            genres.push(
                                {
                                    name: show.tv_info.genres[i].name,
                                    id: show.tv_info.genres[i].id,
                                    minutes
                                })
                        }
                    }
                }

            })
            for (let i = 0; i < genres.length; i++) {
                genres[i].value = Math.floor(genres[i].minutes / 60)
                delete genres[i].minutes
            }
            genres.sort((a, b) => {
                if (a.name < b.name)
                    return -1
                if (a.name > b.name)
                    return 1
                return 0
            })

            const labels = genres.map(genre => genre.name)
            const datasets = [{
                label: 'Hours',
                data: genres.map(genre => genre.value),
                backgroundColor
            }]

            setHoursByGenre({
                labels,
                datasets
            })
        }
    }, [profile, startDate, endDate])
    return (
        <div className='relative' style={{ height: '20rem' }}>
            {hoursByGenre && <Bar data={hoursByGenre} options={options} />}
        </div>
    )
}

export default ProgressChart