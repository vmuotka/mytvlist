import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'

// project components
import Spinner from '../components/Spinner/'
import searchService from '../services/searchService'
import Button from '../components/Button'
import tvlistService from '../services/tvlistService'

// icons
import Star from '../components/icons/Star'


// project hooks
import { useAuth } from '../context/auth'
import { useNotification } from '../context/notification'

const ShowPage = () => {
  const { id } = useParams()
  const [show, setShow] = useState(undefined)
  const { authTokens } = useAuth()
  const { setNotifications } = useNotification()

  useEffect(() => {
    searchService.showPage(id, authTokens).then(data => {
      setShow(data)
    }).catch(err => {
      console.error(err)
    })
  }, [id, authTokens])

  const addToList = async () => {
    try {
      await tvlistService.addToList({ id: show.id }, authTokens)
      setShow({
        ...show,
        listed: !show.listed
      })
    } catch (err) {
      setNotifications([{ title: 'Listing failed', message: 'There was an error while processing request', type: 'error' }])
    }
  }

  console.log(show)

  return (
    <div className='w-full md:w-2/3 mx-auto mt-3'>
      <Spinner className='mx-auto' color='bg-pink-500' show={!show} />
      {show &&
        <div className='md:flex justify-center mt-4'>
          <img
            className='w-full max-w-sm md:w-1/3 mx-auto shadow-lg rounded-lg'
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          />
          <div className='md:ml-6 w-full md-w-2/3'>
            <h1 className='text-gray-800 text-2xl font-bold my-2'>
              {show.name} <span className='text-gray-600'>({show.original_language})</span>
            </h1>
            <p className='text-gray-600 font-semibold'>
              {show.number_of_seasons && show.number_of_seasons} {show.number_of_seasons > 1 ? 'seasons' : 'season'},&nbsp;
            {show.number_of_episodes} {show.number_of_episodes !== 1 ? 'episodes' : 'episode'}&nbsp;
              {show.first_air_date && '(' + show.first_air_date.split('-')[0] + ' - '}{show.last_air_date && show.last_air_date.split('-')[0]}{show.first_air_date && ')'}
            </p>
            <p className='text-gray-600'>
              {show.genres.map(genre => genre.name).join(', ')}
            </p>
            <Button
              onClick={addToList}
              className='px-3 py-2 my-2'
              value={show.listed ? 'Unlist' : 'Add to list'}
              icon={<Star filled={show.listed} className='h-4 w-4 inline' />}
            />
            <h2 className='text-gray-700 text-xl mt-6 font-semibold'>
              Overview
              </h2>
            <p className='text-gray-600'>
              {show.overview}
            </p>
            <h2 className='text-gray-700 text-xl mt-6 mb-2 font-semibold'>
              Stream Now (Finland)
            </h2>
            <div className='flex flex-row gap-4'>
              {show.providers.FI ? show.providers.FI.flatrate.map(provider =>
                <a
                  className='w-auto'
                  key={provider.provider_id}
                  href={show.providers.FI.link}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <img
                    className='h-20 rounded-md shadow-lg'
                    src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                  />
                </a>
              ) :
                <p className='text-gray-600 italic'>
                  No streaming option for this show in the location: FI.
                </p>
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default ShowPage