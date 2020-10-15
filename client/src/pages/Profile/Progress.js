import React, { useState, useEffect } from 'react'

// project components
import { Table, Thead, Tbody } from '../../components/Table'
import ProgressTableRow from './ProgressTableRow'
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
      let planning = []
      let watching = []
      let completed = []
      let paused = []
      list.forEach(show => {
        if (show.progress[0].season === 0 && show.progress[0].episode === 0) {
          planning.push(show)
        } else if (show.watching && show.progress[show.progress.length - 1].season !== show.tv_info.seasons.length)
          watching.push(show)
        else if (show.progress[show.progress.length - 1].season === show.tv_info.seasons.length) {
          completed.push(show)
        } else if (!show.watching) {
          paused.push(show)
        }
      })

      setTvlist({
        watching,
        completed,
        planning,
        paused
      })
      console.log(completed)
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
  }

  return (
    <div>
      {(tvlist && tvlist.planning.length > 0) &&
        <div className='mt-4'>
          <p className='text-gray-600 text-lg ml-2 mb-2'>Planning ({tvlist && tvlist.planning.length} shows)</p>
          <Table>
            <Thead headers={['Show', 'Season', 'Episode']} />
            <Tbody>
              {tvlist && tvlist.planning.map(show =>
                <ProgressTableRow handleModal={handleModal} key={show.id} show={show} profile={profile} setProfile={setProfile} />
              )}
            </Tbody>
          </Table>
        </div>
      }

      {(tvlist && tvlist.watching.length > 0) &&
        <div className='mt-4'>
          <p className='text-gray-600 text-lg ml-2 mb-2'>Watching ({tvlist && tvlist.watching.length} shows)</p>
          <Table>
            <Thead headers={['Show', 'Season', 'Episode']} />
            <Tbody>
              {tvlist && tvlist.watching.map(show =>
                <ProgressTableRow handleModal={handleModal} key={show.id} show={show} profile={profile} setProfile={setProfile} />
              )}
            </Tbody>
          </Table>
        </div>
      }

      {(tvlist && tvlist.completed.length > 0) &&
        <div className='mt-4'>
          <p className='text-gray-600 text-lg ml-2 mb-2'>Completed ({tvlist && tvlist.completed.length} shows)</p>
          <Table>
            <Thead headers={['Show', 'Seasons', 'Episodes']} />
            <Tbody>
              {tvlist && tvlist.completed.map(show =>
                <ProgressTableRow handleModal={handleModal} key={show.id} show={show} profile={profile} setProfile={setProfile} />
              )}
            </Tbody>
          </Table>
        </div>
      }
      {
        modal.show &&
        <ProgressModal modal={modal} handleModal={handleModal} profile={profile} setProfile={setProfile} setModal={setModal} />
      }
    </div >
  )
}

export default Progress