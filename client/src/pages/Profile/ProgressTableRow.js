import React, { useState, useEffect } from 'react'

// project components
import { Tr, Td } from '../../components/Table'
import ExpandIcon from '../../components/icons/Expand'

// project services
import userService from '../../services/userService'

// project hooks
import { useAuth } from '../../context/auth'

import './ProgressTableRow.css'

const ProgressTableRow = ({ show, profile, setProfile, handleModal }) => {
  const [progress, setProgress] = useState(show.progress[show.progress.length - 1])
  const { authTokens } = useAuth()

  useEffect(() => {
    setProgress(show.progress[show.progress.length - 1])
  }, [setProgress, show])

  const decodedToken = authTokens ? JSON.parse(window.atob(authTokens.token.split('.')[1])) : null
  const myProfile = decodedToken ? decodedToken.id === profile.id : false

  const handleProgress = async () => {
    if (progress.season !== show.tv_info.number_of_seasons && progress.episode !== show.tv_info.seasons[progress.season].episode_count) {
      const progg = {
        season: progress.episode + 1 < show.tv_info.seasons[progress.season].episode_count ? progress.season : progress.season + 1,
        episode: progress.episode + 1 < show.tv_info.seasons[progress.season].episode_count ? progress.episode + 1 : progress.season + 1 < show.tv_info.seasons.length ? 0 : show.tv_info.seasons[progress.season].episode_count
      }
      let showCopy = { ...show }
      showCopy.progress[showCopy.progress.length - 1] = progg
      setProgress(progg)
      setProfile({
        ...profile,
        tvlist: profile.tvlist.map(list => list.tv_id === show.tv_id ? showCopy : list)
      })
      try {
        userService.progress(showCopy, authTokens)
      } catch (err) {
        console.error(err)
      }
    }
  }
  return (
    <Tr className='text-sm sm:text-lg md:text-xl table-row'>
      <Td className='flex items-center w-4/6' colSpan='3'>
        <div
          className={`break-words h-8 w-6 sm:h-12 sm:w-8 flex-none bg-cover bg-no-repeat rounded text-center overflow-hidden bg-pink-500 flex items-center ${myProfile && 'progress-image'}`}
          style={{ backgroundImage: `url('https://image.tmdb.org/t/p/w200${show.tv_info.poster_path}')` }}
        >
          {myProfile &&
            <button onClick={handleModal(show)} className='modal-btn text-lg text-white p-1'>
              <ExpandIcon className='w-full' />
            </button>
          }
        </div>
        <span className='ml-6'>{show.tv_info.name}</span>
      </Td>
      <Td className='w-1/6'>
        {progress.season}/{show.tv_info.seasons.length}
      </Td>
      <Td className='w-1/6'>
        {(myProfile && show.tv_info.seasons.length !== progress.season && show.watching) ?
          <button className='px-2 py-1 bg-pink-500 text-white rounded text-base hover:bg-pink-400' onClick={handleProgress} title='Increase episode progression'>
            {progress.episode}/{show.tv_info.seasons[progress.season !== show.tv_info.seasons.length ? progress.season : show.tv_info.seasons.length - 1].episode_count}
          </button>
          :
          <>{progress.episode}/{show.tv_info.seasons[progress.season !== show.tv_info.seasons.length ? progress.season : show.tv_info.seasons.length - 1].episode_count}
          </>
        }
      </Td>
    </Tr>
  )
}

export default ProgressTableRow