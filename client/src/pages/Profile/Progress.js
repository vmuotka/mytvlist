import React, { useState } from 'react'

// project components
import Movies from './Movies/'
import Shows from './Shows/'
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
            {tab === 'tv' && <Shows />}
            {tab === 'movies' && <Movies />}
        </>
    )
}

export default Progress