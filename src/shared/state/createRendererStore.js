import createStore from './store'
import { STATE_CHANNEL } from '../constants'
const { ipcRenderer } = window.require('electron')

const createRendererStore = () => {
  console.log('hello')
  console.log(ipcRenderer)
  const store = createStore(false, ipcRenderer)
  ipcRenderer.on(STATE_CHANNEL, (e, action) => {
    store.sync(action)
  })
  return store
}

export default createRendererStore
