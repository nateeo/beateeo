// shared api for renderer and main, validate user action and dispatch correct action
import {
  QUEUE_ADD,
  QUEUE_REMOVE,
  QUEUE_REORDER,
  QUEUE_PAUSE,
  QUEUE_RESUME,
  UPDATE_VOLUME,
} from '../state/actions'

const state = () => store.getState()

let id = 0

export const messageCommands = {
  play: { type: 'queueAdd', args: 1 },
  skip: { type: 'queueSkip', args: 0 },
  pause: { type: 'queuePause', args: 0 },
  resume: { type: 'queueResume', args: 0 },
  volume: { type: 'updateVolume', args: 1 },
}

export default class Commander {
  constructor(store, onError) {
    this.store = store
    this.onError = onError
  }

  queueAdd = song => {
    song.id = id
    id++
    store.dispatch({ type: QUEUE_ADD, payload: song })
  }

  queueRemove = song => {
    store.dispatch({ type: QUEUE_REMOVE, payload: song })
  }

  queueSkip = () => {
    if (state().queue.length > 0) store.dispatch({ type: QUEUE_SKIP })
  }

  queuePause = () => {
    if (state().isPlaying) store.dispatch({ type: QUEUE_PAUSE })
  }

  queueResume = () => {
    if (!state().isPlaying) store.dispatch({ type: QUEUE_RESUME })
  }

  updateVolume = volume => {
    if (volume > 0 && volume <= 100) {
      store.dispatch({ type: UPDATE_VOLUME, payload: volume })
    } else {
      onError('Volume must be between 0 and 100')
    }
  }
}
