import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from 'date-fns/esm/locale'

// project components
import InputField from '../../../components/InputField'
import movieService from '../../../services/movieService'
import { useProfile } from '../../../context/profile'
import userService from '../../../services/userService'
import DoubleUp from '../../../components/icons/DoubleUp'
import DoubleDown from '../../../components/icons/DoubleDown'
import DeleteIcon from '../../../components/icons/DeleteIcon'
import EditIcon from '../../../components/icons/EditIcon';

import '../ProgressTableRow.css'

registerLocale('enGB', enGB)

const TableRow = ({ movie, odd }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)
    const [expanded, setExpanded] = useState(false)

    const handleScore = async (e) => {
        const score = e.target.value
        const data = {
            score,
            movie_id: movie.info.id
        }
        movieService.updateScore(data)
            .then(data => {
                let movielist = [...profile.movielist]
                movielist = movielist.map(item => item.movie_id !== data.movie_id ? item : { ...item, score: data.score })
                setProfile({
                    ...profile,
                    movielist
                })
            })
    }

    const handleWatchBtn = () => {
        const timestamp = new Date()
        const data = {
            timestamp,
            movie_id: movie.info.id,
        }

        movieService.saveWatchTime(data)
            .then(data => {
                let movielist = [...profile.movielist]
                movielist = movielist.map(item => item.movie_id !== data.movie_id ? item : { ...item, watch_times: data.watch_times })
                setProfile({
                    ...profile,
                    movielist
                })
            })
    }
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
                        className={`h-8 w-6 sm:h-12 sm:w-8 flex-none bg-cover bg-no-repeat rounded text-center overflow-hidden bg-pink-500 flex items-center ${movie.watch_times.length > 0 && 'progress-image'}`}
                        style={{ backgroundImage: movie.info.poster_path && `url('https://image.tmdb.org/t/p/w200${movie.info.poster_path}')` }}
                    >
                        {
                            movie.watch_times.length > 0 &&
                            <button onClick={() => setExpanded(!expanded)}
                                className='w-full modal-btn text-lg text-white p-1 focus:outline-none'>
                                {expanded ? <DoubleUp /> : <DoubleDown />}
                            </button>
                        }
                    </div>
                    <Link to={`/movie/${movie.info.id}`} className='ml-6'>{movie.info.title}</Link>
                </td>
                <td className='flex justify-center items-center'>{movie.watch_times.length}</td>
                <td className='flex justify-center items-center'>
                    {myProfile ?
                        <InputField
                            onChange={handleScore}
                            type='number'
                            name='score'
                            size={3}
                            className='text-center py-1'
                            value={movie.score > 0 ? movie.score : undefined} /> :
                        movie.score && movie.score
                    }

                </td>
                {myProfile &&
                    <td className='flex justify-center items-center'>
                        <button
                            onClick={handleWatchBtn}
                            className='px-2 py-1 bg-pink-500 text-white font-semibold rounded text-base hover:bg-pink-400'
                        >
                            Watch
                        </button>
                    </td>
                }
            </tr>
            {
                expanded && movie.watch_times.map(watchtime =>
                    <ExpandedTableRow key={watchtime._id} watchtime={watchtime} movie={movie} odd={odd} />
                )
            }
        </>
    )
}

const ExpandedTableRow = ({ watchtime, movie, odd }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)

    const handleDelete = () => {
        movieService.deleteWatchTime({ id: watchtime._id, movie_id: movie.info.id })
            .then(data => {
                let movielist = [...profile.movielist]
                movielist = movielist.map(item => item.movie_id !== data.movie_id ? item : { ...item, watch_times: data.watch_times })
                setProfile({
                    ...profile,
                    movielist
                })
            })
    }

    const handleDateChange = (date) => {
        const timestamp = date
        const data = {
            timestamp,
            movie_id: movie.info.id,
            id: watchtime._id
        }

        movieService.saveWatchTime(data)
            .then(data => {
                let movielist = [...profile.movielist]
                movielist = movielist.map(item => item.movie_id !== data.movie_id ? item : { ...item, watch_times: data.watch_times })
                setProfile({
                    ...profile,
                    movielist
                })
            })
    }
    return (
        <tr
            className={`grid text-sm sm:text-lg md:text-xl ${odd && 'bg-pink-100'} hover:bg-pink-300`}
            style={{
                gridTemplateColumns: myProfile ? '5fr 1fr' : '6fr'
            }}
        >
            <td className='p-2 text-left flex items-center'>
                {myProfile ?
                    <>
                        <EditIcon className='h-6' />
                        <DatePicker
                            onChange={handleDateChange}
                            className='ml-6 bg-transparent focus:outline-none cursor-pointer w-min'
                            selected={new Date(watchtime.date)}
                            locale='enGB'
                        />
                    </> :
                    new Date(watchtime.date).toLocaleDateString('en-GB')
                }
            </td>
            {myProfile &&
                <td className='flex justify-center items-center'>
                    <button
                        onClick={handleDelete}
                        title='Delete'>
                        <DeleteIcon className='h-6 text-gray-700' />
                    </button>
                </td>
            }
        </tr>
    )
}

const MovieProgressTable = ({ movielist }) => {
    const { profile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)
    return (
        <table className='w-full'>
            <thead className='bg-pink-400 text-white md:text-xl'>
                <tr
                    className='grid  py-2'
                    style={{
                        gridTemplateColumns: myProfile ? '3fr 1fr 1fr 1fr' : '3fr 1fr 1fr'
                    }}
                >
                    <th>Title</th>
                    <th>Times watched</th>
                    <th>Score</th>
                    {myProfile && <th>Action</th>}
                </tr>
            </thead>
            <tbody className='text-gray-700 bg-pink-150'>
                {movielist.map((movie, index) =>
                    <TableRow key={movie.info.id} odd={index % 2 === 0} movie={movie} />
                )}
            </tbody>
        </table>
    )
}

export default MovieProgressTable