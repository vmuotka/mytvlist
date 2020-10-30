import React from 'react'
import { Switch, Route } from 'react-router-dom'

// project pages
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import SearchTv from './pages/SearchTv'
import SearchUsers from './pages/SearchUsers'
import Profile from './pages/Profile/'
import Discover from './pages/Discover'

// project components
import PrivateRoute from './PrivateRoute'

import Placeholdercomponent from './components/placeholdercomponent'

const privateRoutes = [
  {
    path: '/discover',
    component: Discover
  },
]


const publicRoutes = [
  {
    path: '/search/tv',
    component: SearchTv
  },
  {
    path: '/search/users',
    component: SearchUsers
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