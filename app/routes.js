/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './containers/App'
import Login from './containers/Login'

const LoginWithProps = props => <Login {...props} />

export default props => (
  <App>
    <Switch>
      <Route path="/" render={LoginWithProps} />
    </Switch>
  </App>
)
