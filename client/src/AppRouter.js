import React from 'react'
import { Switch, Route } from 'react-router-dom'

// project pages
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import SearchTv from './pages/SearchTv'
import SearchUsers from './pages/SearchUsers'
import Profile from './pages/Profile/'
import Discover from './pages/Discover'
import LandingPage from './pages/LandingPage'
import ShowPage from './pages/ShowPage'

// project components
import PrivateRoute from './PrivateRoute'


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
    path: '/show/:id',
    component: ShowPage
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
    component: LandingPage
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