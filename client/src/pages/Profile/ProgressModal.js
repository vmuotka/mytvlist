import React from 'react'
import disableScroll from 'disable-scroll'

// project components
import Modal from '../../components/Modal/'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import Select from '../../components/Select'

// project services
import userService from '../../services/userService'

// project hooks
import { useAuth } from '../../context/auth'

// project hooks

const ProgressModal = ({ modal, handleModal, profile, setProfile, setModal }) => {
  const { authTokens } = useAuth()

  const saveProgress = (e) => {
    e.preventDefault()
    let showCopy = { ...modal.show }
    showCopy.progress[showCopy.progress.length - 1] = modal.progress
    setProfile({
      ...profile,
      tvlist: profile.tvlist.map(list => list.tv_id === showCopy.tv_id ? showCopy : list)
    })
    try {
      userService.progress(showCopy, authTokens)
    } catch (err) {
      console.error(err)
    }
    setModal({
      ...modal,
      hidden: true
    })
    disableScroll.off()
  }

  const handleModalChange = e => {
    let progress = { ...modal.progress }
    const value = +e.target.value


    progress[e.target.name] = value

    // when the episode count is something else than final seasons full episode count
    if (e.target.name === 'episode' && value !== modal.show.tv_info.seasons[modal.show.tv_info.seasons.length - 1].episode_count && modal.progress.season === modal.show.tv_info.seasons.length)
      progress.season = modal.show.tv_info.seasons.length - 1

    // when season counter fills the season count
    if (e.target.name === 'season' && value === modal.show.tv_info.seasons.length)
      progress.episode = modal.show.tv_info.seasons[modal.show.tv_info.seasons.length - 1].episode_count

    // when the season count is lowered from the max value
    if (e.target.name === 'season' && modal.progress.season === modal.show.tv_info.seasons.length) {
      progress.episode = modal.show.tv_info.seasons[value].episode_count - 1
    }

    // when episode counter fills the season episode count
    if (e.target.name === 'episode' && value === modal.show.tv_info.seasons[progress.season].episode_count) {
      progress.season += 1
      if (progress.season !== modal.show.tv_info.seasons.length)
        progress.episode = 0
    }

    setModal({ ...modal, progress })
  }

  const handleWatching = e => {
    const value = e.target.value === 'true'
    setModal({
      ...modal,
      show: {
        ...modal.show,
        watching: value
      }
    })
  }

  return (
    <>
      <Modal hidden={modal.hidden} title={modal.show.tv_info.name} closeFunction={handleModal}>
        <tbody className='text-center'>
          <tr>
            <td colSpan='2'>
              <img src={`https://image.tmdb.org/t/p/w400${modal.show.tv_info.poster_path}`} alt='Show Poster' />
            </td>
            <td colSpan='2' className='p-4'>
              <form onSubmit={saveProgress}>
                <Select options={[{ value: true, name: 'Watching' }, { value: false, name: 'Paused' }]} value={modal.show.watching} onChange={handleWatching} label='Watching' />
                <div className='inline-block mb-2 md:mr-2'>
                  <InputField onChange={handleModalChange} min='0' max={modal.show.tv_info.seasons.length} type='number' name='season' label='Season' size='5' value={modal.progress.season} className='text-center inline' />
                </div>
                <div className='inline-block mb-2 md:ml-2'>
                  <InputField onChange={handleModalChange} min='0' max={modal.show.tv_info.seasons[modal.progress.season !== modal.show.tv_info.seasons.length ? modal.progress.season : modal.show.tv_info.seasons.length - 1].episode_count} type='number' name='episode' label='Episode' size='5' value={modal.progress.episode} className='text-center inline' />
                </div>
                <Button type='submit' className='block m-auto mt-2 px-4 py-2' color='bg-green-500 hover:bg-green-600'>Save</Button>
              </form>
            </td>
          </tr>
        </tbody>
      </Modal>
    </>
  )
}

export default ProgressModal