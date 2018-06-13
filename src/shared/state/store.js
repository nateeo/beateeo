import reducer from './reducer'
import { STATE_CHANNEL } from 'constants'

const initialState = {
  queue: [],
  volume: 0.15,
  isPlaying: true,
  messageEnabled: true,
}
// target is either BrowserWindow (for main store) or ipcRenderer (for renderer store)
const createStore = (isMain, target) => {
  let state = initialState
  const subscribers = []
  const notify = isMain
    ? target.webContents.send.bind(target.webContents)
    : target.send
  const update = action => {
    state = reducer(state, action)
    if (!state) {
      console.log('INVALID STATE PRODUCED')
      console.log(action.type.toString())
    }
    subscribers.forEach(handler => handler(action.type))
  }
  const store = {
    dispatch: action => {
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
  console.log(`initialised store for ${isMain ? 'main' : 'renderer'}`)
  return store
}

export default createStore
