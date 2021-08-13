import React, { useState } from 'react'

// project components
import Tv from './Tv'
import Movies from './Movies/'
import TabButtons from '../../components/TabButtons'

const Progress = () => {
    const [tab, setTab] = useState('tv')
    return (
        <>
            <TabButtons
                options={['tv', 'movies']}
                value={tab}
                onChange={setTab}
            />
            {tab === 'tv' && <Tv />}
            {tab === 'movies' && <Movies />}
        </>
    )
}

export default Progress