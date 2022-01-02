import React, { useState } from 'react'

// project components
import ProgressChart from './ProgressChart'
import CompletionPercentageChart from './CompletionPercentageChart'
import HoursByGenre from './HoursByGenre'
import ShowStatusChart from './ShowStatusChart'
import OriginCountryChart from './OriginCountryChart'
import ReleaseYearChart from './ReleaseYearChart'
import ShowsPerGenre from './ShowsPerGenre'
import Basic from './Basic'
import InputField from '../../../../components/InputField'

import { useProfile } from '../../../../context/profile'

const Statistics = () => {
    const { profile } = useProfile()
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    return (
        <>
            {
                (profile.tvlist && profile.tvlist.length > 0) ?
                    <>
                        <Basic startDate={startDate} endDate={endDate} />
                        <div className='mt-2 ml-2 flex gap-6'>
                            <InputField
                                label='Start Date'
                                type='date'
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value) }}
                            />
                            <InputField
                                label='End Date'
                                type='date'
                                value={endDate}
                                onChange={(e) => { setEndDate(e.target.value) }}
                            />
                        </div>
                        <div className='w-full md:w-4/5 mx-auto mt-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 md:mx-2'>
                                <div>
                                    <p className='text-gray-700 text-lg text-center'>Progress</p>
                                    <ProgressChart />
                                </div>
                                <div>
                                    <p className='text-gray-700 text-lg text-center'>Watched Episodes</p>
                                    <CompletionPercentageChart />
                                </div>
                                <div>
                                    <p className='text-gray-700 text-lg text-center'>Show Status</p>
                                    <ShowStatusChart />
                                </div>
                                <div>
                                    <p className='text-gray-700 text-lg text-center'>Origin Country</p>
                                    <OriginCountryChart />
                                </div>
                                <div className='md:col-span-2'>
                                    <p className='text-gray-700 text-lg text-center'>Shows Per Genre</p>
                                    <p className='text-gray-500 text-center italic text-sm'>You can hide genres by clicking their labels</p>
                                    <ShowsPerGenre />
                                </div>
                                <div className='md:col-span-2'>
                                    <p className='text-gray-700 text-lg text-center' title={(startDate || endDate) && 'Filtered by given dates'}>Hours by Genre{(startDate || endDate) && '*'}</p>
                                    <HoursByGenre startDate={startDate} endDate={endDate} />
                                </div>
                            </div>
                            <div className='md:col-span-2'>
                                <p className='text-gray-700 text-lg text-center'>Years</p>
                                <ReleaseYearChart />
                            </div>
                        </div>
                    </>
                    : <p className='text-lg text-gray-700 text-center'>This user has no shows on their list.</p>}
        </>
    )
}

export default Statistics