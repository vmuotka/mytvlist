import React, { useState } from 'react'

// project components
import { Table, Thead, Tbody } from '../../components/Table'
import ProgressTableRow from './ProgressTableRow'
import Modal from '../../components/Modal/'
import InputField from '../../components/InputField'
import Button from '../../components/Button'

// project services
import userService from '../../services/userService'

// project hooks
import { useAuth } from '../../context/auth'

const Progress = ({ profile, setProfile }) => {
  const [modal, setModal] = useState({
    hidden: true, progress: { season: 0, episode: 0 }, show: undefined
  })

  const { authTokens } = useAuth()

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

  const handleModalChange = e => {
    let progress = { ...modal.progress }

    if (e.target.name === 'episode' && e.target.value !== modal.show.tv_info.seasons[modal.show.tv_info.seasons.length - 1].episode_count && modal.progress.season === modal.show.tv_info.seasons.length)
      progress.season = modal.show.tv_info.seasons.length - 1

    if (e.target.name === 'season' && +e.target.value === modal.show.tv_info.seasons.length)
      progress.episode = modal.show.tv_info.seasons[modal.show.tv_info.seasons.length - 1].episode_count

    progress[e.target.name] = +e.target.value
    setModal({ ...modal, progress })
  }

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
  }

  return (
    <div>
      <p className='text-gray-600 text-lg ml-2 mb-2'>Watching ({profile.tvlist && profile.tvlist.length} shows)</p>
      <Table headers={['Show', 'Season', 'Episode']}>
        <Thead headers={['Show', 'Season', 'Episode']} />
        <Tbody>
          {profile.tvlist && profile.tvlist.map(show =>
            <ProgressTableRow handleModal={handleModal} key={show.id} show={show} profile={profile} setProfile={setProfile} />
          )}
        </Tbody>
      </Table>
      {modal.show &&
        <Modal hidden={modal.hidden} title={modal.show.tv_info.name} closeFunction={handleModal}>
          <tbody className='text-center'>
            <tr>
              <td colSpan='2'>
                <img src={`https://image.tmdb.org/t/p/w400${modal.show.tv_info.poster_path}`} alt='Show Poster' />
              </td>
              <td colSpan='2' className='p-4'>
                <form onSubmit={saveProgress}>
                  <div className='inline-block mb-2 md:mr-2'>
                    <InputField onChange={handleModalChange} min='0' max={modal.show.tv_info.seasons.length} type='number' name='season' label='Season' size='5' value={modal.progress.season} className='text-center inline' />
                  </div>
                  <div className='inline-block mb-2 md:ml-2'>
                    <InputField onChange={handleModalChange} min='0' max={modal.show.tv_info.seasons[modal.progress.season !== modal.show.tv_info.seasons.length ? modal.progress.season : modal.show.tv_info.seasons.length - 1].episode_count} type='number' name='episode' label='Episode' size='5' value={modal.progress.episode} className='text-center inline' />
                  </div>
                  <Button type='submit' className='block m-auto mt-2' color='bg-green-500 hover:bg-green-600'>Save</Button>
                </form>
              </td>
            </tr>
          </tbody>
        </Modal>
      }
    </div>
  )
}

export default Progress