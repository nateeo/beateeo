import React from 'react'
import { Router } from 'react-router-dom'

import Routes from '../routes'

const Root = ({ history }) => {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  )
}

export default Root
