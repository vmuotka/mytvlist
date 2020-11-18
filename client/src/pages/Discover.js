import React, { useState, useEffect } from 'react'

// project components
import Heading from '../components/Heading'
import TvCard from '../components/TvCard'
import Button from '../components/Button'
import ArrowLeft from '../components/icons/ArrowLeft'

// project services
import userService from '../services/userService'

// project hooks
import { useAuth } from '../context/auth'

// small component to render all shows when a button is clicked
const DiscoverPage = (props) => {
  const GoBackBtn = () => {
    return (
      <span className='text-gray-600 text-2xl cursor-pointer' onClick={() => props.setSubpage(false)}>
        <ArrowLeft className='h-10 w-10 inline' />
        back to discover
      </span>
    )
  }

  return (
    <>
      <Heading className='text-center'>Popular in the last 6 months</Heading>
      <GoBackBtn />
      <div className='grid xl:grid-cols-2 gap-3 my-4 xl:mx-2'>
        {props.children}
      </div>
      <GoBackBtn />
    </>
  )
}

const Discover = () => {
  const { authTokens } = useAuth()
  const [discover, setDiscover] = useState(null)

  const [subpage, setSubpage] = useState(false)

  // get user's recommendations
  useEffect(() => {
    userService.discover(authTokens)
      .then(data => {
        console.log(data)
        setDiscover(data)
      }).catch(err => {
        console.error(err)
      })

  }, [authTokens])

  const handleSeeAll = () => {
    window.scrollTo(0, 0)
    setSubpage(true)
  }

  return (
    <div className='w-full md:w-4/5 mx-auto'>
      { (!subpage && discover) &&
        <>
          <Heading className='text-center'>Discover</Heading>
          <h2 className='text-gray-700 text-lg'>Popular in the last 6 months</h2>
          <div className='grid xl:grid-cols-2 gap-3 mt-4 xl:mx-2'>
            {
              discover.discover.slice(0, 4).map(show => <TvCard className='w-1/2' key={show.tv_id} show={show} />)
            }
          </div>
          <div className='flex justify-end'>
            <Button value='See all' onClick={handleSeeAll} className='py-2 px-4 mt-2' />
          </div>
        </>
      }
      { subpage &&
        <DiscoverPage setSubpage={setSubpage}>
          {discover &&
            discover.discover.map(show => <TvCard className='w-1/2' key={show.tv_id} show={show} />)
          }
        </DiscoverPage>
      }
    </div>
  )
}

export default Discover