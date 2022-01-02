import React, { useEffect, useState } from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

const Basic = ({ startDate, endDate }) => {
    const { profile } = useProfile()
    const [data, setData] = useState({
        hours: 0,
        rewatches: 0,
        percentage_watched: 0
    })

    useEffect(() => {
        let minutes = 0
        let completed_episodes = 0
        let total_episodes = 0
        let rewatches = 0

        const tvlist = JSON.parse(JSON.stringify(profile.tvlist))
        tvlist.forEach((show) => {
            const a = show.tv_info.number_of_episodes // all episodes

            let sorted_progress = [...show.watch_progress]
            sorted_progress.forEach(progress => {
                progress.episodes = progress.episodes.filter(ep => ep.watched)
            })
            sorted_progress.sort((a, b) => {
                return b.episodes.length - a.episodes.length
            })

            const highest_progress = sorted_progress[0]
            const w = highest_progress.episodes.length

            if (sorted_progress.length > 1)
                rewatches += sorted_progress.length - 1

            if (show.tv_info.episode_run_time[0]) {
                sorted_progress.forEach(progress => {

                    if (startDate)
                        progress.episodes = progress.episodes.filter(ep => ep.updatedAt >= startDate)

                    if (endDate)
                        progress.episodes = progress.episodes.filter(ep => ep.updatedAt <= endDate)


                    const totalepisodes = progress.episodes.length

                    minutes += totalepisodes * +show.tv_info.episode_run_time[0]
                }
                )
            }

            completed_episodes += w
            total_episodes += a
        })
        const hours = minutes / 60
        const percentage_watched = Math.floor(completed_episodes / total_episodes * 1000) / 10
        setData({
            hours,
            rewatches,
            percentage_watched
        })
    }, [profile.tvlist, startDate, endDate])

    const hoursOrDays = (hours) => {
        return hours >= 72 ? (Math.floor(hours / 24 * 10) / 10) : Math.floor(hours * 10) / 10
    }

    return (
        <>
            <div className='w-full bg-gradient-to-t from-pink-500 to-pink-400  text-white px-6 py-4 grid sm:grid-cols-4 divide-white divide-y sm:divide-y-0 sm:divide-x shadow rounded font-medium'>
                <div className='text-center py-2 sm:py-0'>
                    <span className='block text-lg'>Number of shows</span>
                    {profile.tvlist.length}
                </div>
                <div className='text-center py-2 sm:py-0'>
                    <span className='block text-lg'>Rewatches</span>
                    {data.rewatches}
                </div>
                <div className='text-center py-2 sm:py-0'>
                    <span className='block text-lg' title={(startDate || endDate) && 'Filtered by given dates'}>
                        {data.hours >= 72 ? 'Days' : 'Hours'} watched{(startDate || endDate) && '*'}
                    </span>
                    {hoursOrDays(data.hours)}
                </div>
                <div className='text-center py-2 sm:py-0'>
                    <span className='block text-lg break-words'>% of episodes</span>
                    {data.percentage_watched}
                </div>
            </div>
        </>
    )
}

export default Basic