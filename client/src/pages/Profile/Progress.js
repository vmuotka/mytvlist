import React from 'react'

// project components
import { Table, Thead, Tbody } from '../../components/Table'
import ProgressTableRow from './ProgressTableRow'

const Progress = ({ profile, setProfile }) => {
  return (
    <div>
      <p className='text-gray-600 text-lg ml-2 mb-2'>Watching</p>
      <Table headers={['Show', 'Season', 'Episode']}>
        <Thead headers={['Show', 'Season', 'Episode']} />
        <Tbody>
          {profile.tvlist && profile.tvlist.map(show =>
            <ProgressTableRow key={show.id} show={show} profile={profile} setProfile={setProfile} />
          )}
        </Tbody>
      </Table>
    </div>
  )
}

export default Progress