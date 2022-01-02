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
    const [progress, setProgress] = useState(null)
    useEffect(() => {
        if (profile.tvlist) {
            let list = [...profile.tvlist]
            let planning = { name: 'Planning', value: 0 }
            let watching = { name: 'Watching', value: 0 }
            let completed = { name: 'Completed', value: 0 }
            let paused = { name: 'Paused', value: 0 }
            list.forEach(show => {
                const watchtime = show.watch_progress[show.watch_progress.length - 1]
                const progress = watchtime.episodes.filter(ep => ep.watched)

                if (progress.length === show.tv_info.number_of_episodes)
                    completed.value += 1
                else if (!show.watching)
                    paused.value += 1
                else if (progress.length === 0)
                    planning.value += 1
                else if (progress.length < show.tv_info.number_of_episodes)
                    watching.value += 1

            })

            setProgress({
                labels: ['Planning', 'Watching', 'Completed', 'Paused'],
                datasets: [
                    {
                        label: '',
                        data: [
                            watching.value,
                            completed.value,
                            planning.value,
                            paused.value
                        ],
                        backgroundColor: ['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']
                    }
                ]
            })
        }
    }, [profile])
    return (
        <div className='relative h-64'>
            {progress && <Pie data={progress} options={options} />}
        </div>
    )
}

export default ProgressChart