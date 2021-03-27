import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

// project components
import Spinner from '../../components/Spinner'
import searchService from '../../services/searchService'
import { useNotification } from '../../context/notification'
import Button from '../../components/Button'
import { Table, Thead, Th, Tbody, Tr } from '../../components/Table'

const ActorPage = () => {
  const { id } = useParams()
  const [actor, setActor] = useState(undefined)
  const { setNotifications } = useNotification()
  const [fullBio, setFullBio] = useState(false)

  useEffect(() => {
    searchService.getActorDetails(id)
      .then(res => {
        res.data.tv_credits.cast.sort((a, b) => {
          if (a.first_air_date && b.first_air_date)
            return +b.first_air_date.split('-')[0] - +a.first_air_date.split('-')[0]
          if (!a.first_air_date && b.first_air_date)
            return 1
          if (a.first_air_date && !b.first_air_date)
            return -1
          return 0
        })
        setActor(res.data)
      })
      .catch(err => {
        console.error(err)
        setNotifications([{ title: 'Couln\'t find the actor', type: 'error' }])
      })
  }, [id, setNotifications])


  return (
    <div className='w-full md:w-2/3 mx-auto mt-3'>
      {!actor && <Spinner className='mx-auto mt-4' color='bg-pink-500' show={true} />}
      {actor &&
        <>
          <div className='md:flex justify-center my-4'>
            <img
              alt='Actor profile'
              className='w-full max-w-sm md:w-2/5 mx-auto shadow-lg rounded-lg object-cover'
              src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
            />
            <div className='md:ml-6 w-full md:w-3/5'>
              <h1 className='text-gray-800 text-2xl font-bold my-2'>
                {actor.name}
              </h1>
              <h3 className='text-gray-700'>Biography</h3>
              <p className='text-gray-600 text-sm ml-2 mb-2'>
                {fullBio ? actor.biography : `${actor.biography.split(' ').slice(0, 60).join(' ')}...`}
                <Button className='py-1 px-2 block mt-1' onClick={() => setFullBio(!fullBio)} value={fullBio ? 'View Less' : 'View More'} />
              </p>
              <span className='text-gray-700 text-semibold'>Born: </span>
              <span className='text-gray-600'>
                {new Date(Date.parse(actor.birthday)).toLocaleDateString("en-GB", { month: 'long', day: 'numeric', year: 'numeric' })}
                &nbsp; {actor.place_of_birth && `(${actor.place_of_birth})`}
              </span>
              {actor.deathday && <>
                <br />
                <span className='text-gray-700 text-semibold'>Died: </span>
                <span className='text-gray-600'>{new Date(Date.parse(actor.deathday)).toLocaleDateString("en-GB", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </>
              }
            </div>
          </div>
          <div>
            <h2 className='text-gray-700 text-2xl my-2'>Filmography</h2>
            <Table>
              <Thead>
                <tr>
                  <Th>Title</Th>
                  <Th>Release Year</Th>
                </tr>
              </Thead>
              <Tbody>
                {
                  actor.tv_credits.cast.map(credits =>
                    <Tr key={Math.random()}>
                      <td className='text-gray-700 font-semibold text-left text-md py-1 px-2 text-lg'>
                        <Link to={`/show/${credits.id}`}>{credits.name}</Link>
                        <span className='block font-medium text-gray-600 text-md'>{credits.character} ({credits.episode_count} episodes)</span>
                      </td>
                      <td className='text-center text-gray-600 text-lg font-semibold'>{credits.first_air_date ? credits.first_air_date.split('-')[0] : 'Not found'}</td>
                    </Tr>
                  )
                }
              </Tbody>
            </Table>
          </div>
        </>
      }
    </div>
  )
}

export default ActorPage