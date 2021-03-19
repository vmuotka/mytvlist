import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../context/profile'

// project components
import PieChart from '../../../components/Charts/PieChart'

const ProgressChart = () => {
  const { profile } = useProfile()
  const [completion, setCompletion] = useState([])
  useEffect(() => {
    if (profile.tvlist) {
      let watched = { name: 'Watched', value: 0 }
      let total = { name: 'Not Watched', value: 0 }
      profile.tvlist.forEach((show) => {
        let w = 0
        let sorted_progress = [...show.progress]
        sorted_progress.sort((a, b) => {
          if (a.season === b.season) {
            return b.episode - a.episode
          } else {
            return b.season - a.season
          }
        })

        const progress = sorted_progress[0]

        for (let i = 0; i < progress.season; i++) {
          w += show.tv_info.seasons[i].episode_count
        }
        if (progress.season !== show.tv_info.seasons.length)
          w += progress.episode
        watched.value += w
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