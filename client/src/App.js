import React from 'react'

// project components
import Navigation from './components/Navigation'
import AppRouter from './AppRouter'

const App = () => {
  return (
    <>
      <Navigation />
      <main><AppRouter /></main>
    </>
  )
}

export default App
