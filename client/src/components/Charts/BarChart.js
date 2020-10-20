import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'

const BarChart = (props) => {
  const chartRef = React.createRef(null)
  const [chart, setChart] = useState(null)
  useEffect(() => {
    if (chartRef && chartRef.current) {
      setChart(new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: props.data.map(d => d.name),
          datasets: [{
            data: props.data.map(d => d.value),
            backgroundColor: ['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391', '#fc8181', '#63b3ed', '#d53f8c', '#f6e05e', '#805ad5', '#d53f8c', '#e53e3e', '#48bb78', '#38b2ac', '#667eea', '#ed64a6', '#d69e2e'],
            hoverBackgroundColor: ['#f687b3', ' #f6ad55', '#4fd1c5', '#68d391', '#fc8181', '#63b3ed', '#d53f8c', '#f6e05e', '#805ad5', '#d53f8c', '#e53e3e', '#48bb78', '#38b2ac', '#667eea', '#ed64a6', '#d69e2e'],
          },]
        },
        options: {
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      }))
    }
    // eslint-disable-next-line
  }, [props.data, props.colors])
  // the chart dissapears when the window is resized, resize function fixes that
  chart && window.addEventListener('resize', () => chart.resize())
  return (
    <>
      <canvas ref={chartRef} />
    </>
  )
}

export default BarChart