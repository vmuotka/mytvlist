import React from 'react'

const TvCard = ({ show }) => {
  let genres = []
  for (let i = 0; i < show.genres.length; i++)
    genres.push(show.genres[i].name)
  return (
    <div className='w-full lg:flex mt-4'>
      <div
        className={`h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden bg-pink-500`}
        style={{ backgroundImage: show.poster_path && `url('https://image.tmdb.org/t/p/w200${show.poster_path}')` }}
        title={`${show.name} poster`}
      >
      </div>
      <div className="w-full border-r border-b border-l border-pink-400 lg:border-l-0 lg:border-t lg:border-pink-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <div className="text-gray-900 font-bold text-xl mb-0">
            {show.name}&nbsp;
            <span className='text-gray-500'>({show.original_language})</span>
          </div>
          <p className='mb-2 text-gray-600 font-semibold'>
            {show.number_of_seasons && show.number_of_seasons} season(s)&nbsp;
            {show.first_air_date && show.first_air_date.split('-')[0] + ' - '}{show.last_air_date && show.last_air_date.split('-')[0]}
          </p>
          <p className="text-gray-700 text-xs">{show.overview ? show.overview : 'No description available'}</p>
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