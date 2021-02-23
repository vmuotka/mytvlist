import React, { useState, useEffect } from 'react'
import disableScroll from 'disable-scroll'

// project components
import ProgressTable from './ProgressTable'
import ProgressModal from './ProgressModal'
import Spinner from '../../components/Spinner/'
import Button from '../../components/Button'

import './ProgressTableRow.css'

// project hooks
import { useProfile } from '../../context/profile'

const Progress = () => {

  const { profile, setProfile } = useProfile()
  const [modal, setModal] = useState({
    hidden: true, progress: { season: 0, episode: 0 }, show: undefined
  })


  const [tvlist, setTvlist] = useState(undefined)

  useEffect(() => {
    if (profile.tvlist) {
      let list = [...profile.tvlist]
      let planning = { name: 'Planning', array: [] }
      let watching = { name: 'Watching', array: [] }
      let completed = { name: 'Completed', array: [] }
      let paused = { name: 'Paused', array: [] }
      list.forEach(show => {
        if (show.progress[0].season >= show.tv_info.seasons.length && show.progress[0].episode < show.tv_info.seasons[show.tv_info.seasons.length - 1].episode_count) {
          show.progress.season = show.tv_info.seasons.length - 1
        }
        if (show.progress[0].season === 0 && show.progress[0].episode === 0 && show.watching) {
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

  const handleModal = (show) => e => {
    if (show === undefined) {
      setModal({
        ...modal,
        hidden: !modal.hidden
      })
    } else {
      setModal({
        hidden: !modal.hidden,
        show,
        progress: show.progress[show.progress.length - 1]
      })
    }
    if (modal.hidden)
      disableScroll.on()
    else
      disableScroll.off()
  }

  console.log(tvlist)

  return (
    <div className='flex mx-4'>
      <div className=' hidden md:block md:w-1/5'>
        <ul className='sticky mx-4' style={{ top: '2rem' }}>
          {
            tvlist && tvlist.map(list =>
              list.array.length > 0 &&
              <li key={list.name} >
                <Button
                  onClick={() => document.getElementById(list.name).scrollIntoView({ block: 'start', behavior: 'smooth' })}
                  className='px-2 py-1 my-1 w-full'
                  value={`${list.name} (${list.array.length})`} />
              </li>
            )
          }
        </ul>
      </div>
      <div className='w-full md:w-4/5'>
        {
          tvlist ?
            tvlist.map((list) =>
              <ProgressTable id={list.name} key={list.name} list={list} profile={profile} setProfile={setProfile} handleModal={handleModal} />
            ) : <Spinner className='mx-auto mt-10' color='bg-pink-500' show={true} />
        }
        {(tvlist && tvlist[0].array.length === 0 && tvlist[1].array.length === 0 && tvlist[2].array.length === 0 && tvlist[3].array.length === 0) ? <p className='text-lg text-gray-700 text-center'>This user has no shows on their list.</p> : null}
        {
          modal.show &&
          <ProgressModal modal={modal} handleModal={handleModal} profile={profile} setProfile={setProfile} setModal={setModal} />
        }
      </div>
    </div>
  )
}

export default Progress