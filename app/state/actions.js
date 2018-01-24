// export action creators

export const QUEUE_ADD = 'QUEUE_ADD'
export const QUEUE_REMOVE = 'QUEUE_REMOVE'
export const QUEUE_SKIP = 'QUEUE_SKIP'
export const QUEUE_PAUSE = 'QUEUE_PAUSE'
export const QUEUE_RESUME = 'QUEUE_RESUME'
export const UPDATE_VOLUME = 'UPDATE_VOLUME'

export const queueAdd = song => ({
  type: QUEUE_ADD,
  payload: song,
})

export const queueRemove = song => ({
  type: QUEUE_REMOVE,
  payload: song,
})

export const queueSkip = () => ({
  type: QUEUE_SKIP,
})

export const queuePause = () => ({
  type: QUEUE_PAUSE,
})

export const queueResume = () => ({
  type: QUEUE_RESUME,
})

export const updateVolume = volume => ({
  type: updateVolume,
  payload: volume,
})
