import React, { useState, useEffect } from 'react'
import MultiSelect from 'react-multi-select-component'
import { connect } from 'react-redux'

// project components
import Select from '../../components/Select'
import TvCard from '../../components/TvCard'
import MovieCard from '../../components/MovieCard'
import InputField from '../../components/InputField'
import Checkbox from '../../components/Checkbox'

// project hooks
import { useProfile } from '../../context/profile'

const TvList = ({ user }) => {
    const { profile } = useProfile()
    const [orderBy, setOrderBy] = useState('alphabetical')
    const orderByOptions = ['alphabetical', 'score', 'newest', 'oldest']
    const [filtertext, setFiltertext] = useState('')
    const [tvlist, setTvlist] = useState([])
    const [filter, setFilter] = useState([])
    const [filterOptions, setFilterOptions] = useState([])
    const [onlyListed, setOnlyListed] = useState(false)

    const [selectedList, setSelectedList] = useState('tvlist')
    const [movielist, setMovielist] = useState([])

    const decodedToken = user ? JSON.parse(window.atob(user.token.split('.')[1])) : null
    const myProfile = decodedToken ? decodedToken.id === profile.id : false

    const changeOrderBy = e => {
        setOrderBy(e.target.value)
    }
    useEffect(() => {
        if (profile.tvlist && selectedList === 'tvlist') {
            setFilter([])

            let genres = []
            profile.tvlist.forEach((show) => {
                for (let i = 0; i < show.tv_info.genres.length; i++) {
                    let genreFound = false
                    for (let j = 0; j < genres.length; j++) {
                        if (genres[j].value === show.tv_info.genres[i].id) {
                            genreFound = true
                        }
                    }
                    if (!genreFound) {
                        genres.push(
                            {
                                label: show.tv_info.genres[i].name,
                                value: show.tv_info.genres[i].id,
                            })
                    }
                }
            }
            )
            genres.sort((a, b) => {
                if (a.label < b.label)
                    return -1
                if (a.label > b.label)
                    return 1
                return 0
            })
            setFilterOptions(genres)
        }
    }, [profile.tvlist, selectedList])

    useEffect(() => {
        if (profile.tvlist) {
            let tvcopy = [...profile.tvlist]
            tvcopy = JSON.parse(JSON.stringify(tvcopy))
            if (onlyListed)
                tvcopy = tvcopy.filter(tv => tv.listed)
            tvcopy = tvcopy.filter(tv => tv.tv_info.name.toLowerCase().includes(filtertext.trim().toLowerCase()))

            switch (orderBy) {
                case 'alphabetical':
                    tvcopy.sort((a, b) => {
                        if (a.tv_info.name < b.tv_info.name)
                            return -1
                        if (a.tv_info.name > b.tv_info.name)
                            return 1
                        return 0
                    })
                    break;
                case 'newest':
                    tvcopy.sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt)
                    })
                    break;
                case 'oldest':
                    tvcopy.sort((a, b) => {
                        return new Date(a.createdAt) - new Date(b.createdAt)
                    })
                    break;
                case 'score':
                    tvcopy.sort((a, b) => {
                        if (a.score === undefined)
                            a.score = 0
                        if (b.score === undefined)
                            b.score = 0
                        if (a.score > b.score)
                            return -1
                        if (a.score < b.score)
                            return 1
                        return 0
                    })
                    break;
                default: break;
            }

            let arr = []
            if (filter.length > 0) {
                tvcopy.forEach(show => {
                    if (filter.map(genre => genre.label).every(r => show.tv_info.genres.map(genre => genre.name).includes(r))) {
                        arr.push(show)
                    }
                })
            }
            setTvlist(filter.length > 0 ? arr : tvcopy)
        }
    }, [orderBy, filter, profile.tvlist, filtertext, onlyListed])

    useEffect(() => {
        if (profile.movielist && selectedList === 'movies') {
            setFilter([])

            let genres = []
            profile.movielist.forEach((show) => {
                for (let i = 0; i < show.info.genres.length; i++) {
                    let genreFound = false
                    for (let j = 0; j < genres.length; j++) {
                        if (genres[j].value === show.info.genres[i].id) {
                            genreFound = true
                        }
                    }
                    if (!genreFound) {
                        genres.push(
                            {
                                label: show.info.genres[i].name,
                                value: show.info.genres[i].id,
                            })
                    }
                }
            }
            )
            genres.sort((a, b) => {
                if (a.label < b.label)
                    return -1
                if (a.label > b.label)
                    return 1
                return 0
            })
            setFilterOptions(genres)
        }
    }, [profile.movielist, selectedList])

    useEffect(() => {
        if (profile.movielist) {
            let tvcopy = [...profile.movielist]
            tvcopy = JSON.parse(JSON.stringify(tvcopy))
            if (onlyListed)
                tvcopy = tvcopy.filter(tv => tv.listed)
            tvcopy = tvcopy.filter(tv => tv.info.title.toLowerCase().includes(filtertext.trim().toLowerCase()))

            switch (orderBy) {
                case 'alphabetical':
                    tvcopy.sort((a, b) => {
                        if (a.info.title < b.info.title)
                            return -1
                        if (a.info.title > b.info.title)
                            return 1
                        return 0
                    })
                    break;
                case 'newest':
                    tvcopy.sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt)
                    })
                    break;
                case 'oldest':
                    tvcopy.sort((a, b) => {
                        return new Date(a.createdAt) - new Date(b.createdAt)
                    })
                    break;
                case 'score':
                    tvcopy.sort((a, b) => {
                        if (a.score === undefined)
                            a.score = 0
                        if (b.score === undefined)
                            b.score = 0
                        if (a.score > b.score)
                            return -1
                        if (a.score < b.score)
                            return 1
                        return 0
                    })
                    break;
                default: break;
            }

            let arr = []
            if (filter.length > 0) {
                tvcopy.forEach(show => {
                    if (filter.map(genre => genre.label).every(r => show.info.genres.map(genre => genre.name).includes(r))) {
                        arr.push(show)
                    }
                })

            }
            setMovielist(filter.length > 0 ? arr : tvcopy)
        }
    }, [orderBy, filter, profile.movielist, filtertext, onlyListed])

    return (
        <div className='mx-2'>
            <div className='flex flex-row'>
                <Select onChange={changeOrderBy} className='w-1/2' value={orderBy} options={orderByOptions} label='Order' />

                <div className='w-1/2 px-3'>
                    <label id='filter' className='block uppercase tracking-wide text-gray-700 text-sm font-semibold mb-1 select-none'>Filter by genre</label>
                    <MultiSelect onChange={setFilter} hasSelectAll={false} focusSearchOnOpen={false} value={filter} options={filterOptions} labelledBy={'filter'} />
                </div>
            </div>

            <div className='mt-2 px-3'>
                <InputField
                    type='text'
                    value={filtertext}
                    onChange={(e) => setFiltertext(e.target.value)}
                    className='w-full'
                    label='Filter by name'
                    placeholder='Start writing a name...' />
            </div>


            <div className='mt-2 px-3'>
                {(!myProfile && user) && <Checkbox label='Hide shows that you do not watch' onChange={(e) => setOnlyListed(e.target.checked)} checked={onlyListed} />}
            </div>

            <div className='flex justify-center my-4'>
                <button
                    className={`border border-pink-500 rounded-l py-1 w-24 font-semibold focus:outline-none ${selectedList === 'tvlist' ? 'bg-pink-500 text-white' : 'hover:bg-pink-500 hover:text-white text-pink-500'}`}
                    onClick={(e) => { setSelectedList('tvlist') }}
                >Tv</button>
                <button
                    className={`border border-pink-500 py-1 rounded-r w-24 font-semibold focus:outline-none ${selectedList === 'movies' ? 'bg-pink-500 text-white' : 'hover:bg-pink-500 hover:text-white text-pink-500'}`}
                    onClick={(e) => { setSelectedList('movies') }}
                >Movies</button>
            </div>

            {(tvlist && selectedList === 'tvlist') &&
                <>
                    <div className='xl:col-span-2'><p className='text-gray-600 text-lg my-4 xl:mx-2'>{tvlist.length} shows</p></div>
                    <div className='grid xl:grid-cols-2 gap-5 xl:mx-2'>
                        {tvlist.map(show => <TvCard key={show.tv_id} show={show} />)}
                    </div>
                </>
            }

            {(movielist && selectedList === 'movies') &&
                <>
                    <div className='xl:col-span-2'><span className='text-gray-600 text-lg my-4 xl:mx-2'>{movielist.length} movies</span></div>
                    <div className='grid xl:grid-cols-2 gap-5 xl:mx-2'>
                        {movielist.map(movie => <MovieCard key={movie.movie_id} movie={movie} />)}
                    </div>
                </>
            }
        </div>
    )
}

const mapProps = (state) => {
    return {
        user: state.user
    }
}

const connectedTvList = connect(mapProps)(TvList)

export default connectedTvList