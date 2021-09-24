import React, { useState } from 'react'
import { Link } from 'react-router-dom'


import { useProfile } from '../../../context/profile'
import userService from '../../../services/userService'
import DoubleUp from '../../../components/icons/DoubleUp'
import DoubleDown from '../../../components/icons/DoubleDown'
import Select from '../../../components/Select'
import ToggleButton from '../../../components/ToggleButton'

import '../ProgressTableRow.css'

const EpisodeRow = ({ episode, show, odd }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)

    const watchtime = 0

    const [toggled, setToggled] = useState(show.watch_progress[watchtime].episodes.some(x => x.episode_id === episode.id) ? show.watch_progress[watchtime].episodes.find(x => x.episode_id === episode.id).watched : false)

    const handleEpisode = (e) => {
        const episodeObj = {
            tvprogress_id: show.watch_progress[watchtime].id,
            episode_id: episode.id,
            watched: !toggled,
        }
        userService.saveEpisode(episodeObj)

        let showCopy = { ...show }
        if (showCopy.watch_progress[watchtime].episodes.some(ep => ep.tv_id === episode.id))
            showCopy.watch_progress[watchtime].episodes.map(ep => ep.tv_id === episode.id ? episodeObj : ep)
        else
            showCopy.watch_progress[watchtime].episodes.push(episodeObj)

        setProfile({
            ...profile,
            tvlist: profile.tvlist.map(list => list.tv_id === show.tv_id ? showCopy : list)
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

const ExpandedTable = ({ show, odd }) => {
    const [season, setSeason] = useState(0)
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)
    return (
        <>
            <tr
                className={`grid text-sm sm:text-lg md:text-xl hoverable-tablerow ${odd && 'bg-pink-100'} hover:bg-pink-300`}
                style={{
                    gridTemplateColumns: myProfile ? '6fr' : '6fr'
                }}
            >
                <th>
                    <Select
                        value={season}
                        options={show.tv_info.seasons.map((x, i) => Object({ name: x.name, value: i }))}
                        onChange={(e) => { setSeason(+e.target.value) }}
                    />
                </th>
            </tr>
            {
                show.tv_info.seasons[season].episodes.map(episode => <EpisodeRow show={show} episode={episode} key={episode.id} odd={odd} />)
            }
        </>
    )
}

const TableRow = ({ show, odd }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)
    const [expanded, setExpanded] = useState(false)
    return (
        <>
            <tr
                className={`grid text-sm sm:text-lg md:text-xl hoverable-tablerow ${odd && 'bg-pink-100'} hover:bg-pink-300`}
                style={{
                    gridTemplateColumns: myProfile ? '3fr 1fr 1fr 1fr' : '3fr 1fr 1fr'
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
                    {show.score}
                </td>
                {myProfile &&
                    <td className='flex justify-center items-center'>
                        <button
                            // onClick={handleWatchBtn}
                            className='px-2 py-1 bg-pink-500 text-white font-semibold rounded text-base hover:bg-pink-400'
                        >
                            Watch
                        </button>
                    </td>
                }
            </tr>
            {
                expanded &&
                <ExpandedTable show={show} odd={odd} />
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
                                gridTemplateColumns: myProfile ? '3fr 1fr 1fr 1fr' : '3fr 1fr 1fr'
                            }}
                        >
                            <th className='flex items-center justify-center'>Title</th>
                            <th className='flex items-center justify-center'>Times watched</th>
                            <th className='flex items-center justify-center'>Score</th>
                            {myProfile && <th className='flex items-center justify-center'>Action</th>}
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