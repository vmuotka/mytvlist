import React from 'react'

// project components
import ProgressChart from './ProgressChart'
import CompletionPercentageChart from './CompletionPercentageChart'
import HoursByGenre from './HoursByGenre'
import ShowStatusChart from './ShowStatusChart'
import OriginCountryChart from './OriginCountryChart'
import ReleaseYearChart from './ReleaseYearChart'

const Statistics = () => {
  return (
    <>
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
            <p className='text-gray-700 text-lg text-center'>Hours by Genre</p>
            <HoursByGenre />
          </div>
        </div>
        <div className='md:col-span-2'>
          <p className='text-gray-700 text-lg text-center'>Years</p>
          <ReleaseYearChart />
        </div>
      </div>
    </>
  )
}

export default Statistics