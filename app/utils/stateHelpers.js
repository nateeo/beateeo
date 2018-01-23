import { ipcMain, ipcRenderer } from 'electron'
import reducer from './actions'

const STATE_CHANNEL

const initialState = {}

const createStore = (browserWindow) => {
  const notify = browserWindow ? browserWindow.webContents.send : ipcRenderer.send
  let state = initialState
  const subscribers = []
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
    }
    subscribe: handler => {
      subscribers.push(handler)
      return () => {
        const index = subscribers.indexOf(handler)
        if (index > 0) {
          subscribers.splice(index, 1)
        }
      }
    }
  }
  console.log(`initialised store for ${browserWindow ? 'main' : 'renderer'}`)
  return store
}

// create renderer store and register handler
const createRendererStore = () => {
  store = createStore()
  ipcRenderer.on(STATE_CHANNEL, (e, action) => {
    store.sync(action)
  })
  return store
}

const createMainStore = (browserWindow) => {
  store = createStore(browserWindow)
  ipcMain.on(STATE_CHANNEL, (e, action) => {
    store.sync(action)
  })
  return store
}

export {
  createRendererStore,
  createMainStore,
}
