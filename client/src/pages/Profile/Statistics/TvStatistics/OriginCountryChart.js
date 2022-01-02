import React, { useState, useEffect } from 'react'
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

const OriginCountryChart = () => {
    const { profile } = useProfile()
    const [data, setData] = useState(null)
    useEffect(() => {
        if (profile.tvlist) {
            let arr = []
            profile.tvlist.forEach((show) => {
                let found = false
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].name === (show.tv_info.origin_country[0] ? show.tv_info.origin_country[0] : 'No data')) {
                        found = true
                        arr[i].value += 1
                        break;
                    }
                }
                if (!found) {
                    arr.push({ name: show.tv_info.origin_country[0] ? show.tv_info.origin_country[0] : 'No data', value: 1 })
                }
            })
            setData({
                labels: arr.map(country => country.name),
                datasets: [
                    {
                        data: arr.map(country => country.value),
                        backgroundColor: ['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']
                    }
                ]
            })
        }
    }, [profile])
    console.log(data)
    return (
        <div className='relative h-64'>
            {data && <Pie data={data} options={options} />}
        </div>
    )
}

export default OriginCountryChart