import React, { useState } from 'react'

// project components
import InputField from '../../components/InputField'
import Select from '../../components/Select'
import { Tr, Td } from '../../components/Table'
import Button from '../../components/Button'

// project services
import userService from '../../services/userService'

// project hooks
import { useAuth } from '../../context/auth'
import { useProfile } from '../../context/profile'
import { useNotification } from '../../context/notification'


const ProgressExpandedRow = ({ show, expanded }) => {
  const { authTokens } = useAuth()
  const { profile, setProfile } = useProfile()
  const { setNotifications } = useNotification()

  const [form, setForm] = useState(show)

  const handleSave = () => {
    setProfile({
      ...profile,
      tvlist: profile.tvlist.map(item => item.tv_id === form.tv_id ? form : item)
    })
    userService.progress(form, authTokens)
      .catch(err => {
        setNotifications([{ title: 'Request failed', message: 'Saving progress failed. Try again later.', type: 'error' }])
      })
  }

  const handleModalChange = e => {
    let progress = form.progress[show.progress.length - 1]
    const value = +e.target.value < 0 ? 0 : +e.target.value

    console.log(value)

    progress[e.target.name] = value

    // when episode count is lowered from the max in the final season
    if (e.target.name === 'episode' && value !== form.tv_info.seasons[form.tv_info.seasons.length - 1].episode_count && form.progress[form.progress.length - 1].season === form.tv_info.seasons.length) {
      progress.season = form.tv_info.seasons.length - 1
    }
    // when season counter fills the season count
    if (e.target.name === 'season' && value === form.tv_info.seasons.length)
      progress.episode = form.tv_info.seasons[form.tv_info.seasons.length - 1].episode_count

    // when episode counter fills the season episode count
    if (e.target.name === 'episode' && value >= form.tv_info.seasons[progress.season].episode_count) {
      progress.season += 1
      if (progress.season !== form.tv_info.seasons.length)
        progress.episode = 0
    }

    // episode count is not allowed to be season max other than in the final season when the show is completed
    if (e.target.name === 'season' && progress.episode >= form.tv_info.seasons[value < form.tv_info.seasons.length ? value : value - 1].episode_count && progress.season !== form.tv_info.seasons.length) {
      progress.episode = form.tv_info.seasons[progress.season].episode_count - 1
    }

    let progressCopy = [...form.progress]
    progressCopy[progressCopy.length - 1] = progress

    setForm({
      ...form,
      progress: progressCopy
    })
  }

  const handleWatching = e => {

    console.log(form)
    const value = e.target.value === 'true'
    setForm({
      ...form,
      watching: value
    })
  }


  const handleScore = e => {
    let value = Math.floor(+e.target.value)
    if (value <= 0)
      value = undefined
    else if (value > 100)
      value = 100

    setForm({
      ...form,
      score: value
    })
  }

  return (
    <>
      <Tr></Tr>
      <Tr className={!expanded && 'hidden'}>
        <Td className='flex'>
          <Button
            className='px-3 py-1'
            value='Save'
            onClick={handleSave}
          />
          <Select
            className='w-full'
            onChange={handleWatching}
            options={[
              { value: true, name: ' Watching' },
              { value: false, name: 'Paused' }
            ]}
            value={form.watching}
          />
        </Td>
        <Td className='hidden sm:table-cell'>
          <InputField
            onChange={handleScore}
            type='number'
            name='score'
            className='text-center w-16 py-1'
            size={3}
            value={form.score ? form.score : 0}
          />
        </Td>
        <Td>
          <InputField
            onChange={handleModalChange}
            max={form.tv_info.seasons.length}
            type='number'
            name='season'
            className='text-center w-16 py-1'
            value={form.progress[form.progress.length - 1].season}
          />
        </Td>
        <Td>
          <InputField
            onChange={handleModalChange}
            max={form.tv_info.seasons[form.progress[form.progress.length - 1].season !== form.tv_info.seasons.length ? form.progress[show.progress.length - 1].season : form.tv_info.seasons.length - 1].episode_count}

            type='number'
            name='episode'
            size={3}
            value={form.progress[form.progress.length - 1].episode}
            className='text-center w-16 py-1' />
        </Td>
      </Tr>
    </>
  )
}

export default ProgressExpandedRow