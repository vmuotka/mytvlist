import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'

const PieChart = (props) => {
  const chartRef = React.createRef(null)
  const [chart, setChart] = useState(null)
  useEffect(() => {
    if (chartRef && chartRef.current) {
      setChart(new Chart(chartRef.current, {
        type: 'pie',
        data: {
          labels: props.data.map(d => d.name),
          datasets: [{
            data: props.data.map(d => d.value),
            backgroundColor: props.colors,
            hoverBackgroundColor: props.colors, // some hover backgrounds are black for some reason, set them to same as backgroundColor fixes this
          },]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      }))
    }
  }, [props.data, props.colors])
  // the chart dissapears when the window is resized, resize function fixes that
  chart && window.addEventListener('resize', () => chart.resize())
  return (
    <>
      <canvas ref={chartRef} />
    </>
  )
}

export default PieChart