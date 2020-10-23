import React, { useState } from 'react'

// icons
import Star from './icons/Star'

// project components
import Button from './Button'

// project hooks
import { useAuth } from '../context/auth'
import { useNotification } from '../context/notification'

// project services
import tvlistService from '../services/tvlistService'

const TvCard = ({ show, className }) => {
  const tv_info = show.tv_info
  const { setNotifications } = useNotification()
  let genres = []
  for (let i = 0; i < tv_info.genres.length; i++)
    genres.push(tv_info.genres[i].name)

  const [fullDesc, setFullDesc] = useState(false)

  const [listed, setListed] = useState(show.listed)
  const { authTokens } = useAuth()

  // some shows return empty number of episodes when no episodes are published
  if (tv_info.number_of_episodes === null || tv_info.number_of_episodes === undefined)
    tv_info.number_of_episodes = 0

  // toggle between full and shorter description
  const handleDescBtn = () => {
    setFullDesc(!fullDesc)
  }

  // handle adding show to users showlist
  const addToList = async () => {
    try {
      await tvlistService.addToList({ id: tv_info.id }, authTokens)
      setListed(!listed)
    } catch (err) {
      setNotifications([{ title: 'Listing failed', message: 'There was an error while processing request', type: 'error' }])
    }
  }

  const description = tv_info.overview ? ((!fullDesc && tv_info.overview.length > 150) ? tv_info.overview.slice(0, 150) + '...' : tv_info.overview) : 'No description available'
  return (
    <div className={`w-full md:flex ${className}`}>
      <div
        className={'h-48 md:h-auto md:w-48 flex-none bg-cover bg-no-repeat rounded-t md:rounded-t-none md:rounded-l text-center overflow-hidden bg-pink-500'}
        style={{ backgroundImage: tv_info.poster_path && `url('https://image.tmdb.org/t/p/w400${tv_info.poster_path}')` }}
        title={`${tv_info.name} poster`}
      >
      </div>
      <div className="w-full border-r border-b border-l border-pink-400 md:border-l-0 md:border-t md:border-pink-400 bg-white rounded-b md:rounded-b-none md:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <div className="text-gray-900 font-bold text-xl mb-0">
            <span className='break-word'>
              {authTokens &&
                <Button onClick={addToList} className='text-sm float-right ml-px' value={listed ? 'Unlist' : 'Add to list'} style={{ padding: '0.35rem 0.5rem' }} icon={<Star filled={listed} className='h-4 w-4 inline' />}
                />}
              {tv_info.name}&nbsp;
              <span className='text-gray-500'>({tv_info.original_language})</span>
            </span>
          </div>
          <p className='mb-2 text-gray-600 font-semibold'>
            {tv_info.number_of_seasons && tv_info.number_of_seasons} {tv_info.number_of_seasons > 1 ? 'seasons' : 'season'},&nbsp;
            {tv_info.number_of_episodes} {tv_info.number_of_episodes !== 1 ? 'episodes' : 'episode'}&nbsp;
            {tv_info.first_air_date && '(' + tv_info.first_air_date.split('-')[0] + ' - '}{tv_info.last_air_date && tv_info.last_air_date.split('-')[0]}{tv_info.first_air_date && ')'}
          </p>
          <p className="text-gray-700 text-xs">
            {description}
          </p>

          {tv_info.overview.length > 150 && <button className='border border-pink-400 hover:bg-pink-400 hover:border-0 rounded text-xs text-pink-500 hover:text-white px-2 py-1 mt-2' onClick={handleDescBtn}>{fullDesc ? 'Show less' : 'Show all'}</button>}
        </div>
        <div className="flex items-center">
          <div className="text-sm">
            <p className="text-gray-600">{genres.join(', ')}</p>
          </div>
        </div>
      </div>
    </div >
  )
}

export default TvCard