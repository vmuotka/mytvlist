import React, { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// project hooks
import { useProfile } from '../../../../context/profile'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const options = {
    responsive: true,
    spanGaps: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

const ReleaseYearChart = () => {
    const { profile } = useProfile()
    const [data, setData] = useState(null)
    useEffect(() => {
        if (profile.tvlist) {
            let started = []
            let ended = []
            profile.tvlist.forEach((show) => {
                let startedFound = false
                let endedFound = false
                for (let i = 0; i < started.length; i++) {
                    if (+started[i].x === +show.tv_info.first_air_date.split('-')[0]) {
                        started[i].y += 1
                        startedFound = true
                        break;
                    }
                }
                for (let i = 0; i < ended.length; i++) {
                    if (show.tv_info.last_air_date !== null && +ended[i].x === +show.tv_info.last_air_date.split('-')[0]) {
                        ended[i].y += 1
                        endedFound = true
                        break;
                    }
                }
                if (!startedFound) {
                    started.push({ y: 1, x: +show.tv_info.first_air_date.split('-')[0] })
                }
                if (!endedFound) {
                    if (show.tv_info.last_air_date !== null)
                        ended.push({ y: 1, x: +show.tv_info.last_air_date.split('-')[0] })
                }
            })
            started.sort((a, b) => {
                if (a.x < b.x)
                    return -1
                if (a.x > b.x)
                    return 1
                return 0
            })
            ended.sort((a, b) => {
                if (a.x < b.x)
                    return -1
                if (a.x > b.x)
                    return 1
                return 0
            })
            const range = Array(+ended[ended.length - 1].x - +started[0].x + 1).fill().map((_, idx) => +started[0].x + idx)
            for (let i = 0; i < range.length; i++) {
                let startedFound = false
                let endedFound = false
                for (let j = 0; j < started.length; j++) {
                    if (range[i] === started[j].x) {
                        startedFound = true
                        break;
                    }
                }
                for (let j = 0; j < ended.length; j++) {
                    if (range[i] === ended[j].x) {
                        endedFound = true
                        break;
                    }
                }
                if (!startedFound) {
                    started.push({ x: range[i], y: undefined })
                }
                if (!endedFound) {
                    ended.push({ x: range[i], y: undefined })
                }
            }
            started.sort((a, b) => {
                if (a.x < b.x)
                    return -1
                if (a.x > b.x)
                    return 1
                return 0
            })
            ended.sort((a, b) => {
                if (a.x < b.x)
                    return -1
                if (a.x > b.x)
                    return 1
                return 0
            })

            const datasets = [
                {
                    label: 'Release Year',
                    data: started.map(year => year.y),
                    backgroundColor: '#f687b3',
                    borderColor: '#f687b3'
                },
                {
                    label: 'Last Year',
                    data: ended.map(year => year.y),
                    backgroundColor: ' #f6ad55',
                    borderColor: ' #f6ad55'
                }
            ]
            setData(
                {
                    labels: range,
                    datasets
                }
            )
        }
    }, [profile])
    return (
        <div classx='relative' style={{ height: '20rem' }}>
            {data && <Line data={data} options={options} />}
        </div>
    )
}

export default ReleaseYearChart