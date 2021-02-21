import React, { useState } from 'react'

// project components
import ActorCard from '../../components/ActorCard'
import Button from '../../components/Button'

const Cast = ({ cast }) => {
  const [viewAll, setViewAll] = useState(false)
  return (
    <>
      <h2 className='text-gray-700 text-4xl' id='cast'>
        Cast
      </h2>
      <Button
        value={viewAll ? 'View Less' : 'View All'}
        className='px-2 py-1'
        onClick={() => {
          setViewAll(!viewAll)
        }}
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 my-6' >
        {
          cast.slice(0, viewAll ? cast.length : 6).map(actor =>
            <ActorCard key={actor.id} actor={actor} />
          )
        }
      </div>
      {
        viewAll &&
        <Button
          value='View Less'
          className='px-2 py-1'
          onClick={() => {
            document.getElementById('cast').scrollIntoView({ block: 'start' })
            setViewAll(!viewAll)
          }}
        />
      }
    </>
  )

}

export default Cast