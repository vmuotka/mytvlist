import React, { useState } from 'react'

// project components
import Button from '../../components/Button'

const Seasons = ({ show }) => {
  const [season, setSeason] = useState(show.seasons[0])

  return (
    <div className='mt-4'>
      <h2 className='text-gray-700 text-4xl' id='seasons'>
        Seasons
      </h2>
      <div className='flex gap-1 flex-wrap'>
        {show.seasons.map((item, index) =>
          <Button
            key={item.id}
            className={`py-1 px-2 ${item.id === season.id && 'bg-pink-500'}`}
            value={item.name}
            onClick={() => setSeason(show.seasons[index])}
          />
        )}
      </div>
      <div className='mt-2 flex flex-col gap-2'>
        <h3 className='text-xl text-gray-700'>
          {season.name} ({season.episodes.length} episodes)
        </h3>
        {season.episodes ? <> {season.episodes.map(episode =>
          <div key={episode.id} className='w-full md:flex'>
            <div
              className={'h-48 md:h-auto md:w-48 flex-none bg-cover bg-no-repeat rounded-t md:rounded-t-none md:rounded-l text-center overflow-hidden bg-pink-500'}
              style={{ backgroundImage: episode.still_path && `url('https://image.tmdb.org/t/p/w400${episode.still_path}')` }}
              title={`${episode.name} poster`}
            >
            </div>
            <div className='w-full border-r border-b border-l border-pink-400 md:border-l-0 md:border-t md:border-pink-400 bg-white rounded-b md:rounded-b-none md:rounded-r p-4 flex flex-col justify-between leading-normal'>
              <h4 className='text-lg text-gray-700 font-semibold'>{episode.name}</h4>
              <span className='text-gray-500 italic text-sm'>
                {episode.air_date}
              </span>
              <p className='text-gray-600'>
                {episode.overview}
              </p>
            </div>
          </div>
        )}
          <Button
            className='px-3 py-2'
            onClick={() => document.getElementById('seasons').scrollIntoView({ block: 'start', behavior: 'smooth' })}
            value='Back to top' />
        </> :
          <span className='text-gray-600 italic'>Failed to retrieve episode data.</span>}
      </div>
    </div>
  )
}

export default Seasons