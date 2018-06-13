import React, { Component } from 'react'

import Login from '../Login'
import Dashboard from '../Dashboard'
import Provider from '../Provider'
import createRendererStore from '../../shared/state/createRendererStore'
import './base.css'

const store = createRendererStore()

export default class Root extends Component {
  state = {
    location: 'dashboard',
  }

  shouldComponentUpdate = (_, nextState) => {
    return nextState.location !== this.state.location
  }

  goTo = location => {
    this.setState({
      location,
    })
  }

  render() {
    let Location

    switch (this.state.location) {
      case 'login':
        Location = Login
        break
      case 'dashboard':
        Location = Dashboard
      default:
        Dashboard
    }

    return (
      <Provider store={store}>
        <Location goTo={this.goTo} />
      </Provider>
    )
  }
}
