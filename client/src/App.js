import React from 'react'

// project components
import Navigation from './components/Navigation'
import AppRouter from './AppRouter'

const App = () => {
  return (
    <>
      <Navigation />
      <main className='container mt-4 px-4 mx-auto'>
        <AppRouter />
      </main>
    </>
  )
}

export default App
