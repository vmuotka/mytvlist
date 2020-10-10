import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

const routes = [
  {
    path: '/discover',
    component: <h1>Discover!</h1>
  },
  {
    path: '/search',
    component: <h1>Search</h1>
  },
  {
    path: '/',
    component: <h1>Home!</h1>
  }
]

const AppRouter = () => {
  return (
    <Switch>
      {
        routes.map((route, index) =>
          <Route key={index} path={route.path} render={() => route.component} />
        )
      }
    </Switch>
  )
}

export default AppRouter