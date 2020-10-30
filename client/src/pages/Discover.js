import React, { useState, useEffect } from 'react'

// project components
import Heading from '../components/Heading'
import TvCard from '../components/TvCard'

// project services
import userService from '../services/userService'

// project hooks
import { useAuth } from '../context/auth'

const Search = () => {
  const { authTokens } = useAuth()
  const [discover, setDiscover] = useState(null)

  // get user's recommendations
  useEffect(() => {
    userService.discover(authTokens).
      then(data => {
        console.log(data)
        setDiscover(data)
      }).catch(err => {
        console.error(err)
      })

  }, [authTokens])

  return (
    <div className='w-full md:w-4/5 mx-auto'>
      <Heading className='text-center'>Discover</Heading>
      {discover &&
        <>
          {discover.discover.map(show => <TvCard className='mt-4' key={show.tv_id} show={show} />)}
        </>
      }
    </div>
  )
}

export default Search