/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './containers/App'

import Dashboard from './containers/Dashboard'
import Login from './containers/Login'

export default props => (
  <App>
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/" component={Login} />
    </Switch>
  </App>
)
