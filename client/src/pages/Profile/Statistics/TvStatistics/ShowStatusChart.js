import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

// project components
import PieChart from '../../../../components/Charts/PieChart'

const ShowStatusChart = () => {
    const { profile } = useProfile()
    const [status, setStatus] = useState([])
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
            setStatus([
                returning,
                ended,
                canceled
            ])
        }
    }, [profile])
    return (
        <div className='relative h-64'>
            <PieChart data={status} colors={['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']} />
        </div>
    )
}

export default ShowStatusChart