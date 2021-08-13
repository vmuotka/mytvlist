import React, { useState } from 'react'

// project components
import TvStatistics from './TvStatistics/'
import TabButtons from '../../../components/TabButtons'
import MovieStatistics from './MovieStatistics/'

const Statistics = () => {
    const [tab, setTab] = useState('tv')
    return (
        <>
            <TabButtons
                options={['tv', 'movies']}
                value={tab}
                onChange={setTab}
            />
            {tab === 'tv' && <TvStatistics />}
            {tab === 'movies' && <MovieStatistics />}
        </>
    )
}

export default Statistics