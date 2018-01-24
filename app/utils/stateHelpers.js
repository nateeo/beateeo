import { ipcMain, ipcRenderer } from 'electron'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import reducer from './actions'

const STATE_CHANNEL = 'state'

const initialState = {
  queue: [],
  volume: 0.15,
  isPlaying: true,
}

const createStore = browserWindow => {
  let state = initialState
  const subscribers = []
  const notify = browserWindow
    ? browserWindow.webContents.send
    : ipcRenderer.send
  const update = action => {
    state = reducer(state, action)
    subscribers.forEach(handler => handler())
  }
  const store = {
    dispatch: action => {
      console.log(`dispatching ${action.type} event`)
      update(action)
      notify(STATE_CHANNEL, action)
    },
    sync: action => {
      console.log(`syncing to ${action.type} event`)
      update(action)
    },
    getState: () => state,
    subscribe: handler => {
      subscribers.push(handler)
      return () => {
        const index = subscribers.indexOf(handler)
        if (index > 0) {
          subscribers.splice(index, 1)
        }
      }
    },
  }
  console.log(`initialised store for ${browserWindow ? 'main' : 'renderer'}`)
  return store
}

// create renderer store and register handler
const createRendererStore = () => {
  const store = createStore()
  ipcRenderer.on(STATE_CHANNEL, (e, action) => {
    store.sync(action)
  })
  return store
}

const createMainStore = browserWindow => {
  const store = createStore(browserWindow)
  ipcMain.on(STATE_CHANNEL, (e, action) => {
    store.sync(action)
  })
  return store
}

const shallowEqual = (a, b) => {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}

const connect = (
  mapStateToProps = () => ({}),
  mapDispatchToProps = () => ({})
) => Component => {
  class Connected extends Component {
    static contextTypes = {
      store: PropTypes.object,
    }

    onStoreOrPropsChange(props) {
      const { store } = this.context
      const state = store.getState()
      const stateProps = mapStateToProps(state, props)
      const dispatchProps = mapDispatchToProps(store.dispatch, props)
      this.setState({
        ...stateProps,
        ...dispatchProps,
      })
    }

    componentWillMount() {
      const { store } = this.context
      this.onStoreOrPropsChange(this.props)
      this.unsubscribe = store.subscribe(() =>
        this.onStoreOrPropsChange(this.props)
      )
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(this.props, nextProps)) {
        this.onStoreOrPropsChange(nextProps)
      }
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      return <Component {...this.props} {...this.state} />
    }
  }

  return Connected
}

export { createRendererStore, createMainStore, connect }
