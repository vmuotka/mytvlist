import React from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

// project components
import PieChart from '../../../../components/Charts/PieChart'

const MoviesByGenreChart = () => {
    const { profile } = useProfile()
    let genres = []
    profile.movielist.forEach(movie => {
        for (let i = 0; i < movie.info.genres.length; i++) {
            let genreFound = false
            for (let j = 0; j < genres.length; j++) {
                if (genres[j].id === movie.info.genres[i].id) {
                    genres[j].value += 1
                    genreFound = true
                }
            }
            if (!genreFound) {
                genres.push(
                    {
                        name: movie.info.genres[i].name,
                        id: movie.info.genres[i].id,
                        value: 1
                    })
            }
        }
    })
    genres.sort((a, b) => {
        if (a.value > b.value)
            return -1
        if (a.value < b.value)
            return 1
        return 0
    })

    const data = genres

    return (
        <div className='relative' style={{ height: '20rem' }}>
            <PieChart data={data} />
        </div>
    )
}

export default MoviesByGenreChart