import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

// project hooks
import { useProfile } from '../../../../context/profile'


ChartJS.register(ArcElement, Tooltip, Legend)

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true
        },
        title: {
            display: false,
        },
    },
}

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

    const chart = {
        labels: data.map(item => item.name),
        datasets: [
            {
                data: data.map(item => item.value),
                backgroundColor: ['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']
            }
        ]
    }
    return (
        <div className='relative h-64'>
            <Pie data={chart} options={options} />
        </div>
    )
}

export default MovieOriginCountryChart