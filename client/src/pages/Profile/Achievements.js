import React from 'react'
import achievements from '../../assets/achievements.json'

// project hooks
import { useProfile } from '../../context/profile'

const AchievementCard = ({ achievement }) => {
  let tier = 0
  achievement.tiers.forEach(t => {
    if (achievement.value >= t)
      tier += 1
  })
  return (
    <div>
      <h3 className='text-gray-700 text-semibold text-lg'>{achievement.name} (Tier {tier})</h3>
      <p className='text-gray-600'>{achievement.desc}</p>
      <div className='w-full h-6 bg-indigo-200 mt-1'>
        <div
          className='bg-pink-500 h-full text-center leading-6 text-white overflow-hidden whitespace-nowrap'
          title={`Progress: ${Math.floor(100 * achievement.value / achievement.tiers[tier])}%`}
          style={{ width: `calc(100% * ${achievement.value} / ${achievement.tiers[tier]})` }}
        >
          {Math.floor(achievement.value)} / {achievement.tiers[tier] ? achievement.tiers[tier] : achievement.tiers[tier - 1]}
        </div>
      </div>
    </div>
  )
}

const Achievements = () => {
  const { profile } = useProfile()
  const stats = calculateStatistics(profile.tvlist)
  achievements.hours.value = stats.hours
  achievements.show_count.value = stats.show_count
  achievements.completed.value = stats.completed
  achievements.rewatches.value = stats.rewatches
  achievements.following.value = profile.following.length
  return (
    <div className='mx-4 flex flex-col gap-4'>
      {
        Object.entries(achievements).map(([key, value]) =>
          <AchievementCard key={key} achievement={value} />
        )
      }
    </div>
  )
}

const calculateStatistics = (tvlist) => {
  let minutes = 0
  let rewatches = 0
  let completed = 0
  tvlist.forEach((show) => {
    let sorted_progress = [...show.progress]
    sorted_progress.sort((a, b) => {
      if (a.season === b.season) {
        return b.episode - a.episode
      } else {
        return b.season - a.season
      }
    })

    const highest_progress = sorted_progress[0]

    if (show.tv_info.number_of_seasons === highest_progress.season)
      completed += 1

    if (sorted_progress.length > 1)
      rewatches += sorted_progress.length - 1

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
  })

  const hours = minutes / 60
  const show_count = tvlist.length
  return { hours, rewatches, completed, show_count }
}

export default Achievements