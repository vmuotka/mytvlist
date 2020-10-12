import React, { useState } from 'react'

// project components
import Form from '../components/Form'
import InputField from '../components/InputField'
import Heading from '../components/Heading'
import TvCard from '../components/TvCard'
import Spinner from '../components/Spinner'

// project services
import searchService from '../services/searchService'

// project hooks
import { useAuth } from '../context/auth'

const Search = () => {
  const [form, setForm] = useState({ searchword: '' })
  const { authTokens } = useAuth()
  const [response, setResponse] = useState({
    results: [
      {
        "backdrop_path": "/nJjGz058NybzHEDMjj9K5FoV5qd.jpg",
        "created_by": [
          {
            "id": 1853492,
            "credit_id": "5db5110ad40d4c0012fc0a10",
            "name": "Dana Terrace",
            "gender": 1,
            "profile_path": null
          }
        ],
        "episode_run_time": [
          22
        ],
        "first_air_date": "2020-01-10",
        "genres": [
          {
            "id": 35,
            "name": "Comedy"
          },
          {
            "id": 10765,
            "name": "Sci-Fi & Fantasy"
          },
          {
            "id": 16,
            "name": "Animation"
          },
          {
            "id": 10759,
            "name": "Action & Adventure"
          }
        ],
        "homepage": "https://disneynow.com/shows/the-owl-house",
        "id": 92685,
        "in_production": true,
        "languages": [
          "en"
        ],
        "last_air_date": "2020-08-29",
        "last_episode_to_air": {
          "air_date": "2020-08-29",
          "episode_number": 19,
          "id": 2376234,
          "name": "Young Blood, Old Souls",
          "overview": "Luz’s skills as a witch are put to the test when she attempts the impossible.",
          "production_code": "",
          "season_number": 1,
          "show_id": 92685,
          "still_path": null,
          "vote_average": 0,
          "vote_count": 0
        },
        "name": "The Owl House",
        "next_episode_to_air": null,
        "networks": [
          {
            "name": "Disney Channel",
            "id": 54,
            "logo_path": "/tL0rmIN3YHmJZrYQCrP1jXViWE1.png",
            "origin_country": "US"
          }
        ],
        "number_of_episodes": 19,
        "number_of_seasons": 1,
        "origin_country": [
          "US"
        ],
        "original_language": "en",
        "original_name": "The Owl House",
        "overview": "An animated fantasy-comedy series that follows Luz, a self-assured teenage girl who accidentally stumbles upon a portal to a magical world where she befriends a rebellious witch, Eda, and an adorably tiny warrior, King. Despite not having magical abilities, Luz pursues her dream of becoming a witch by serving as Eda's apprentice at the Owl House and ultimately finds a new family in an unlikely setting.",
        "popularity": 33.269,
        "poster_path": "/cZLxKTslrf9gzRomVy8BhaYjg7n.jpg",
        "production_companies": [
          {
            "id": 3475,
            "logo_path": "/jTPNzDEn7eHmp3nEXEEtkHm6jLg.png",
            "name": "Disney Television Animation",
            "origin_country": "US"
          }
        ],
        "seasons": [
          {
            "air_date": "2020-01-10",
            "episode_count": 19,
            "id": 130506,
            "name": "Season 1",
            "overview": "",
            "poster_path": "/6Ao7lQjcK2n7881fuDZtEwKnO1R.jpg",
            "season_number": 1
          }
        ],
        "status": "Returning Series",
        "type": "Scripted",
        "vote_average": 8.5,
        "vote_count": 202
      }
    ], total_results: 1
  })

  const [spinner, setSpinner] = useState(false)
  // handle form field changes
  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.searchword.length > 0) {
      setSpinner(true)
      try {
        const res = await searchService.search(form, authTokens)
        setResponse(res)
      } catch (err) {
        console.error(err)
      }
      setSpinner(false)
    }
  }

  return (
    <>
      <Form className='max-w-sm mb-4' onSubmit={handleSubmit}>
        <Heading className='text-center'>Search TV shows</Heading>
        <div className='mb4'>
          <InputField className='w-full' label='Search' type='text' value={form.searchword} onChange={handleChange} name='searchword' placeholder='eg. The Owl House' />
        </div>
      </Form>
      <div className='max-w-xl mx-auto'>
        <Spinner className='mx-auto' color='bg-pink-500' show={spinner} />
        <p className='mt-4 mb-2 text-sm text-gray-600 font-semibold select-none' title='Some results might be removed because they did not meet our requirements'>Showing {response.results.length} of {response.total_results} result(s)</p>
        {
          response.results.map((result, index) => <TvCard show={result} key={index} />)
        }
      </div>
    </>
  )
}

export default Search