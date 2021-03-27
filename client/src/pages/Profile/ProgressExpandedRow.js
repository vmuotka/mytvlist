import React, { useState } from 'react'

// project components
import InputField from '../../components/InputField'
import Select from '../../components/Select'
import { Tr, Td } from '../../components/Table'
import Button from '../../components/Button'
import Dots from '../../components/icons/Dots'

// project services
import userService from '../../services/userService'
import { validateProgress } from '../../utils/progress-validation'

// project hooks
import { useAuth } from '../../context/auth'
import { useProfile } from '../../context/profile'
import { useNotification } from '../../context/notification'


const ProgressExpandedRow = ({ show, expanded }) => {
  const { authTokens } = useAuth()
  const { profile, setProfile } = useProfile()
  const { setNotifications } = useNotification()

  const [form, setForm] = useState(show)
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setProfile({
      ...profile,
      tvlist: profile.tvlist.map(item => item.tv_id === form.tv_id ? form : item)
    })
    userService.progress(form, authTokens)
      .then(response => {
        setSaving(false)
      })
      .catch(err => {
        setNotifications([{ title: 'Request failed', message: 'Saving progress failed. Try again later.', type: 'error' }])
      })
  }

  const handleRewatch = () => {
    if (window.confirm(`Are you sure you want to rewatch ${form.tv_info.name}? You wont be able to edit your current watch progress after this.`)) {
      setForm({
        ...form,
        progress: [...form.progress, { season: 0, episode: 0 }]
      })
    }
  }

  const handleModalChange = e => {
    let [progress] = form.progress.slice(-1)
    const value = +e.target.value
    progress[e.target.name] = value

    const episode = e.target.name === 'episode'
    if (episode)
      progress.episode = value
    else
      progress.season = value

    progress = validateProgress(progress, form.tv_info)

    setForm({
      ...form,
      progress: [...form.progress.slice(0, form.progress.length - 1), progress]
    })
  }

  const handleWatching = e => {
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
        <Td className='flex flex-row flex-grow-0 gap-1'>
          <Button
            className='px-3 py-1 self-center'
            value={!saving ? 'Save' : <Dots className='h-6' />}
            onClick={handleSave}
          />
          <Button
            className='px-3 py-1 self-center'
            value='Rewatch'
            color='bg-gradient-to-l from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-700'
            onClick={handleRewatch}
          />
          <Select
            onChange={handleWatching}
            options={[
              { value: true, name: ' Watching' },
              { value: false, name: 'Paused' }
            ]}
            value={form.watching}
          />
        </Td>
        <Td>
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