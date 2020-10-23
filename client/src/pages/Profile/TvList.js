import React, { useState, useEffect } from 'react'
import MultiSelect from 'react-multi-select-component'

// project components
import Select from '../../components/Select'
import TvCard from '../../components/TvCard'

// project hooks
import { useProfile } from '../../context/profile'

const TvList = () => {
  const { profile } = useProfile()
  const [orderBy, setOrderBy] = useState('alphabetical')
  const orderByOptions = ['alphabetical', 'newest', 'oldest']
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
  }, [orderBy, filter, profile.tvlist])

  return (
    <div className='mx-2'>
      <Select onChange={changeOrderBy} className='w-full' value={orderBy} options={orderByOptions} label='Sort' />
      <div className='px-3 mt-2'>
        <label id='filter' className='block uppercase tracking-wide text-gray-700 text-sm font-semibold mb-1 select-none'>Filter</label>
        <MultiSelect onChange={setFilter} hasSelectAll={false} focusSearchOnOpen={false} value={filter} options={filterOptions} labelledBy={'filter'} />
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