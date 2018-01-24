import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createRendererStore } from '../utils/stateHelpers'
import Provider from './Provider'
import Routes from '../routes'

const store = createRendererStore()

const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  )
}

export default Root
