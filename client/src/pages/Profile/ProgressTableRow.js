import React, { useState, useEffect } from 'react'

// project components
import { Tr, Td } from '../../components/Table'
import DoubleUp from '../../components/icons/DoubleUp'
import DoubleDown from '../../components/icons/DoubleDown'
import Checkbox from '../../components/Checkbox/'
import ProgressExpandedRow from './ProgressExpandedRow'

// project services
import userService from '../../services/userService'
import { validateProgress } from '../../utils/progress-validation'

// project hooks
import { useAuth } from '../../context/auth'
import { useProfile } from '../../context/profile'
import { useNotification } from '../../context/notification'

import './ProgressTableRow.css'

const ProgressTableRow = ({ show, editMode, handleSelect }) => {
  const [progress, setProgress] = useState(show.progress[show.progress.length - 1])
  const { authTokens } = useAuth()
  const { profile, setProfile } = useProfile()
  const { setNotifications } = useNotification()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setProgress(show.progress[show.progress.length - 1])
  }, [setProgress, show])

  const decodedToken = authTokens ? JSON.parse(window.atob(authTokens.token.split('.')[1])) : null
  const myProfile = decodedToken ? decodedToken.id === profile.id : false

  const handleProgress = async () => {
    if (progress.season !== show.tv_info.number_of_seasons && progress.episode !== show.tv_info.seasons[progress.season].episode_count) {
      let progressCopy = { ...progress }
      progressCopy.episode += 1
      progressCopy = validateProgress(progressCopy, show.tv_info)
      let showCopy = { ...show }
      showCopy.progress[showCopy.progress.length - 1] = progressCopy

      setProgress(progressCopy)
      setProfile({
        ...profile,
        tvlist: profile.tvlist.map(list => list.tv_id === show.tv_id ? showCopy : list)
      })
      try {
        userService.progress(showCopy, authTokens)
      } catch (err) {
        setNotifications([{ title: 'Request failed', message: 'Saving progress failed. Try again later.', type: 'error' }])
      }
    }
  }

  return (
    <>
      <Tr className='text-sm sm:text-lg md:text-xl table-row'>
        <Td colSpan='4' className='flex items-center md:w-8/12 w-min'>
          {editMode ? <Checkbox onChange={handleSelect} className='text-lg' name={show.tv_id} /> :
            <div
              className={`h-8 w-6 sm:h-12 sm:w-8 flex-none bg-cover bg-no-repeat rounded text-center overflow-hidden bg-pink-500 flex items-center ${myProfile && 'progress-image'}`}
              style={{ backgroundImage: show.tv_info.poster_path && `url('https://image.tmdb.org/t/p/w200${show.tv_info.poster_path}')` }}
            >
              {myProfile &&
                <button onClick={() => setExpanded(!expanded)}
                  className='w-full modal-btn text-lg text-white p-1 focus:outline-none'>
                  {expanded ? <DoubleUp /> : <DoubleDown />}
                </button>
              }
            </div>
          }
          <span className='ml-6'>{show.tv_info.name} {show.progress.length > 1 && `(${show.progress.length - 1}. rewatch)`}</span>
        </Td>
        <Td className='md:w-1/12'>
          {(show.score && show.score > 0) && show.score}
        </Td>
        <Td className='md:w-1/12'>
          {progress.season}/{show.tv_info.seasons.length}
        </Td>
        <Td className='md:w-2/12'>
          {(myProfile && show.tv_info.seasons.length !== progress.season && show.watching) ?
            <button className='px-2 py-1 bg-pink-500 text-white rounded text-base hover:bg-pink-400' onClick={handleProgress} title='Increase episode progression'>
              {progress.episode}/{show.tv_info.seasons[Math.min(progress.season, show.tv_info.seasons.length - 1)].episode_count}
            </button>
            :
            <>{progress.episode}/{show.tv_info.seasons[Math.min(progress.season, show.tv_info.seasons.length - 1)].episode_count}
            </>
          }
        </Td>
      </Tr>
      {myProfile && <ProgressExpandedRow show={show} expanded={expanded} />}
    </>
  )
}

export default ProgressTableRow