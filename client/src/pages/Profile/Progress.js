import React, { useState, useEffect } from 'react'
import disableScroll from 'disable-scroll'

// project components
import ProgressTable from './ProgressTable'
import ProgressModal from './ProgressModal'

import './ProgressTableRow.css'



const Progress = ({ profile, setProfile }) => {
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

  return (
    <div className='md:mx-10'>
      {
        tvlist &&
        tvlist.map((list) =>
          <ProgressTable key={list.name} list={list} profile={profile} setProfile={setProfile} handleModal={handleModal} />
        )
      }
      {
        modal.show &&
        <ProgressModal modal={modal} handleModal={handleModal} profile={profile} setProfile={setProfile} setModal={setModal} />
      }
    </div >
  )
}

export default Progress