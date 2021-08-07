import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'

// project components
import Spinner from '../../components/Spinner'
import Button from '../../components/Button'
import movieService from '../../services/movieService'
import Select from '../../components/Select'
import Cast from '../ShowPage/Cast'
import Reviews from '../ShowPage/Reviews'
import ReviewForm from '../../components/ReviewForm'

// icons
import Star from '../../components/icons/Star'


// project hooks
import { useAuth } from '../../context/auth'

const MoviePage = () => {
    const { id } = useParams()
    const [movie, setMovie] = useState(undefined)
    const { authTokens } = useAuth()
    const [country, setCountry] = useState(undefined)
    const [countryList, setCountryList] = useState(undefined)
    const decodedToken = authTokens ? JSON.parse(window.atob(authTokens.token.split('.')[1])) : undefined

    useEffect(() => {
        movieService.getMoviePage(id)
            .then(data => {
                Object.entries(data.providers).forEach(([key, value]) => {
                    if (!value.flatrate)
                        delete data.providers[key]
                })
                Object.keys(data.providers).length > 0 && setCountry(Object.keys(data.providers).find(key => key === 'FI') ? 'FI' : Object.keys(data.providers)[0])
                let country_list = []
                Object.entries(data.providers).forEach(([code, obj]) => {
                    country_list.push({ name: obj.name, value: code })
                })
                setCountryList(country_list)
                setMovie(data)
            })
    }, [id])

    const addToList = async () => {
        movieService.addToList({ id: movie.id, title: movie.title })
            .then(data => {
                setMovie({
                    ...movie,
                    listed: !movie.listed
                })
            })
    }

    const runtimeInHoursAndMinutes = (runtimeInMinutes) => {
        const hours = Math.floor(runtimeInMinutes / 60)
        const minutes = runtimeInMinutes % 60
        return `${hours === 1 ? `1 hour` : `${hours} hours`} ${minutes === 1 ? `1 minute` : `${minutes} minutes`}`
    }

    return (
        <div className='w-full md:w-2/3 mx-auto mt-3'>
            <Spinner className='mx-auto' color='bg-pink-500' show={!movie} />
            {movie &&
                <>
                    <div
                        className='md:flex justify-center my-4'
                    >
                        <img
                            alt='Show poster'
                            className='w-full max-w-sm md:w-2/5 mx-auto shadow-lg rounded-lg object-cover'
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        />
                        <div className='md:ml-6 w-full md:w-3/5'>

                            <h1 className='text-gray-800 text-2xl font-bold my-2'>
                                {movie.title} <span className='text-gray-600'>({movie.original_language})</span>
                            </h1>

                            <p className='text-gray-600 font-semibold'>
                                {runtimeInHoursAndMinutes(movie.runtime)}
                                &nbsp;({new Date(movie.release_date).getFullYear()})
                            </p>

                            <p className='text-gray-600'>
                                {movie.genres.map(genre => genre.name).join(', ')}
                            </p>

                            {authTokens &&
                                <Button
                                    onClick={addToList}
                                    className='px-3 py-2 my-2'
                                    value={movie.listed ? 'Unlist' : 'Add to list'}
                                    icon={<Star filled={movie.listed} className='h-4 w-4 inline' />}
                                />
                            }

                            <h2 className='text-gray-700 text-xl mt-6 font-semibold'>
                                Overview
                            </h2>
                            <p className='text-gray-600'>
                                {movie.overview}
                            </p>

                            {
                                Object.keys(movie.providers).length > 0 &&
                                <>
                                    <h2 className='text-gray-700 text-xl mt-6 mb-1 font-semibold'>
                                        Stream Now
                                    </h2>
                                    <Select
                                        className='max-w-xs'
                                        label='Country'
                                        value={country}
                                        options={countryList}
                                        onChange={(e) => setCountry(e.target.value)}
                                    />
                                    <div className='flex flex-row gap-4 mt-4'>
                                        {movie.providers[country] ? movie.providers[country].flatrate.map(provider =>
                                            <a
                                                className='w-auto'
                                                key={provider.provider_id}
                                                href={movie.providers[country].link}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <img
                                                    className='h-20 rounded-md shadow-lg'
                                                    src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                                                    alt={`${provider.provider_name} streaming service`}
                                                    title={provider.provider_name}
                                                />
                                            </a>
                                        ) : <p className='text-gray-500'>No country selected</p>
                                        }
                                    </div>
                                    <span className='text-gray-600'>Streaming data provided by JustWatch.</span>
                                </>
                            }
                        </div>
                    </div>

                    <Cast cast={movie.credits.cast} />

                    {decodedToken && <ReviewForm title={movie.title} movie_id={movie.id} review={movie.reviews.find(review => review.user.id === decodedToken.id)} />}
                    <Reviews tv_id={movie.id} title={movie.title} data={movie.reviews} />
                </>
            }
        </div>
    )
}

export default MoviePage