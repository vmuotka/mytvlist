import React from 'react'
import { Link } from 'react-router-dom'

// project components
import Button from '../components/Button'
import PieChart from '../components/Charts/PieChart'
import BarChart from '../components/Charts/BarChart'

const marketing_points = [
  {
    title: 'Add shows to your list',
    text: 'Keep all of your shows in one place, regardless of the platform.'
  },
  {
    title: 'Mark watch progress',
    text: 'Easily return to where you left off, even when changing streaming platforms.'
  },
  {
    title: 'View Statistics',
    text: 'We display interesting watch statistics based on your shows and progress.'
  }
]

const exampleData = [
  {
    title: 'Progress',
    data: [
      { name: 'Watching', value: 6 },
      { name: 'Completed', value: 21 },
      { name: 'Planning', value: 9 },
      { name: 'Paused', value: 15 }
    ]
  },
  {
    title: 'Watched Episodes',
    data: [
      { name: 'Watched', value: 666 },
      { name: 'Not Watched', value: 420 }
    ]
  }
]

const hoursByGenre = [
  { name: 'Action & Adventure', value: 213 },
  { name: 'Crime', value: 351 },
  { name: 'Drama', value: 521 },
  { name: 'Mystery', value: 421 },
]

const LandingPage = () => {
  return (
    <div className='w-full mb-5 md:w-3/5 mx-auto'>
      <div className='p-5 mt-10'>
        <h1 className='text-4xl text-center text-indigo-600 font-semibold'>Keep track of the shows you watch</h1>
        <p className='text-xl text-gray-700'>
          There are thousands of TV shows available to watch at any time in any place. New streaming platforms emerge all the time. Keep track of the shows that YOU watch easily in one place. View statistics of your entertainment.
        </p>
      </div>

      <div className='flex justify-center my-24'>
        <Link to='/signup'>
          <Button className='py-4 px-6 text-4xl'>Sign Up</Button>
        </Link>
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 my-24'>
        {marketing_points.map(item =>
          <div key={item.title} className='text-center'>
            <h2 className='text-xl font-semibold text-indigo-600'>{item.title}</h2>
            <p className='text-gray-700'>
              {item.text}
            </p>
          </div>
        )}
      </div>
      <h2 className='text-4xl text-indigo-700 text-center mt-32 mb-4'>Examples of Statistics</h2>
      <div className='grid gap-12 grid-cols-1 md:grid-cols-2 mb-16'>
        {exampleData.map((item, index) =>
          <div className='relative h-64' key={index}>
            <p className='text-lg text-gray-700 text-center'>{item.title}</p>
            <PieChart data={item.data} />
          </div>
        )}
      </div>
      <div className='relative' style={{ height: '20rem' }}>
        <p className='text-lg text-gray-700 text-center'>Hours by Genre</p>
        <BarChart data={hoursByGenre} label='Hours' />
      </div>
    </div>
  )
}

export default LandingPage