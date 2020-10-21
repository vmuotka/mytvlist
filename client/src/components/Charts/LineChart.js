import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'

const BarChart = (props) => {
  const chartRef = React.createRef(null)
  const [chart, setChart] = useState(null)
  console.log(props.data)
  useEffect(() => {
    if (chartRef && chartRef.current) {
      let datasets = []
      const colors = ['#7f9cf5', '#f6ad55']
      props.data.data && props.data.data.forEach((dataset, index) =>
        datasets.push({
          label: index === 0 ? 'First Season' : 'Latest Season',
          data: dataset,
          fill: false,
          borderColor: colors[index],
          pointBackgroundColor: Array(dataset.length).fill(colors[index]),
          pointRadius: index === 0 ? 5 : 7,
          pointHitRadius: 10,
        }))

      setChart(new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: props.data.range,
          // datasets: [{
          //   label: props.label && props.label,
          //   data: props.data.map(d => d.value),
          //   fill: false,
          //   borderColor: ['#7f9cf5'],
          //   pointBackgroundColor: Array(props.data.length).fill(['#7f9cf5']),
          //   pointRadius: 5,
          //   pointHitRadius: 10,
          // },]
          datasets: datasets
        },
        options: {
          legend: {
            display: true
          },
          tooltips: {
            displayColors: false
          },
          responsive: true,
          maintainAspectRatio: false,
          spanGaps: true,
          scales: {
            yAxes: [{
              ticks: {
                min: 0,
                suggestedMax: 10
              }
            }]
          }
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