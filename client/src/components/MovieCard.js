import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

// icons
import Star from './icons/Star'

// project components
import Button from './Button'

// project hooks
import { useNotification } from '../context/notification'

// project services
import movieService from '../services/movieService'

const MovieCard = ({ movie, className }) => {
    const info = movie.info
    const { setNotifications } = useNotification()
    let genres = []
    for (let i = 0; i < info.genres.length; i++)
        genres.push(info.genres[i].name)

    const [fullDesc, setFullDesc] = useState(false)

    const [listed, setListed] = useState(movie.listed)
    const user = useSelector((state) => state.user)

    // some movies return empty number of episodes when no episodes are published
    if (info.number_of_episodes === null || info.number_of_episodes === undefined)
        info.number_of_episodes = 0

    // toggle between full and shorter description
    const handleDescBtn = () => {
        setFullDesc(!fullDesc)
    }

    // handle adding movie to users movielist
    const addToList = async () => {
        try {
            await movieService.addToList({ id: info.id, title: info.title })
            setListed(!listed)
        } catch (err) {
            setNotifications([{ title: 'Listing failed', message: 'There was an error while processing request', type: 'error' }])
        }
    }

    const runtimeInHoursAndMinutes = (runtimeInMinutes) => {
        const hours = Math.floor(runtimeInMinutes / 60)
        const minutes = runtimeInMinutes % 60
        return `${hours === 1 ? `1 hour` : `${hours} hours`} ${minutes === 1 ? `1 minute` : `${minutes} minutes`}`
    }

    const description = info.overview ? ((!fullDesc && info.overview.length > 150) ? info.overview.slice(0, 150) + '...' : info.overview) : 'No description available'

    return (
        <div className={`w-full md:flex ${className}`}>
            <div
                className={'h-48 md:h-auto md:w-48 flex-none bg-cover bg-no-repeat rounded-t md:rounded-t-none md:rounded-l text-center overflow-hidden bg-pink-500'}
                style={{ backgroundImage: info.poster_path && `url('https://image.tmdb.org/t/p/w400${info.poster_path}')` }}
                title={`${info.name} poster`}
            >
            </div>
            <div className="w-full border-r border-b border-l border-pink-400 md:border-l-0 md:border-t md:border-pink-400 bg-white rounded-b md:rounded-b-none md:rounded-r p-4 flex flex-col justify-between leading-normal">
                <div className="mb-8">
                    <div className="text-gray-900 font-bold text-xl mb-0">
                        <span className='break-word'>
                            {user &&
                                <Button onClick={addToList} className='text-sm float-right ml-px' value={listed ? 'Unlist' : 'Add to list'} style={{ padding: '0.35rem 0.5rem' }} icon={<Star filled={listed} className='h-4 w-4 inline' />}
                                />}
                            <Link to={`/movie/${info.id}`} >{info.title}&nbsp;
                                <span className='text-gray-500'>({info.original_language})</span>
                            </Link>
                        </span>
                    </div>
                    <p className='mb-2 text-gray-600 font-semibold'>
                        {runtimeInHoursAndMinutes(info.runtime)}
                        &nbsp;({new Date(info.release_date).getFullYear()})
                    </p>
                    <p className="text-gray-700 text-xs">
                        {description}
                    </p>

                    {info.overview.length > 150 && <button className='border border-pink-400 hover:bg-pink-400 hover:border-0 rounded text-xs text-pink-500 hover:text-white px-2 py-1 mt-2' onClick={handleDescBtn}>{fullDesc ? 'Show less' : 'Show all'}</button>}
                </div>
                <div className="flex items-center">
                    <div className="text-sm">
                        {(movie.score && movie.score > 0) ? <p className='text-gray-700'>User's score: {movie.score}</p> : null}
                        <p className="text-gray-600">{genres.join(', ')}</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MovieCard