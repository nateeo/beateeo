import {
  QUEUE_ADD,
  QUEUE_REMOVE,
  QUEUE_SKIP,
  QUEUE_REORDER,
  QUEUE_PAUSE,
  QUEUE_RESUME,
  UPDATE_VOLUME,
} from './actions'

export default (state, action) => {
  if (!action) return state
  console.log('REDUCER <prevState, action>')
  console.log(state)
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
      const newState = {
        ...state,
        queue: state.queue.slice(1),
      }
      console.log('new')
      console.log(newState.toString())
      return newState
      break
    case QUEUE_REORDER:
      return {
        ...state,
        queue: payload,
      }
      break
    case UPDATE_VOLUME:
      return {
        ...state,
        volume: payload,
      }
      break
    default:
      console.log('INVALID ACTION TYPE ' + action.type)
      return state
  }
}
