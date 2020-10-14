import React from 'react'
import { Switch, Route } from 'react-router-dom'

// project pages
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Search from './pages/Search'
import Profile from './pages/Profile'

// project components
import PrivateRoute from './PrivateRoute'

import Placeholdercomponent from './components/placeholdercomponent'

const privateRoutes = [
  {
    path: '/discover',
    component: Placeholdercomponent
  },
]


const publicRoutes = [
  {
    path: '/search',
    component: Search
  },
  {
    path: '/signup',
    component: SignUp
  },
  {
    path: '/signin',
    component: SignIn
  },
  {
    path: '/user/:username',
    component: Profile
  },
  {
    path: '/',
    component: Placeholdercomponent
  }
]


const AppRouter = () => {
  return (
    <Switch>
      {
        privateRoutes.map((route, index) =>
          <PrivateRoute key={index} path={route.path} component={route.component} />
        )
      }
      {
        publicRoutes.map((route, index) =>
          <Route key={index} path={route.path} component={route.component} />
        )
      }
    </Switch>
  )
}

export default AppRouter