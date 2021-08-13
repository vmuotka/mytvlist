import React from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

const Basic = () => {
  const { profile } = useProfile()
  let minutes = 0
  let completed_episodes = 0
  let total_episodes = 0
  let rewatches = 0
  profile.tvlist.forEach((show) => {
    let w = 0 // watched episodes
    let a = 0 // all episodes

    let sorted_progress = [...show.progress]
    sorted_progress.sort((a, b) => {
      if (a.season === b.season) {
        return b.episode - a.episode
      } else {
        return b.season - a.season
      }
    })

    const highest_progress = sorted_progress[0]

    if (sorted_progress.length > 1)
      rewatches += sorted_progress.length - 1

    for (let i = 0; i < highest_progress.season; i++) {
      w += show.tv_info.seasons[i].episode_count
    }

    if (highest_progress.season !== show.tv_info.seasons.length)
      w += highest_progress.episode

    for (let i = 0; i < show.tv_info.seasons.length; i++) {
      a += show.tv_info.seasons[i].episode_count
    }

    show.progress.forEach(progress => {
      let totalepisodes = 0
      for (let i = 0; i < progress.season; i++) {
        totalepisodes += show.tv_info.seasons[i].episode_count
      }
      if (progress.season !== show.tv_info.seasons.length)
        totalepisodes += progress.episode

      if (show.tv_info.episode_run_time[0])
        minutes += totalepisodes * +show.tv_info.episode_run_time[0]
    })

    completed_episodes += w
    total_episodes += a
  })
  const days = Math.floor(minutes / 60 / 24 * 10) / 10
  const percentage_watched = Math.floor(completed_episodes / total_episodes * 1000) / 10
  return (
    <>
      <div className='w-full bg-gradient-to-t from-pink-500 to-pink-400  text-white px-6 py-4 grid sm:grid-cols-4 divide-white divide-y sm:divide-y-0 sm:divide-x shadow rounded font-medium'>
        <div className='text-center py-2 sm:py-0'>
          <span className='block text-lg'>Number of shows</span>
          {profile.tvlist.length}
        </div>
        <div className='text-center py-2 sm:py-0'>
          <span className='block text-lg'>Rewatches</span>
          {rewatches}
        </div>
        <div className='text-center py-2 sm:py-0'>
          <span className='block text-lg'>Days watched</span>
          {days}
        </div>
        <div className='text-center py-2 sm:py-0'>
          <span className='block text-lg break-words'>% of episodes</span>
          {percentage_watched}
        </div>
      </div>
    </>
  )
}

export default Basic