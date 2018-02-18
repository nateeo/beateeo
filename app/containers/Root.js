import React from 'react'
import Electron from 'electron'
import { Router } from 'react-router-dom'

import { createRendererStore } from '../state/store'
import history from '../utils/history'
import Provider from './Provider'
import Routes from '../routes'

const store = createRendererStore(Electron.remote.getCurrentWindow())

const Root = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes />
      </Router>
    </Provider>
  )
}

export default Root
