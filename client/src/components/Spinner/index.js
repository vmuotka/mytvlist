import React from 'react'
import './spinner.css'

const Spinner = ({ color, show, className }) => {
  if (show) {
    return (
      <div className={`spinner ${className}`}>
        <div className={`rect1 ${color}`}></div>
        <div className={`rect2 ${color}`}></div>
        <div className={`rect3 ${color}`}></div>
        <div className={`rect4 ${color}`}></div>
        <div className={`rect5 ${color}`}></div>
      </div>
    )
  } else {
    return null
  }
}

export default Spinner