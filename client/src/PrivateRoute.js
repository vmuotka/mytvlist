import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'

// project hooks
import { useAuth } from './context/auth'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authTokens } = useAuth()
  const location = useLocation().pathname
  return (
    <Route {...rest} render={(props) =>
      authTokens ? (
        <Component {...props} />
      ) : <Redirect to={{ pathname: '/signin', state: { referer: location } }} />
    } />
  )
}

export default PrivateRoute