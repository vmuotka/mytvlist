import React from 'react'

// project components
import { useProfile } from '../../../../context/profile'
import BasicStatisticsBar from './BasicStatisticsBar'
import MovieCompletionPercentageChart from './MovieCompletionPercentageChart'
import MovieOriginCountryChart from './MovieOriginCountryChart'
import MoviesByGenreChart from './MoviesByGenreChart'
import MovieReleaseYearChart from './MovieReleaseYearChart'
import MovieHoursByGenreChart from './MovieHoursByGenreChart'

const MovieStatistics = () => {
    const { profile } = useProfile()
    return (
        <>
            {(profile.movielist && profile.movielist.length > 0) ?
                <>
                    <BasicStatisticsBar />
                    <div className='w-full md:w-4/5 mx-auto mt-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 md:mx-2'>
                            <div>
                                <p className='text-gray-700 text-lg text-center'>Movies watched</p>
                                <MovieCompletionPercentageChart />
                            </div>
                            <div>
                                <p className='text-gray-700 text-lg text-center'>Origin Country</p>
                                <MovieOriginCountryChart />
                            </div>
                            <div className='md:col-span-2'>
                                <p className='text-gray-700 text-lg text-center'>Movies per Genre</p>
                                <MoviesByGenreChart />
                            </div>
                            <div className='md:col-span-2'>
                                <p className='text-gray-700 text-lg text-center'>Hours per Genre</p>
                                <MovieHoursByGenreChart />
                            </div>
                            <div className='md:col-span-2'>
                                <p className='text-gray-700 text-lg text-center'>Release Year</p>
                                <MovieReleaseYearChart />
                            </div>
                        </div>

                    </div>
                </>
                : <span className='text-lg text-gray-700 text-center'>This user has no movies on their list.</span>}
        </>
    )
}

export default MovieStatistics