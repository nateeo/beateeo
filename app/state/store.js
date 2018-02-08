import { ipcMain, ipcRenderer } from 'electron'
import reducer from './reducer'

const STATE_CHANNEL = 'state'

const initialState = {
  queue: [],
  volume: 0.15,
  isPlaying: true,
  messageEnabled: true,
}

const createStore = browserWindow => {
  let state = initialState
  const subscribers = []
  const notify = browserWindow
    ? browserWindow.webContents.send
    : ipcRenderer.send
  console.log('notify is ')
  console.log(notify)
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

export { createRendererStore, createMainStore }
