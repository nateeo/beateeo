import createStore from './store'

const createMainStore = browserWindow => {
  const store = createStore(true, browserWindow)
  ipcMain.on(STATE_CHANNEL, (e, action) => {
    store.sync(action)
  })
  return store
}

export default createMainStore
