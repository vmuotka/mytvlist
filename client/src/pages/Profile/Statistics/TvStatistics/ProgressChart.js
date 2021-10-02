import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

// project components
import PieChart from '../../../../components/Charts/PieChart'

const ProgressChart = () => {
    const { profile } = useProfile()
    const [progress, setProgress] = useState([])
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

            setProgress([
                watching,
                completed,
                planning,
                paused
            ])
        }
    }, [profile])
    return (
        <div className='relative h-64'>
            <PieChart data={progress} colors={['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']} />
        </div>
    )
}

export default ProgressChart