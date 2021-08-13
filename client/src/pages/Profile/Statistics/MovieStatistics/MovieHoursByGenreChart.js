import React from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

// project components
import BarChart from '../../../../components/Charts/BarChart'

const MovieHoursByGenreChart = () => {
    const { profile } = useProfile()
    let genres = []
    profile.movielist.forEach((movie) => {
        if (movie.watch_times.length >= 1) {
            let minutes = 0
            movie.watch_times.forEach(watch => {
                minutes += movie.info.runtime
            })
            for (let i = 0; i < movie.info.genres.length; i++) {
                let genreFound = false
                for (let j = 0; j < genres.length; j++) {
                    if (genres[j].id === movie.info.genres[i].id) {
                        genres[j].value += minutes
                        genreFound = true
                    }
                }
                if (!genreFound) {
                    genres.push(
                        {
                            name: movie.info.genres[i].name,
                            id: movie.info.genres[i].id,
                            value: minutes
                        })
                }
            }
        }
    })

    for (let i = 0; i < genres.length; i++) {
        genres[i].value = Math.floor(genres[i].value / 60 * 10) / 10
    }
    genres.sort((a, b) => {
        if (a.name < b.name)
            return -1
        if (a.name > b.name)
            return 1
        return 0
    })


    const data = genres

    return (
        <div className='relative' style={{ height: '20rem' }}>
            <BarChart data={data} label='Hours' />
        </div>
    )
}

export default MovieHoursByGenreChart