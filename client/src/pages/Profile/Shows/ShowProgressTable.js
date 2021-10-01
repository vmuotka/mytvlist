import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


import { useProfile } from '../../../context/profile'
import userService from '../../../services/userService'
import tvlistService from '../../../services/tvlistService'
import DoubleUp from '../../../components/icons/DoubleUp'
import DoubleDown from '../../../components/icons/DoubleDown'
import Select from '../../../components/Select'
import ToggleButton from '../../../components/ToggleButton'
import InputField from '../../../components/InputField'

import '../ProgressTableRow.css'

const EpisodeRow = ({ episode, show, watchtime, odd }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)

    const [toggled, setToggled] = useState(false)

    useEffect(() => {
        setToggled(show.watch_progress[watchtime].episodes.some(x => x.episode_id === episode.id) ? show.watch_progress[watchtime].episodes.find(x => x.episode_id === episode.id).watched : false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchtime, episode.id, show])

    const handleEpisode = (e) => {
        const episodeObj = {
            tvprogress_id: show.watch_progress[watchtime].id,
            episode_id: episode.id,
            watched: !toggled,
        }
        tvlistService.saveEpisode(episodeObj)


        let showCopy = { ...show }
        if (showCopy.watch_progress[watchtime].episodes.some(ep => ep.episode_id === episode.id))
            showCopy.watch_progress[watchtime].episodes = showCopy.watch_progress[watchtime].episodes.map(ep => ep.episode_id === episode.id ? episodeObj : ep)
        else {
            showCopy.watch_progress[watchtime].episodes.push(episodeObj)
        }

        setProfile({
            ...profile,
            tvlist: profile.tvlist.map(list => +list.tv_info.id === +show.tv_info.id ? showCopy : list)
        })
        setToggled(episodeObj.watched)
    }

    return (
        <tr
            className={`grid text-sm sm:text-lg md:text-xl hoverable-tablerow ${odd && 'bg-pink-100'} hover:bg-pink-300`}
            style={{
                gridTemplateColumns: myProfile ? '5fr 1fr' : '5fr 1fr'
            }}
        >
            <td className='py-2 px-2 text-md'>
                {episode.episode_number}. {episode.name}
            </td>
            <td className='flex justify-center py-2'>
                <ToggleButton
                    toggled={toggled}
                    onClick={myProfile ? handleEpisode : undefined}
                    className={`${!myProfile && 'cursor-default'}`}
                />
            </td>
        </tr>
    )
}

const ExpandedTable = ({ show, odd, watchtime, setWatchtime }) => {
    const [season, setSeason] = useState(0)
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)
    let watchtimeSelectOptions = []
    for (let i = 0; i < show.watch_progress.length; i++)
        watchtimeSelectOptions.push({ name: i + 1, value: i })


    const handleRewatch = () => {
        if (window.confirm(`Are you sure you want to rewatch ${show.name}? You cannot delete the rewatch.`)) {
            tvlistService.rewatch(show.watch_progress[show.watch_progress.length - 1])
                .then(data => {
                    let showCopy = { ...show }
                    showCopy.watch_progress.push(data)
                    setProfile({
                        ...profile,
                        tvlist: profile.tvlist.map(list => list.tv_id === show.tv_id ? showCopy : list)
                    })
                })
        }
    }

    const handleWatchingChange = (e) => {
        const value = JSON.parse(e.target.value)
        tvlistService.saveWatching(value, show.tv_id)
            .then(data => {
                let showCopy = { ...show }
                showCopy.watching = data.watching
                setProfile({
                    ...profile,
                    tvlist: profile.tvlist.map(list => list.tv_id === showCopy.tv_id ? showCopy : list)
                })
            })
    }

    return (
        <>
            <tr
                className={`grid text-sm sm:text-lg md:text-xl hoverable-tablerow ${odd && 'bg-pink-100'} hover:bg-pink-300`}
                style={{
                    gridTemplateColumns: myProfile ? '3fr 1fr 1fr 1fr' : '3fr 1fr 1fr 1fr'
                }}
            >
                <td className='flex justify-center items-center'>
                    <Select
                        className='w-full'
                        value={season}
                        options={show.tv_info.seasons.map((x, i) => Object({ name: x.name, value: i }))}
                        onChange={(e) => { setSeason(+e.target.value) }}
                    />
                </td>
                <td className='flex justify-center items-center'>
                    <Select
                        value={watchtime}
                        options={watchtimeSelectOptions}
                        onChange={(e) => { setWatchtime(+e.target.value) }}
                    />
                </td>
                <td className='flex justify-center items-center'>
                    <Select
                        value={show.watching}
                        options={[
                            { name: 'Watching', value: true },
                            { name: 'Paused', value: false }
                        ]}
                        onChange={handleWatchingChange}
                    />
                </td>
                <td className='flex justify-center items-center'>
                    {myProfile && <button
                        onClick={handleRewatch}
                        className='px-2 py-1 bg-indigo-500 text-white font-semibold rounded text-base hover:bg-indigo-600'
                    >
                        Rewatch
                    </button>}
                </td>
            </tr>
            {
                show.tv_info.seasons[season].episodes.map(episode => <EpisodeRow show={show} watchtime={watchtime} episode={episode} key={episode.id} odd={odd} />)
            }
        </>
    )
}

