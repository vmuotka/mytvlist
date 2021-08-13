import React from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

import BarChart from '../../../../components/Charts/BarChart'

const MovieReleaseYearChart = () => {
    const { profile } = useProfile()
    let data = []
    profile.movielist.forEach(movie => {
        let found = false
        for (let i = 0; i < data.length; i++) {
            if (+data[i].name === +movie.info.release_date.split('-')[0]) {
                data[i].value++
                found = true
                break
            }
        }
        if (!found)
            data.push({ name: movie.info.release_date.split('-')[0], value: 1 })
    })
    data.sort((a, b) => {
        return +a.name - +b.name
    })
    return (
        <div classx='relative' style={{ height: '20rem' }}>
            <BarChart data={data} label='Releases' />
        </div>
    )
}

export default MovieReleaseYearChart