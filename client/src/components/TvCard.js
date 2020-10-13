import React, { useState } from 'react'

// icons
import Star from './icons/Star'

// project components
import Button from './Button'

// project hooks
import { useAuth } from '../context/auth'

// project services
import tvlistService from '../services/tvlistService'

const TvCard = ({ show, className }) => {
  let genres = []
  for (let i = 0; i < show.genres.length; i++)
    genres.push(show.genres[i].name)

  const [fullDesc, setFullDesc] = useState(false)

  const [listed, setListed] = useState(show.following)
  const { authTokens } = useAuth()

  // some shows return empty number of episodes when no episodes are published
  if (show.number_of_episodes === null || show.number_of_episodes === undefined)
    show.number_of_episodes = 0

  // toggle between full and shorter description
  const handleDescBtn = () => {
    setFullDesc(!fullDesc)
  }

  // handle adding show to users showlist
  const addToList = async () => {
    try {
      await tvlistService.addToList({ id: show.id }, authTokens)
      setListed(!listed)
    } catch (err) {
      console.error(err)
    }
  }

  const description = show.overview ? ((!fullDesc && show.overview.length > 150) ? show.overview.slice(0, 150) + '...' : show.overview) : 'No description available'
  return (
    <div className={`w-full md:flex ${className}`}>
      <div
        className={`h-48 md:h-auto md:w-48 flex-none bg-cover bg-no-repeat rounded-t md:rounded-t-none md:rounded-l text-center overflow-hidden bg-pink-500`}
        style={{ backgroundImage: show.poster_path && `url('https://image.tmdb.org/t/p/w200${show.poster_path}')` }}
        title={`${show.name} poster`}
      >
      </div>
      <div className="w-full border-r border-b border-l border-pink-400 md:border-l-0 md:border-t md:border-pink-400 bg-white rounded-b md:rounded-b-none md:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <div className="text-gray-900 font-bold text-xl mb-0">
            <span className='break-word'>
              {authTokens && <Button onClick={addToList} className='text-sm float-right' value={listed ? 'Unlist' : 'Add to list'} style={{ padding: '0.35rem 0.5rem' }} icon={<Star filled={listed} className='h-4 w-4 inline' />} />}
              {show.name}&nbsp;
              <span className='text-gray-500'>({show.original_language})</span>
            </span>
          </div>
          <p className='mb-2 text-gray-600 font-semibold'>
            {show.number_of_seasons && show.number_of_seasons} {show.number_of_seasons > 1 ? 'seasons' : 'season'},&nbsp;
            {show.number_of_episodes} {show.number_of_episodes !== 1 ? 'episodes' : 'episode'}&nbsp;
            {show.first_air_date && '(' + show.first_air_date.split('-')[0] + ' - '}{show.last_air_date && show.last_air_date.split('-')[0]}{show.first_air_date && ')'}
          </p>
          <p className="text-gray-700 text-xs">
            {description}
          </p>

          {show.overview.length > 150 && <button className='border border-pink-400 hover:bg-pink-400 hover:border-0 rounded text-xs text-pink-500 hover:text-white px-2 py-1 mt-2' onClick={handleDescBtn}>{fullDesc ? 'Show less' : 'Show all'}</button>}
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