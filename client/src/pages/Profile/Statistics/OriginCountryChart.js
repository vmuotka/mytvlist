import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../context/profile'

// project components
import PieChart from '../../../components/Charts/PieChart'

const ShowStatusChart = () => {
  const { profile } = useProfile()
  const [data, setData] = useState([])
  useEffect(() => {
    if (profile.tvlist) {
      let arr = []
      profile.tvlist.forEach((show) => {
        let found = false
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].name === show.tv_info.origin_country[0]) {
            found = true
            arr[i].value += 1
          }
        }
        if (!found) {
          arr.push({ name: show.tv_info.origin_country[0] ? show.tv_info.origin_country[0] : 'No data', value: 1 })
        }
      })
      setData(arr)
    }
  }, [profile])
  return (
    <div className='relative h-64'>
      <PieChart data={data} colors={['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391']} />
    </div>
  )
}

export default ShowStatusChart