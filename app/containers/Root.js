import React from 'react'
import { Router } from 'react-router-dom'

import { createRendererStore } from '../utils/stateHelpers'
import Provider from './Provider'
import Routes from '../routes'

const store = createRendererStore()

const Root = ({ history }) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes />
      </Router>
    </Provider>
  )
}

export default Root
