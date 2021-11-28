import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ordinal from 'ordinal'


import { useProfile } from '../../../context/profile'
import userService from '../../../services/userService'
import tvlistService from '../../../services/tvlistService'
import DoubleUp from '../../../components/icons/DoubleUp'
import DoubleDown from '../../../components/icons/DoubleDown'
import DoubleRight from '../../../components/icons/DoubleRight'
import Star from '../../../components/icons/Star'
import SortAsc from '../../../components/icons/SortAsc'
import SortDesc from '../../../components/icons/SortDesc'
import ArrowLeft from '../../../components/icons/ArrowLeft'
import ArrowRight from '../../../components/icons/ArrowRight'
import DeleteIcon from '../../../components/icons/DeleteIcon'
import EditIcon from '../../../components/icons/EditIcon'
import Select from '../../../components/Select'
import ToggleButton from '../../../components/ToggleButton'
import Button from '../../../components/Button'
import Pagination from '../../../components/Pagination'

import '../ProgressTableRow.css'
import './ProgressTable.css'

const EpisodeRow = ({ episode, show, watchtime, odd }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)

    const [toggled, setToggled] = useState(show.watch_progress[watchtime].episodes.some(x => x.episode_id === episode.id) ? show.watch_progress[watchtime].episodes.find(x => x.episode_id === episode.id).watched : false)

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
            className={`flex gap-2 text-sm sm:text-lg md:text-xl hoverable-tablerow ${odd && 'bg-pink-100'} hover:bg-pink-300`}
        >
            <td className='py-2 w-5/6 px-2 text-md'>
                {episode.episode_number}. {episode.name}
            </td>
            <td className='flex w-1/6 justify-center py-2'>
                <ToggleButton
                    toggled={toggled}
                    onClick={myProfile ? handleEpisode : undefined}
                    className={`${!myProfile && 'cursor-default'}`}
                />
            </td>
        </tr>
    )
}

