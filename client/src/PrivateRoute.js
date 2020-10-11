import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'

// project hooks
import { useAuth } from './context/auth'

const PrivateRoute = ({ component, ...rest }) => {
  const { authTokens } = useAuth()
  const location = useLocation().pathname
  return (
    <Route {...rest} render={(props) =>
      authTokens ? (
        component
      ) : <Redirect to={{ pathname: '/signin', state: { referer: location } }} />
    } />
  )
}

export default PrivateRoute