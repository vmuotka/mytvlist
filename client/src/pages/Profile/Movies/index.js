import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../context/profile'
import MovieProgressTable from './MovieProgressTable'

const Movies = () => {
    const { profile, setProfile } = useProfile()
    const [movielist, setMovielist] = useState([])
    useEffect(() => {
        if (profile.movielist) {
            let list = [...profile.movielist]
            setMovielist(list)
        }
    }, [setMovielist, profile.movielist])
    return (
        <>
            <MovieProgressTable movielist={movielist} />
        </>
    )
}

export default Movies