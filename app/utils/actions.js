// export named actions
// export default REDUCER

const QUEUE_ADD = 'QUEUE_ADD'
const QUEUE_REMOVE = 'QUEUE_REMOVE'
const QUEUE_SKIP = 'QUEUE_SKIP'
const QUEUE_PAUSE = 'QUEUE_PAUSE'
const QUEUE_RESUME = 'QUEUE_RESUME'

const UPDATE_VOLUME = 'UPDATE_VOLUME'

const reducer = (state, action) => {
  console.log('in reducer')
  console.log('action is')
  console.log(action)
  const payload = action.payload
  switch (action.type) {
    case QUEUE_ADD:
      return {
        ...state,
        queue: state.queue.concat(payload),
      }
      break
    case QUEUE_SKIP:
      return {
        ...state,
        queue: state.queue.slice(1),
      }
      break
    case UPDATE_VOLUME:
      const newState = {
        ...state,
        volume: payload,
      }
      console.log('new state')
      console.log(newState)
      return newState
      break
    default:
      console.log('INVALID ACTION TYPE ' + action.type)
  }
}

export default reducer

export {
  QUEUE_ADD,
  QUEUE_REMOVE,
  QUEUE_SKIP,
  QUEUE_PAUSE,
  QUEUE_RESUME,
  UPDATE_VOLUME,
}
