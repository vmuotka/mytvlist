import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../context/profile'
import MovieProgressTable from './MovieProgressTable'
import InputField from '../../../components/InputField'

const Movies = () => {
    const { profile } = useProfile()
    const [movielist, setMovielist] = useState([])
    const [filter, setFilter] = useState('')
    useEffect(() => {
        if (profile.movielist) {
            const list = categorizeList(profile.movielist)
            setMovielist(list)
        }
    }, [setMovielist, profile.movielist])

    useEffect(() => {
        let list = [...profile.movielist]
        console.log(list)
        list = list.filter(movie => movie.info.title.toLowerCase().includes(filter.trim().toLowerCase()))
        list = categorizeList(list)
        setMovielist(list)
    }, [filter, profile.movielist, setMovielist])

    const categorizeList = (list) => {
        let planning = { name: 'Planning', array: [] }
        let watched = { name: 'Watched', array: [] }
        list.forEach(movie => {
            if (movie.watch_times.length > 0)
                watched.array.push(movie)
            else
                planning.array.push(movie)
        })
        return [
            watched, planning
        ]
    }
    return (
        <div className='mx-4'>
            <InputField
                label='Filter'
                className='my-2'
                value={filter}
                onChange={(e) => { setFilter(e.target.value) }}
            />
            <div className='flex flex-col gap-4'>
                {
                    movielist.map(list =>
                        list.array.length > 0 &&
                        <div key={list.name}>
                            <h2 className='text-gray-600 text-lg ml-2 mb-2'>{list.name} ({list.array.length} movies)</h2>
                            <MovieProgressTable movielist={list.array} />
                        </div>

                    )
                }

            </div>
        </div>
    )
}

export default Movies