import React from 'react'

const Heading = ({ className, children }) => {
    const message = children
    return (
        <h1 className={`text-2xl text-gray-700 text-center ${className}`}>{message}</h1>
    )
}

export default Heading