const ExpandedTable = ({ show, odd, watchtime, setWatchtime, nextEpisode }) => {
    const [season, setSeason] = useState(nextEpisode ? nextEpisode.season_number - 1 : show.tv_info.seasons.length - 1)
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)
    let watchtimeSelectOptions = []
    for (let i = 0; i < show.watch_progress.length; i++)
        watchtimeSelectOptions.push({ name: i + 1, value: i })

    useEffect(() => {
        setSeason(nextEpisode ? nextEpisode.season_number - 1 : show.tv_info.seasons.length - 1)
    }, [nextEpisode, show.tv_info.seasons.length])


    const handleRewatch = () => {
        if (window.confirm(`Are you sure you want to rewatch "${show.tv_info.name}"?`)) {
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

    const handlePin = () => {
        tvlistService.pinShow(!show.pinned, show.tv_id)
            .then(data => {
                const showCopy = { ...show }
                showCopy.pinned = data.pinned
                setProfile({
                    ...profile,
                    tvlist: profile.tvlist.map(list => list.id === showCopy.id ? showCopy : list)
                })
            })

    }

    const handleWatchtimeDelete = () => {
        if (window.confirm(`Are you sure you want to delete your ${ordinal(watchtime + 1)} watchtime of ${show.tv_info.name}?`)) {
            let showCopy = { ...show }
            showCopy.watch_progress.splice(watchtime, 1)
            console.log(showCopy)

            tvlistService.deleteWatchtime(show.watch_progress[watchtime])

            setWatchtime(show.watch_progress.length - 1)

            setProfile({
                ...profile,
                tvlist: profile.tvlist.map(list => list.id === showCopy.id ? showCopy : list)
            })
        }
    }

    return (
        <>
            <tr
                className={`flex gap-2 text-sm sm:text-lg md:text-xl hoverable-tablerow ${odd && 'bg-pink-100'} hover:bg-pink-300`}
            >
                <td className='flex w-1/2 gap-2 justify-center items-center'>
                    {myProfile &&
                        <button
                            className='ml-2 focus:outline-none'
                            title={`${show.pinned ? 'Unpin show from top' : 'Pin show to top'}`}
                            onClick={handlePin}
                        >
                            <Star className='h-6' filled={show.pinned} />
                        </button>
                    }
                    <Select
                        className='w-full'
                        value={season}
                        options={show.tv_info.seasons.map((x, i) => Object({ name: x.name, value: i }))}
                        onChange={(e) => { setSeason(+e.target.value) }}
                    />
                    <button
                        className='text-indigo-500 focus:outline-none season-btn'
                        onClick={() => { setSeason(current => Math.max(0, current - 1)) }}
                    >
                        <ArrowLeft className='h-6' />
                    </button>
                    <button
                        className='text-indigo-500 focus:outline-none season-btn mr-2'
                        onClick={() => { setSeason(current => Math.min(show.tv_info.seasons.length - 1, current + 1)) }}
                    >
                        <ArrowRight className='h-6' />
                    </button>
                </td>
                <td className='flex w-1/6 gap-2 justify-center items-center'>
                    <Select
                        value={watchtime}
                        options={watchtimeSelectOptions}
                        onChange={(e) => { setWatchtime(+e.target.value) }}
                    />
                    {(myProfile && show.watch_progress.length > 1) &&
                        <button
                            className='focus:outline-none mr-2'
                            onClick={handleWatchtimeDelete}
                        >
                            <DeleteIcon className='h-6' />
                        </button>
                    }
                </td>
                <td className='flex w-1/6 justify-center items-center'>
                    {myProfile && <Select
                        value={show.watching}
                        options={[
                            { name: 'Watching', value: true },
                            { name: 'Paused', value: false }
                        ]}
                        onChange={handleWatchingChange}
                    />}
                </td>
                <td className='flex w-1/6 justify-center items-center'>
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

const TableRow = ({ show, odd, editMode, handleEditSelect, editSelection }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)
    const [expanded, setExpanded] = useState(false)
    const [watchtime, setWatchtime] = useState(show.watch_progress.length - 1)
    const [scoreField, setScoreField] = useState(show.score)

    useEffect(() => {
        setWatchtime(show.watch_progress.length - 1)
    }, [show.watch_progress.length])

    useEffect(() => {
        setExpanded(false)
    }, [editMode])


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

    const getNextEpisode = useCallback(() => {
        let last = show.watch_progress[Math.min(watchtime, show.watch_progress.length - 1)]
        let showCopy = { ...show }
        let episodes = []
        for (const season of showCopy.tv_info.seasons)
            episodes = episodes.concat(season.episodes)

        // just hope you never have to change anything in here
        // in short, it searches if the user has watched each episode
        episodes = episodes.map(ep => last.episodes.some(wep => wep.episode_id === ep.id) ? { ...ep, watched: last.episodes.find(wep => wep.episode_id === ep.id).watched } : { ...ep, watched: false })

        episodes.reverse()

        const nextEpisode = (episodes.findIndex(ep => ep.watched) - 1) > -2 ? episodes[episodes.findIndex(ep => ep.watched) - 1] : episodes[episodes.length - 1]
        return nextEpisode
    }, [show, watchtime])

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

    const [nextEpisode, setNextEpisode] = useState(getNextEpisode())

    useEffect(() => {
        if (nextEpisode && getNextEpisode())
            nextEpisode.id !== getNextEpisode().id && setNextEpisode(getNextEpisode())
        else
            setNextEpisode(getNextEpisode())

    }, [show.watch_progress, getNextEpisode, nextEpisode])

    return (
        <>
            <tr
                className={`flex gap-2 h-16 text-xl hoverable-tablerow ${odd && 'bg-pink-100'} hover:bg-pink-300`}
            >
                <td className='p-2 w-1/2 text-left flex items-center'>
                    {!editMode ? <div
                        className={`h-12 w-8 flex-none bg-cover bg-no-repeat rounded text-center overflow-hidden bg-pink-500 flex items-center progress-image`}
                        style={{ backgroundImage: show.tv_info.poster_path && `url('https://image.tmdb.org/t/p/w200${show.tv_info.poster_path}')` }}
                    >
                        <button onClick={() => setExpanded(!expanded)}
                            className='w-full modal-btn text-lg text-white p-1 focus:outline-none'>
                            {expanded ? <DoubleUp /> : <DoubleDown />}
                        </button>
                    </div> :
                        <ToggleButton
                            toggled={editSelection.some(sel => sel.tv_id === show.tv_id)}
                            onClick={() => { handleEditSelect(show) }}
                        />
                    }
                    <Link to={`/show/${show.tv_info.id}`} className='ml-6'>{show.tv_info.name}</Link>
                </td>
                <td className='flex w-1/6 justify-center items-center '>{ordinal(show.watch_progress.length)}</td>
                <td className='justify-center w-1/6  items-center flex'>
                    {myProfile ?
                        <input
                            id={`${show.id}-score`}
                            className='w-full h-full bg-transparent focus:outline-none appearance-none text-center'
                            type='text'
                            value={scoreField || ''}
                            onBlur={handleScore}
                            onChange={(e) => { setScoreField(getScore(+e.target.value.replace(/[^0-9]/g, ''))) }}
                        /> : scoreField}
                </td>
                <td className='flex w-1/6 justify-center items-center'>
                    {(myProfile && nextEpisode) ?
                        <button
                            onClick={handleWatchNext}
                            className='px-2 py-1 bg-indigo-500 text-white font-semibold rounded text-base hover:bg-indigo-600 flex justify-center items-center'
                        >
                            {nextEpisode && `S${nextEpisode.season_number} E${nextEpisode.episode_number}`}
                        </button> :
                        nextEpisode && `S${nextEpisode.season_number} E${nextEpisode.episode_number}`
                    }
                </td>
            </tr>
            {
                expanded &&
                <ExpandedTable nextEpisode={nextEpisode} show={show} odd={odd} watchtime={watchtime} setWatchtime={setWatchtime} />
            }
        </>
    )
}

const ShowProgressTable = ({ tvlist, name }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)

    const [editMode, setEditMode] = useState(false)
    const [editSelection, setEditSelection] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const showsPerPage = 10

    const [sortBy, setsortBy] = useState({ type: 'title', asc: true })
    const [sortedList, setSortedList] = useState([])

    useEffect(() => {
        let tvlistCopy = [...tvlist]
        if (sortBy.type === 'title') {
            tvlistCopy.sort((a, b) => {
                if (a.tv_info.name.toLowerCase() < b.tv_info.name.toLowerCase())
                    return sortBy.asc ? -1 : 1
                if (a.tv_info.name.toLowerCase() > b.tv_info.name.toLowerCase())
                    return sortBy.asc ? 1 : -1
                return 0
            })
        } else if (sortBy.type === 'score') {
            tvlistCopy.sort((a, b) => {
                if (!a.score && !b.score)
                    return 0
                if (!a.score)
                    return 1
                if (!b.score)
                    return -1
                return sortBy.asc ? a.score - b.score : b.score - a.score
            })
        } else if (sortBy.type === 'watchtime') {
            tvlistCopy.sort((a, b) => {
                return sortBy.asc ? a.watch_progress.length - b.watch_progress.length : b.watch_progress.length - a.watch_progress.length
            })
        }
        setSortedList(tvlistCopy)
    }, [tvlist, sortBy])

    const handleSortChange = (type) => {
        if (type === 'title') {
            if (sortBy.type === 'title')
                setsortBy({ type, asc: !sortBy.asc })
            else
                setsortBy({ type, asc: true })
        } else if (type === 'watchtime') {
            if (sortBy.type === 'watchtime')
                setsortBy({ type, asc: !sortBy.asc })
            else
                setsortBy({ type, asc: false })
        } else if (type === 'score') {
            if (sortBy.type === 'score')
                setsortBy({ type, asc: !sortBy.asc })
            else
                setsortBy({ type, asc: false })
        }

    }

    const handleEditSelect = (show) => {
        const found = editSelection.some(sel => sel.tv_id === show.tv_id)
        if (!found) {
            setEditSelection([
                ...editSelection,
                show
            ])
        } else {
            setEditSelection(editSelection.filter(sel => sel.tv_id !== show.tv_id))
        }

    }

    const handleEditModeComplete = (complete) => {
        let tvlistCopy = [...profile.tvlist]
        for (const show of editSelection) {
            for (const season of show.tv_info.seasons) {
                for (const episode of season.episodes) {
                    const showCopy = saveEpisode(show, episode, complete)
                    tvlistCopy = tvlistCopy.map(list => list.tv_id === showCopy.tv_id ? showCopy : list)
                }
            }
        }
        setProfile({
            ...profile,
            tvlist: tvlistCopy
        })
        setEditSelection([])
        setEditMode(false)
    }

    const handleEditModeWatching = async () => {
        let tvlistCopy = [...profile.tvlist]
        for (const show of editSelection) {
            const data = await tvlistService.saveWatching(!show.watching, show.tv_id)
            let showCopy = { ...show }
            showCopy.watching = data.watching
            tvlistCopy = tvlistCopy.map(list => list.tv_id === showCopy.tv_id ? showCopy : list)
        }
        setProfile({
            ...profile,
            tvlist: tvlistCopy
        })
        setEditSelection([])
        setEditMode(false)
    }

    const saveEpisode = (show, episode, watched) => {
        const watchtime = show.watch_progress.length - 1
        const episodeObj = {
            tvprogress_id: show.watch_progress[watchtime].id,
            episode_id: episode.id,
            watched,
        }
        tvlistService.saveEpisode(episodeObj)


        let showCopy = { ...show }
        if (showCopy.watch_progress[watchtime].episodes.some(ep => ep.episode_id === episode.id))
            showCopy.watch_progress[watchtime].episodes = showCopy.watch_progress[watchtime].episodes.map(ep => ep.episode_id === episode.id ? episodeObj : ep)
        else {
            showCopy.watch_progress[watchtime].episodes.push(episodeObj)
        }
        return showCopy
    }

    const sliceListWithoutEditMode = (tvlist) => {
        if (!editMode)
            return tvlist.slice((currentPage - 1) * showsPerPage, currentPage * showsPerPage)
        else
            return tvlist
    }

    // if the pagination page count is reduced by shows moving to other lists, make sure the user is not left on an empty page
    useEffect(() => {
        if (currentPage > Math.floor(tvlist.length / showsPerPage) + (tvlist.length % showsPerPage !== 0 && + 1))
            setCurrentPage(Math.max(Math.floor(tvlist.length / showsPerPage) + (tvlist.length % showsPerPage !== 0 && + 1), 1))
    }, [tvlist, currentPage])

    if (tvlist.length > 0)
        return (
            <>
                <div className='overflow-x-auto'>
                    <div className='my-1'>
                        <h2 className='text-gray-600 text-xl mr-4' id={name}>{name} ({tvlist.length} show{tvlist.length > 1 && 's'})</h2>
                        {myProfile && <div className='flex gap-4'>
                            <span className='flex gap-2'>
                                <ToggleButton
                                    toggled={editMode}
                                    onClick={() => { setEditMode(!editMode) }}
                                />
                                <span className='flex items-center'>EditMode</span>
                            </span>
                            <div className={`flex gap-2 max-w-0 overflow-hidden transition-all duration-200 delay-100 ${editMode && 'max-w-full'}`}>
                                <Button className='px-2 py-1' value='Complete' onClick={() => { handleEditModeComplete(true) }} />
                                <Button className='px-2 py-1' value='Reset' onClick={() => { handleEditModeComplete(false) }} />
                                <Button className='px-2 py-1' value='Pause/Unpause' onClick={handleEditModeWatching} />
                            </div>
                        </div>}
                    </div>
                    <table className='w-full'
                        style={{ minWidth: '500px' }}>
                        <thead className='bg-pink-400 text-white text-xl'>
                            <tr
                                className='flex gap-2 py-2'
                            >
                                <th
                                    className={`flex w-1/2 gap-2 cursor-pointer items-center justify-center sortable ${sortBy.type === 'title' && 'sortedby'}`}
                                    onClick={() => { handleSortChange('title') }}
                                >
                                    Title
                                    {(sortBy.type === 'title' && !sortBy.asc) ? <SortDesc className='w-5 h-5' /> : <SortAsc className='w-5 h-5' />}
                                </th>
                                <th
                                    className={`flex gap-2 w-1/6 cursor-pointer items-center justify-center sortable ${sortBy.type === 'watchtime' && 'sortedby'}`}
                                    onClick={() => { handleSortChange('watchtime') }}
                                >
                                    Viewing
                                    {(sortBy.type === 'watchtime' && sortBy.asc) ? <SortAsc className='w-5 h-5' /> : <SortDesc className='w-5 h-5' />}
                                </th>
                                <th
                                    className={`flex gap-2 w-1/6 cursor-pointer items-center justify-center sortable ${sortBy.type === 'score' && 'sortedby'}`}
                                    onClick={() => { handleSortChange('score') }}
                                >
                                    {myProfile && <span><EditIcon className='h-6' /></span>}
                                    Score
                                    {(sortBy.type === 'score' && sortBy.asc) ? <SortAsc className='w-5 h-5' /> : <SortDesc className='w-5 h-5' />}
                                </th>
                                <th className='flex w-1/6 items-center justify-center' title='Next Episode'><DoubleRight className='h-7' /></th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 bg-pink-150'>
                            {sliceListWithoutEditMode(sortedList).map((show, index) =>
                                <TableRow editMode={editMode} handleEditSelect={handleEditSelect} editSelection={editSelection} key={show.tv_info.id.toString()} odd={index % 2 === 0} show={show} />
                            )}
                        </tbody>
                    </table>
                </div>
                {((tvlist.length / showsPerPage) > 1 && !editMode) &&
                    <Pagination className='mt-2' currentPage={currentPage} totalPages={Math.floor(tvlist.length / showsPerPage) + (tvlist.length % showsPerPage !== 0 && + 1)} onClick={(page) => e => setCurrentPage(page)} />
                }
            </>
        )
    else
        return (
            <>
            </>
        )
}

export default ShowProgressTable