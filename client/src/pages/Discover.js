import React, { useState, useEffect } from 'react'

// project components
import Heading from '../components/Heading'
import TvCard from '../components/TvCard'
import Button from '../components/Button'
import ArrowLeft from '../components/icons/ArrowLeft'
import Spinner from '../components/Spinner/'
import MovieCard from '../components/MovieCard'

// project services
import userService from '../services/userService'

// project hooks
import { useAuth } from '../context/auth'

// small component to render all shows when a button is clicked
const DiscoverPage = (props) => {
  const GoBackBtn = () => {
    return (
      <span className='text-gray-600 text-xl cursor-pointer' onClick={() => {
        props.setSubpage(false)
        window.scrollTo(0, 0)
      }}>
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
  const [type, setType] = useState('tv')

  // get user's recommendations
  useEffect(() => {
    userService.discover(authTokens)
      .then(data => {
        setDiscover(data)
      }).catch(err => {
        console.error(err)
      })

  }, [authTokens])

  // detect when user has scrolled to the bottom of the screen and load more recommendations
  const [isFetching, setIsFetching] = useState(false)
  const handleScroll = () => {
    if ((window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight)) {
      setIsFetching(true)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isFetching && !subpage) {
      userService.discoverScroll(
        discover.recommendationList.length,
        discover.recommendationList.length + 4,
        authTokens
      ).then(data => {
        setIsFetching(false)
        setDiscover({
          ...discover,
          recommendationList: [
            ...discover.recommendationList,
            ...data.recommendationList
          ]
        })
      })
        .catch(err => {
          console.error(err)
        })
    } else {
      setIsFetching(false)
    }
  }, [isFetching, discover, authTokens, subpage])

  const handleSeeAll = () => {
    window.scrollTo(0, 0)
    setSubpage(true)
  }

  console.log(discover)

  return (
    <div className='w-full mb-5 md:w-4/5 mx-auto'>
      {!discover &&
        <Spinner className='mx-auto mt-4' color='bg-pink-500' show={true} />
      }
      {(!subpage && discover && discover[type].length > 0) &&
        <>
          <div className='flex justify-center my-4'>
            <button
              className={`border border-pink-500 rounded-l py-1 w-24 font-semibold focus:outline-none ${type === 'tv' ? 'bg-pink-500 text-white' : 'hover:bg-pink-500 hover:text-white text-pink-500'}`}
              onClick={(e) => { setType('tv') }}
            >Tv</button>
            <button
              className={`border border-pink-500 py-1 rounded-r w-24 font-semibold focus:outline-none ${type === 'movie' ? 'bg-pink-500 text-white' : 'hover:bg-pink-500 hover:text-white text-pink-500'}`}
              onClick={(e) => { setType('movie') }}
            >Movies</button>
          </div>

          <Heading className='text-center'>Discover {type === 'tv' ? 'TV' : 'Movies'}</Heading>
          <h2 className='text-gray-700 text-xl'>Popular in the last 6 months</h2>
          <div className='grid xl:grid-cols-2 gap-3 mt-4 xl:mx-2'>
            {
              type === 'tv' &&
              discover.tv.slice(0, 6).map(show => <TvCard className='w-1/2' key={show.tv_id} show={show} />)
            }
            {
              type === 'movie' &&
              discover.movie.slice(0, 6).map(movie => <MovieCard movie={movie} />)
            }
          </div>
          <div className='flex justify-end'>
            <Button value='See all' onClick={handleSeeAll} className='py-2 px-4 mt-2' />
          </div>
        </>
      }
      {!subpage && discover &&
        discover.recommendationList.filter(obj => obj.recommendations.length > 0).map(obj =>
          <div className='mt-10' key={obj.name}>
            <h2 className='text-gray-700 text-xl'>Because you watched <span className='font-semibold'>{obj.name}</span></h2>
            <div className='grid xl:grid-cols-2 gap-3 mt-4 xl:mx-2'>
              {obj.recommendations.map(show => <TvCard className='w-1/2' key={show.tv_id} show={show} />)}
            </div>
          </div>
        )
      }
      {!subpage && discover && <Button className='py-3 w-full mt-3 mb-3' value='Back to top' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />}
      <Spinner className={`mx-auto mt-2 ${isFetching ? 'opacity-100' : 'opacity-0'}`} mt-4 color='bg-pink-500' show={true} />
      {subpage &&
        <DiscoverPage setSubpage={setSubpage}>
          {discover && type === 'tv' &&
            discover.tv.map(show => <TvCard className='w-1/2' key={show.tv_id} show={show} />)
          }
          {discover && type === 'movie' &&
            discover.movie.map(movie => <MovieCard movie={movie} />)
          }
        </DiscoverPage>
      }
    </div>
  )
}

export default Discover
