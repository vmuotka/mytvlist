import React, { useState } from 'react'

// project components
import Navigation from './components/Navigation'
import AppRouter from './AppRouter'

// project context
import { AuthContext } from './context/auth'

const App = () => {
  let existingTokens = JSON.parse(localStorage.getItem("tokens"))

  const decodedToken = existingTokens ? JSON.parse(window.atob(existingTokens.token.split('.')[1])) : null

  console.log(decodedToken)
  if (decodedToken && Date.now() >= decodedToken.exp * 1000) {
    existingTokens = null
  }

  const [authTokens, setAuthTokens] = useState(existingTokens)

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data))
    setAuthTokens(data)
  }
  return (
    <>
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }} >
        <Navigation />
        <main className='container mt-4 px-4 mx-auto'>
          <AppRouter />
        </main>
      </AuthContext.Provider>
    </>
  )
}

export default App
