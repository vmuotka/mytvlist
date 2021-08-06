import React from 'react'
import { Link } from 'react-router-dom'

// project components
import InputField from '../../../components/InputField'
import movieService from '../../../services/movieService'
import { useProfile } from '../../../context/profile'
import userService from '../../../services/userService'

const TableRow = ({ movie, odd }) => {
    const { profile, setProfile } = useProfile()
    const myProfile = userService.checkProfileOwnership(profile.id)
    const handleScore = async (e) => {
        const score = e.target.value
        const data = {
            score,
            movie_id: movie.info.id
        }
        movieService.updateScore(data)
            .then(data => {
                console.log(data)
                let movielist = [...profile.movielist]
                movielist = movielist.map(item => item.movie_id !== data.movie_id ? item : { ...item, score: data.score })
                setProfile({
                    ...profile,
                    movielist
                })
            })
    }
    return (
        <tr
            className={`grid text-sm sm:text-lg md:text-xl ${odd && 'bg-pink-100'}`}
            style={{
                gridTemplateColumns: myProfile ? '3fr 1fr 1fr 1fr' : '3fr 1fr 1fr'
            }}
        >
            <td className='p-2 text-left flex items-center'>
                <div
                    className={`h-8 w-6 sm:h-12 sm:w-8 flex-none bg-cover bg-no-repeat rounded text-center overflow-hidden bg-pink-500 flex items-center}`}
                    style={{ backgroundImage: movie.info.poster_path && `url('https://image.tmdb.org/t/p/w200${movie.info.poster_path}')` }}
                />
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
                        className='text-center w-16 py-1'
                        value={movie.score > 0 ? movie.score : undefined} /> :
                    movie.score && movie.score
                }

            </td>
            {myProfile &&
                <td className='flex justify-center items-center'>
                    <button className='px-2 py-1 bg-pink-500 text-white font-semibold rounded text-base hover:bg-pink-400'>Watch</button>
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