import React, { useState, useEffect } from 'react'

// project hooks
import { useProfile } from '../../../context/profile'

// project components
import LineChart from '../../../components/Charts/LineChart'

const ReleaseYearChart = () => {
  const { profile } = useProfile()
  const [data, setData] = useState([])
  useEffect(() => {
    if (profile.tvlist) {
      let started = []
      let ended = []
      profile.tvlist.forEach((show) => {
        let startedFound = false
        let endedFound = false
        for (let i = 0; i < started.length; i++) {
          if (+started[i].x === +show.tv_info.first_air_date.split('-')[0]) {
            started[i].y += 1
            startedFound = true
            break;
          }
        }
        for (let i = 0; i < ended.length; i++) {
          if (+ended[i].x === +show.tv_info.last_air_date.split('-')[0]) {
            ended[i].y += 1
            endedFound = true
            break;
          }
        }
        if (!startedFound) {
          started.push({ y: 1, x: +show.tv_info.first_air_date.split('-')[0] })
        }
        if (!endedFound) {
          ended.push({ y: 1, x: +show.tv_info.last_air_date.split('-')[0] })
        }
      })
      started.sort((a, b) => {
        if (a.x < b.x)
          return -1
        if (a.x > b.x)
          return 1
        return 0
      })
      ended.sort((a, b) => {
        if (a.x < b.x)
          return -1
        if (a.x > b.x)
          return 1
        return 0
      })
      const range = Array(+ended[ended.length - 1].x - +started[0].x + 1).fill().map((_, idx) => +started[0].x + idx)
      for (let i = 0; i < range.length; i++) {
        let startedFound = false
        let endedFound = false
        for (let j = 0; j < started.length; j++) {
          if (range[i] === started[j].x) {
            startedFound = true
            break;
          }
        }
        for (let j = 0; j < ended.length; j++) {
          if (range[i] === ended[j].x) {
            endedFound = true
            break;
          }
        }
        if (!startedFound) {
          started.push({ x: range[i], y: undefined })
        }
        if (!endedFound) {
          ended.push({ x: range[i], y: undefined })
        }
      }
      started.sort((a, b) => {
        if (a.x < b.x)
          return -1
        if (a.x > b.x)
          return 1
        return 0
      })
      ended.sort((a, b) => {
        if (a.x < b.x)
          return -1
        if (a.x > b.x)
          return 1
        return 0
      })
      setData({ range, data: [started, ended] })
    }
  }, [profile])
  return (
    <div classx='relative' style={{ height: '20rem' }}>
      <LineChart data={data} label='Releases' />
    </div>
  )
}

export default ReleaseYearChart