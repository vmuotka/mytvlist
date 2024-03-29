import React from 'react'
import { Switch, Route } from 'react-router-dom'

// project pages
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Search from './pages/Search'
import Profile from './pages/Profile/'
import Discover from './pages/Discover'
import LandingPage from './pages/LandingPage'
import ShowPage from './pages/ShowPage/'
import ActorPage from './pages/ActorPage'
import Activity from './pages/Activity'
import UserSettings from './pages/UserSettings'
import MoviePage from './pages/MoviePage'

// project components
import PrivateRoute from './PrivateRoute'

// project hooks
import { useAuth } from './context/auth'

const AppRouter = () => {
  const { authTokens } = useAuth()
  const publicRoutes = [
    {
      path: '/show/:id',
      component: ShowPage
    },
    {
      path: '/movie/:id',
      component: MoviePage
    },
    {
      path: '/actor/:id',
      component: ActorPage
    },
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
  ]

  const privateRoutes = [
    {
      path: '/discover',
      component: Discover
    },
    {
      path: '/user_settings',
      component: UserSettings
    }
  ]

  if (authTokens)
    privateRoutes.push({
      path: '/',
      component: Activity
    })
  else
    publicRoutes.push({
      path: '/',
      component: LandingPage
    })

  return (
    <Switch>
      {
        privateRoutes.map((route, index) =>
          <PrivateRoute exact key={index} path={route.path} component={route.component} />
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