import React from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

// project components
import PieChart from '../../../../components/Charts/PieChart'

const MovieOriginCountryChart = () => {
    const { profile } = useProfile()
    let data = []
    let no_data = { name: 'No data', value: 0 }
    profile.movielist.forEach(movie => {
        let found = false
        if (movie.info.production_companies && movie.info.production_companies.length >= 1 && movie.info.production_companies[0].origin_country) {

            for (let i = 0; i < data.length; i++) {
                if (data[i].name === movie.info.production_companies[0].origin_country) {
                    found = true
                    data[i].value += 1
                    break;
                }
            }
        }

        if (!found) {
            if (movie.info.production_companies && movie.info.production_companies.length >= 1 && movie.info.production_companies[0].origin_country) {
                data.push({ name: movie.info.production_companies[0].origin_country, value: 1 })
            }
            else
                no_data.value += 1
        }
    })

    data.push(no_data)
    return (
        <div className='relative h-64'>
            <PieChart data={data} colors={['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']} />
        </div>
    )
}

export default MovieOriginCountryChart