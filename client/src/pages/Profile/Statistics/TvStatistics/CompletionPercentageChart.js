import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

// project components
import PieChart from '../../../../components/Charts/PieChart'

const ProgressChart = () => {
    const { profile } = useProfile()
    const [completion, setCompletion] = useState([])
    useEffect(() => {
        if (profile.tvlist) {
            let watched = { name: 'Watched', value: 0 }
            let total = { name: 'Not Watched', value: 0 }
            profile.tvlist.forEach((show) => {
                let sorted_progress = [...show.watch_progress]
                sorted_progress.forEach(progress => {
                    progress.episodes = progress.episodes.filter(ep => ep.watched)
                })
                sorted_progress.sort((a, b) => {
                    return b.episodes.length - a.episodes.length
                })

                const progress = sorted_progress[0]

                watched.value += progress.episodes.length
                total.value += show.tv_info.number_of_episodes
            })
            total.value = total.value - watched.value
            setCompletion([
                watched,
                total
            ])
        }
    }, [profile])
    return (
        <div className='relative h-64'>
            <PieChart data={completion} colors={['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']} />
        </div>
    )
}

export default ProgressChart