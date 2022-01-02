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

const ShowStatusChart = () => {
    const { profile } = useProfile()
    const [status, setStatus] = useState(null)
    useEffect(() => {
        if (profile.tvlist) {
            let returning = { name: 'Ongoing', value: 0 }
            let ended = { name: 'Ended', value: 0 }
            let canceled = { name: 'Canceled', value: 0 }
            profile.tvlist.forEach((show) => {
                switch (show.tv_info.status) {
                    case 'Returning Series':
                        returning.value += 1
                        break;
                    case 'Ended':
                        ended.value += 1
                        break;
                    case 'Canceled':
                        canceled.value += 1
                        break;
                    default: break;
                }
            })
            setStatus({
                labels: ['Ongoing', 'Ended', 'Cancelled'],
                datasets: [
                    {
                        data: [
                            returning.value,
                            ended.value,
                            canceled.value
                        ],
                        backgroundColor: ['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']
                    }
                ]
            })
        }
    }, [profile])
    return (
        <div className='relative h-64'>
            {status && <Pie data={status} options={options} />}
        </div>
    )
}

export default ShowStatusChart