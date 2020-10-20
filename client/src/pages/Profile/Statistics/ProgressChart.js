import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../context/profile'

// project components
import PieChart from '../../../components/Charts/PieChart'

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
        if (show.progress[0].season === 0 && show.progress[0].episode === 0 && show.watching) {
          planning.value += 1
        } else if (show.watching && show.progress[show.progress.length - 1].season !== show.tv_info.seasons.length)
          watching.value += 1
        else if (show.progress[show.progress.length - 1].season === show.tv_info.seasons.length) {
          completed.value += 1
        } else if (!show.watching) {
          paused.value += 1
        }
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