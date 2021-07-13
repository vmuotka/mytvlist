import React, { useState, useEffect } from 'react'

// project components
import ProgressTable from './ProgressTable'
import Spinner from '../../components/Spinner/'
import Button from '../../components/Button'
import InputField from '../../components/InputField'

import './ProgressTableRow.css'

// project hooks
import { useProfile } from '../../context/profile'

const Progress = () => {

  const { profile, setProfile } = useProfile()

  const [tvlist, setTvlist] = useState(undefined)
  const [filteredList, setFilteredList] = useState(undefined)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (profile.tvlist) {
      let list = [...profile.tvlist]
      let planning = { name: 'Planning', array: [] }
      let watching = { name: 'Watching', array: [] }
      let completed = { name: 'Completed', array: [] }
      let paused = { name: 'Paused', array: [] }
      list.forEach(show => {
        if (show.progress[show.progress.length - 1].season >= show.tv_info.seasons.length && show.progress[show.progress.length - 1].episode < show.tv_info.seasons[show.tv_info.seasons.length - 1].episode_count) {
          show.progress.season = show.tv_info.seasons.length - 1
        }
        if (show.progress[show.progress.length - 1].season === 0 && show.progress[show.progress.length - 1].episode === 0 && show.watching) {
          planning.array.push(show)
        } else if (show.watching && show.progress[show.progress.length - 1].season !== show.tv_info.seasons.length)
          watching.array.push(show)
        else if (show.progress[show.progress.length - 1].season === show.tv_info.seasons.length) {
          completed.array.push(show)
        } else if (!show.watching) {
          paused.array.push(show)
        }
      })

      setTvlist([
        watching,
        completed,
        planning,
        paused
      ])
    }
  }, [setTvlist, profile.tvlist])

  useEffect(() => {
    if (tvlist) {
      let tvlistCopy = JSON.parse(JSON.stringify(tvlist))
      for (let i = 0; i < tvlistCopy.length; i++) {
        tvlistCopy[i].array = tvlistCopy[i].array.filter(item => item.tv_info.name.toLowerCase().includes(filter.toLocaleLowerCase()))          
      }
      setFilteredList(tvlistCopy)
    }
  }, [filter, tvlist, setFilteredList])

  return (
    <div className='flex mx-4'>
      <div className=' hidden md:block md:w-1/5'>
        <ul className='sticky mx-4' style={{ top: '2rem' }}>
          {
            filteredList && filteredList.map(list =>
              list.array.length > 0 &&
              <li key={list.name} >
                <Button
                  onClick={() => document.getElementById(list.name).scrollIntoView({ block: 'start', behavior: 'smooth' })}
                  className='px-2 py-1 my-1 w-full'
                  value={`${list.name} (${list.array.length})`} />
              </li>
            )
          }
          <InputField className='w-full text-sm' value={filter} onChange={(e) => setFilter(e.target.value)} label='Filter' />
        </ul>
      </div>
      <div className='w-full md:w-4/5'>
        {
          filteredList ?
          filteredList.map((list) =>
              <ProgressTable id={list.name} key={list.name} list={list} profile={profile} setProfile={setProfile} />
            ) : <Spinner className='mx-auto mt-10' color='bg-pink-500' show={true} />
        }
        {(filteredList && filteredList[0].array.length === 0 && filteredList[1].array.length === 0 && filteredList[2].array.length === 0 && filteredList[3].array.length === 0) ? <p className='text-lg text-gray-700 text-center'>This user has no shows on their list.</p> : null}
      </div>
    </div>
  )
}

export default Progress