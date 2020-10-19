import React, { useState, useEffect } from 'react'

// project components
import { Table, Thead, Tbody, Th } from '../../components/Table'
import ProgressTableRow from './ProgressTableRow'
import Checkbox from '../../components/Checkbox/'
import Button from '../../components/Button'

// project services
import userService from '../../services/userService'

// project hooks
import { useAuth } from '../../context/auth'

const ProgressTable = ({ list, handleModal, setProfile, profile }) => {
  const [editMode, setEditmode] = useState(false)
  const [selected, setSelected] = useState([])
  const { authTokens } = useAuth()

  const decodedToken = authTokens ? JSON.parse(window.atob(authTokens.token.split('.')[1])) : null
  const myProfile = decodedToken ? decodedToken.id === profile.id : false

  useEffect(() => {
    let arr = []
    list.array.forEach(show => {
      arr.push({ selected: false, show })
    })
    setSelected(arr)
  }, [list])

  const handleEditMode = e => {
    setEditmode(e.target.checked)
  }

  const handleSelect = e => {
    const show_id = +e.target.name
    let selectedCopy = [...selected]
    selectedCopy[selectedCopy.map(a => a.show.tv_id).indexOf(show_id)].selected = e.target.checked
    setSelected(selectedCopy)
  }

  const handleComplete = () => {
    const sel = selected.filter(a => a.selected === true)
    sel.forEach(async show => {
      show = show.show
      show.progress[show.progress.length - 1] = { season: show.tv_info.seasons.length, episode: show.tv_info.seasons[show.tv_info.seasons.length - 1].episode_count }
      setProfile({
        ...profile,
        tvlist: profile.tvlist.map(list => list.tv_id === show.tv_id ? show : list)
      })
      try {
        await userService.progress(show, authTokens)
      } catch (err) {
        console.error(err)
      }
    })
  }

  const handleReset = () => {
    const sel = selected.filter(a => a.selected === true)
    sel.forEach(async show => {
      show = show.show
      show.progress[show.progress.length - 1] = { season: 0, episode: 0 }
      setProfile({
        ...profile,
        tvlist: profile.tvlist.map(list => list.tv_id === show.tv_id ? show : list)
      })
      try {
        await userService.progress(show, authTokens)
      } catch (err) {
        console.error(err)
      }
    })
  }

  const handlePause = () => {
    const sel = selected.filter(a => a.selected === true)
    sel.forEach(async show => {
      show = show.show
      show.watching = !show.watching
      setProfile({
        ...profile,
        tvlist: profile.tvlist.map(list => list.tv_id === show.tv_id ? show : list)
      })
      try {
        await userService.progress(show, authTokens)
      } catch (err) {
        console.error(err)
      }
    })
  }


  return (
    <>
      {
        (list.array.length > 0 && selected.length > 0) && <div key={list.name} className='mt-4'>
          <p className='text-gray-600 text-lg ml-2 mb-2'>{list.name} ({list.array.length} shows)</p>
          {myProfile && <div className='flex text-gray-700 gap-1 my-1'>
            <Checkbox onChange={handleEditMode} checked={editMode} label='Edit mode' className='ml-1 py-1' />
            {
              editMode &&
              <span>
                <Button value='Complete' onClick={handleComplete} className='inline px-2 py-1 text-sm ml-1' />
                <Button value='Reset' onClick={handleReset} className='inline px-2 py-1 text-sm ml-1' />
                <Button value='Pause/Unpause' onClick={handlePause} className='inline px-2 py-1 text-sm ml-1' />
              </span>
            }
          </div>}
          <Table className='table-fixed'>
            <Thead>
              <tr>
                <Th>Show</Th>
                <Th>Season</Th>
                <Th>Episode</Th>
              </tr>
            </Thead>
            <Tbody>
              {list.array.map((show) =>
                <ProgressTableRow editMode={editMode} handleSelect={handleSelect} handleModal={handleModal} key={show.id} show={show} profile={profile} setProfile={setProfile} />
              )}
            </Tbody>
          </Table>
        </div>
      }
    </>
  )
}

export default ProgressTable