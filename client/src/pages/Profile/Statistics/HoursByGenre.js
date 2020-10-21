import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../context/profile'

// project components
import BarChart from '../../../components/Charts/BarChart'

const ProgressChart = () => {
  const { profile } = useProfile()
  const [hoursByGenre, setHoursByGenre] = useState([])
  useEffect(() => {
    if (profile.tvlist) {
      let genres = []
      profile.tvlist.forEach((show) => {
        let w = 0
        const progress = { ...show.progress[show.progress.length - 1] }
        for (let i = 0; i < progress.season; i++) {
          w += show.tv_info.seasons[i].episode_count
        }
        if (progress.season !== show.tv_info.seasons.length)
          w += progress.episode

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
      setHoursByGenre(genres)
    }
  }, [profile])
  return (
    <div className='relative' style={{ height: '20rem' }}>
      <BarChart data={hoursByGenre} />
    </div>
  )
}

export default ProgressChart