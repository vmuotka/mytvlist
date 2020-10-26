import React, { useState, useEffect } from 'react'
import MultiSelect from 'react-multi-select-component'

// project components
import Select from '../../components/Select'
import TvCard from '../../components/TvCard'
import InputField from '../../components/InputField'

// project hooks
import { useProfile } from '../../context/profile'

const TvList = () => {
  const { profile } = useProfile()
  const [orderBy, setOrderBy] = useState('alphabetical')
  const orderByOptions = ['alphabetical', 'score', 'newest', 'oldest']
  const [filtertext, setFiltertext] = useState('')
  const [tvlist, setTvlist] = useState([])
  const [filter, setFilter] = useState([])
  const [filterOptions, setFilterOptions] = useState([])
  const changeOrderBy = e => {
    setOrderBy(e.target.value)
  }
  useEffect(() => {
    if (profile.tvlist) {

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
  }, [profile.tvlist])

  useEffect(() => {
    if (profile.tvlist) {
      let tvcopy = [...profile.tvlist]
      tvcopy = JSON.parse(JSON.stringify(tvcopy))
      tvcopy = tvcopy.filter(tv => tv.tv_info.name.toLowerCase().includes(filtertext.toLowerCase()))
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
          let showFound = false
          for (let i = 0; i < show.tv_info.genres.length; i++) {
            for (let j = 0; j < filter.length; j++) {
              if (filter[j].value === show.tv_info.genres[i].id && !showFound) {
                arr.push(show)
                showFound = true
              }
            }
          }
        })
      }
      setTvlist(arr.length > 0 ? arr : tvcopy)
    }
  }, [orderBy, filter, profile.tvlist, filtertext])

  return (
    <div className='mx-2'>
      <div className='flex flex-row'>
        <Select onChange={changeOrderBy} className='w-1/2' value={orderBy} options={orderByOptions} label='Sort' />

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

      <div className='xl:grid grid-cols-2 gap-5 mt-4 xl:mx-2'>
        {tvlist &&
          <>
            <div className='xl:col-span-2'><p className='text-gray-600 text-lg'>{tvlist.length} shows</p></div>
            {tvlist.map(show => <TvCard className='mt-4 xl:mt-0' key={show.tv_id} show={show} />)}
          </>
        }
      </div>
    </div>
  )
}

export default TvList