// shared api for renderer and main, validate user action and dispatch correct action
import {
  QUEUE_ADD,
  QUEUE_REMOVE,
  QUEUE_REORDER,
  QUEUE_SKIP,
  QUEUE_PAUSE,
  QUEUE_RESUME,
  UPDATE_VOLUME,
} from '../state/actions'

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

  getState = () => {
    return this.store.getState()
  }

  queueAdd = args => {
    console.log(args)
    let songObj
    const song = args[0]
    if (typeof song === 'string') {
      songObj = {
        url: song,
        id: id,
      }
    }
    id++
    this.store.dispatch({ type: QUEUE_ADD, payload: songObj })
  }

  queueRemove = args => {
    this.store.dispatch({ type: QUEUE_REMOVE, payload: song })
  }

  queueSkip = args => {
    if (this.getState().queue.length > 0)
      this.store.dispatch({ type: QUEUE_SKIP })
  }

  queuePause = args => {
    if (this.getState().isPlaying) this.store.dispatch({ type: QUEUE_PAUSE })
  }

  queueResume = args => {
    if (!this.getState().isPlaying) this.store.dispatch({ type: QUEUE_RESUME })
  }

  updateVolume = args => {
    if (volume > 0 && volume <= 100) {
      this.store.dispatch({ type: UPDATE_VOLUME, payload: volume })
    } else {
      onError('Volume must be between 0 and 100')
    }
  }
}
