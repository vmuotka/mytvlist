import React, { useState } from 'react'

// project components
import SearchUsers from './SearchUsers'
import SearchTv from './SearchTv'
import SearchMovies from './SearchMovies'
import SearchActors from './SearchActors'

import TabButtons from '../../components/TabButtons'

const Search = () => {
    const [searchPage, setSearchPage] = useState('tv')
    const options = ['tv', 'movies', 'actors', 'users']

    return (
        <>
            {/* <div className='flex justify-center my-4'>
                <button
                    className={`border border-pink-500 rounded-l py-1 w-24 font-semibold focus:outline-none ${searchPage === 'tv' ? 'bg-pink-500 text-white' : 'hover:bg-pink-500 hover:text-white text-pink-500'}`}
                    onClick={(e) => { setSearchPage('tv') }}
                >Tv</button>
                <button
                    className={`border-t border-b border-pink-500 py-1 w-24 font-semibold focus:outline-none ${searchPage === 'movies' ? 'bg-pink-500 text-white' : 'hover:bg-pink-500 hover:text-white text-pink-500'}`}
                    onClick={(e) => { setSearchPage('movies') }}
                >Movies</button>
                <button
                    className={`border border-pink-500 py-1 rounded-r w-24 font-semibold focus:outline-none ${searchPage === 'actors' ? 'bg-pink-500 text-white' : 'hover:bg-pink-500 hover:text-white text-pink-500'}`}
                    onClick={(e) => { setSearchPage('actors') }}
                >Actors</button>
                <button
                    className={`border border-pink-500 py-1 rounded-r w-24 font-semibold focus:outline-none ${searchPage === 'users' ? 'bg-pink-500 text-white' : 'hover:bg-pink-500 hover:text-white text-pink-500'}`}
                    onClick={(e) => { setSearchPage('users') }}
                >Users</button>
            </div> */}
            <TabButtons
                options={options}
                value={searchPage}
                onChange={setSearchPage}
            />
            {searchPage === 'users' && <SearchUsers />}
            {searchPage === 'tv' && <SearchTv />}
            {searchPage === 'movies' && <SearchMovies />}
            {searchPage === 'actors' && <SearchActors />}
        </>
    )
}

export default Search