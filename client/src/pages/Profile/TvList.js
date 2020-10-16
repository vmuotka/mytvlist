import React, { useState } from 'react'

// project components
import Select from '../../components/Select'
import TvCard from '../../components/TvCard'


const TvList = ({ profile, setProfile }) => {
  const [orderBy, setOrderBy] = useState('newest')
  const changeOrderBy = e => {
    setOrderBy(e.target.value)
    if (e.target.value !== orderBy) {
      setProfile({
        ...profile,
        tvlist: profile.tvlist.reverse()
      })
    }
  }
  return (
    <div>
      <Select onChange={changeOrderBy} className='w-full' value={orderBy} options={[{ value: 'newest', name: 'Newest' }, { value: 'oldest', name: 'Oldest' }]} label='Sort by' />
      <div className='xl:grid grid-cols-2 gap-5 mt-4 xl:mx-2'>
        {profile.tvlist && profile.tvlist.map(show => <TvCard className='mt-4 xl:mt-0' key={show.tv_id} show={show.tv_info} />)}
      </div>
    </div>
  )
}

export default TvList