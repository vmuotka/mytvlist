import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'


const PrivateRoute = ({ component: Component, ...rest }) => {
    const location = useLocation().pathname
    const user = useSelector((state) => state.user)
    return (
        <Route {...rest} render={(props) =>
            user ? (
                <Component {...props} />
            ) : <Redirect to={{ pathname: '/signin', state: { referer: location } }} />
        } />
    )
}

export default PrivateRoute