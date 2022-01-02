import React, { useState, useEffect } from 'react'
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

const ProgressChart = () => {
    const { profile } = useProfile()
    const [completion, setCompletion] = useState(null)
    useEffect(() => {
        if (profile.tvlist) {
            let watched = 0
            let total = 0
            const tvlist = JSON.parse(JSON.stringify(profile.tvlist))
            tvlist.forEach((show) => {
                let sorted_progress = [...show.watch_progress]
                sorted_progress.forEach(progress => {
                    progress.episodes = progress.episodes.filter(ep =>
                        ep.watched)
                })
                sorted_progress.sort((a, b) => {
                    return b.episodes.length - a.episodes.length
                })

                const progress = sorted_progress[0]

                watched += progress.episodes.length
                total += show.tv_info.number_of_episodes
            })
            total = total - watched
            setCompletion({
                labels: ['Watched', 'Not Watched'],
                datasets: [
                    {
                        label: '',
                        data: [
                            watched,
                            total
                        ],
                        backgroundColor: ['#f687b3', ' #f6ad55']
                    }
                ]
            })
        }
    }, [profile])

    return (
        <div className='relative h-64'>
            {completion && <Pie data={completion} options={options} />}
        </div>
    )
}

export default ProgressChart