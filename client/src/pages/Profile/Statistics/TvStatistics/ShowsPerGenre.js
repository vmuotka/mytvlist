import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../../context/profile'

// project components
import PieChart from '../../../../components/Charts/PieChart'

const ShowsPerGenre = () => {
    const { profile } = useProfile()
    const [data, setData] = useState([])
    useEffect(() => {
        if (profile.tvlist) {
            let genres = []
            profile.tvlist.forEach((show) => {
                for (let i = 0; i < show.tv_info.genres.length; i++) {
                    let genreFound = false
                    for (let j = 0; j < genres.length; j++) {
                        if (genres[j].id === show.tv_info.genres[i].id) {
                            genres[j].value += 1
                            genreFound = true
                        }
                    }
                    if (!genreFound) {
                        genres.push(
                            {
                                name: show.tv_info.genres[i].name,
                                id: show.tv_info.genres[i].id,
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
            setData(genres)
        }
    }, [profile])
    return (
        <div className='relative' style={{ height: '20rem' }}>
            <PieChart data={data} />
        </div>
    )
}

export default ShowsPerGenre