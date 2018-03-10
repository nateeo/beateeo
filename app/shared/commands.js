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

import ytdl from 'ytdl-core'
import { getInfo } from 'ytdl-getinfo'

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/

let id = 0

export const messageCommands = {
  play: { type: 'queueAdd', args: -1 },
  skip: { type: 'queueSkip', args: 0 },
  pause: { type: 'queuePause', args: 0 },
  resume: { type: 'queueResume', args: 0 },
  volume: { type: 'updateVolume', args: 1 },
  queue: { type: 'printQueue', args: 0 },
}

export default class Commander {
  constructor(store, message) {
    this.store = store
    this.message = message
  }

  getState = () => {
    return this.store.getState()
  }

  queueAdd = args => {
    let songObj
    let song = args[0]
    if (ytdl.validateURL(song)) {
      songObj = {
        url: song,
        id: id,
      }
      this.onQueueAdd(songObj)
    } else {
      const searchSong = args.join(' ')
      console.log('search is ' + searchSong)
      getInfo(searchSong).then(info => {
        songObj = {
          url: 'https://www.youtube.com/watch?v=' + info.items[0].id,
          id: id,
        }
        this.onQueueAdd(songObj)
      })
    }
  }

  onQueueAdd = songObj => {
    console.log(songObj)
    ytdl.getInfo(songObj.url, (error, info) => {
      if (!error) {
        songObj.title = info.title
        songObj.time = info.length_seconds
        this.store.dispatch({ type: QUEUE_ADD, payload: songObj })
        id++
      } else {
        console.log('ytdl error: ' + error.message)
      }
    })
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
      message('Volume must be between 0 and 100')
    }
  }

  printQueue = args => {
    let queue = 'Song queue:'
    this.getState().queue.forEach((song, index) => {
      queue += '\n' + index + ': ' + song.title
    })
    this.message(queue)
  }
}