const TableRow = ({ show, odd }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)
    const [expanded, setExpanded] = useState(false)
    const [watchtime, setWatchtime] = useState(show.watch_progress.length - 1)
    const [scoreField, setScoreField] = useState(show.score)


    const handleScore = (e) => {
        const score = getScore(+e.target.value)
        tvlistService.saveScore(score, show.id)
        let showCopy = { ...show }
        showCopy.score = score

        setProfile({
            ...profile,
            tvlist: profile.tvlist.map(list => list.tv_id === show.tv_id ? showCopy : list)
        })
    }

    const getScore = (score) => {
        if (score > 100)
            score = 100
        if (score < 0)
            score = 0
        return score
    }


    const getNextEpisode = () => {
        let last = show.watch_progress[watchtime]
        let showCopy = { ...show }
        let episodes = []
        for (const season of showCopy.tv_info.seasons)
            episodes = episodes.concat(season.episodes)

        // just hope you never have to change anything in here
        // in short, it searches if the user has watched each episode
        episodes = episodes.map(ep => last.episodes.some(wep => wep.episode_id === ep.id) ? { ...ep, watched: last.episodes.find(wep => wep.episode_id === ep.id).watched } : { ...ep, watched: false })

        episodes.reverse()

        const nextEpisode = episodes[episodes.findIndex(ep => ep.watched) - 1]
        return nextEpisode
    }

    const handleWatchNext = () => {
        const episodeObj = {
            tvprogress_id: show.watch_progress[watchtime].id,
            episode_id: nextEpisode.id,
            watched: true,
        }
        tvlistService.saveEpisode(episodeObj)


        let showCopy = { ...show }
        if (showCopy.watch_progress[watchtime].episodes.some(ep => ep.episode_id === nextEpisode.id))
            showCopy.watch_progress[watchtime].episodes = showCopy.watch_progress[watchtime].episodes.map(ep => ep.episode_id === nextEpisode.id ? episodeObj : ep)
        else {
            showCopy.watch_progress[watchtime].episodes.push(episodeObj)
        }

        setProfile({
            ...profile,
            tvlist: profile.tvlist.map(list => +list.tv_info.id === +show.tv_info.id ? showCopy : list)
        })
    }

    const nextEpisode = getNextEpisode()

    return (
        <>
            <tr
                className={`grid text-sm sm:text-lg md:text-xl hoverable-tablerow ${odd && 'bg-pink-100'} hover:bg-pink-300`}
                style={{
                    gridTemplateColumns: myProfile ? '3fr 1fr 1fr 1fr' : '3fr 1fr 1fr 1fr'
                }}
            >
                <td className='p-2 text-left flex items-center'>
                    <div
                        className={`h-8 w-6 sm:h-12 sm:w-8 flex-none bg-cover bg-no-repeat rounded text-center overflow-hidden bg-pink-500 flex items-center ${myProfile && 'progress-image'}`}
                        style={{ backgroundImage: show.tv_info.poster_path && `url('https://image.tmdb.org/t/p/w200${show.tv_info.poster_path}')` }}
                    >
                        <button onClick={() => setExpanded(!expanded)}
                            className='w-full modal-btn text-lg text-white p-1 focus:outline-none'>
                            {expanded ? <DoubleUp /> : <DoubleDown />}
                        </button>
                    </div>
                    <Link to={`/show/${show.tv_info.id}`} className='ml-6'>{show.tv_info.name}</Link>
                </td>
                <td className='flex justify-center items-center '>{show.watch_progress.length}</td>
                <td className='justify-center items-center flex'>
                    {myProfile && <InputField
                        className='w-full text-center'
                        type='number'
                        value={scoreField}
                        onBlur={handleScore}
                        onChange={(e) => { setScoreField(getScore(+e.target.value)) }}
                    />}
                </td>
                <td className='flex justify-center items-center'>
                    {(myProfile && nextEpisode) &&
                        <button
                            onClick={handleWatchNext}
                            className='px-2 py-1 bg-indigo-500 text-white font-semibold rounded text-base hover:bg-indigo-600 flex justify-center items-center'
                        >
                            {nextEpisode && `S${nextEpisode.season_number} E${nextEpisode.episode_number}`}
                        </button>
                    }
                </td>
            </tr>
            {
                expanded &&
                <ExpandedTable show={show} odd={odd} watchtime={watchtime} setWatchtime={setWatchtime} />
            }
        </>
    )
}

const ShowProgressTable = ({ tvlist }) => {
    const { profile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)

    if (tvlist.length > 0)
        return (
            <div className='overflow-x-auto'>
                <table className='w-full table-auto' style={{ minWidth: '500px' }}>
                    <thead className='bg-pink-400 text-white md:text-xl'>
                        <tr
                            className='grid py-2'
                            style={{
                                gridTemplateColumns: myProfile ? '3fr 1fr 1fr 1fr' : '3fr 1fr 1fr 1fr'
                            }}
                        >
                            <th className='flex items-center justify-center'>Title</th>
                            <th className='flex items-center justify-center'>Watchtimes</th>
                            <th className='flex items-center justify-center'>Score</th>
                            <th className='flex items-center justify-center'>{myProfile ? 'Action' : 'Watched'}</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-700 bg-pink-150'>
                        {tvlist.map((show, index) =>
                            <TableRow key={show.tv_info.id} odd={index % 2 === 0} show={show} />
                        )}
                    </tbody>
                </table>
            </div>
        )
    else
        return (
            <>
            </>
        )
}

export default ShowProgressTable