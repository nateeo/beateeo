// export named actions
// export default REDUCER

const QUEUE_ADD = 'QUEUE_ADD'
const QUEUE_REMOVE = 'QUEUE_REMOVE'
const QUEUE_SKIP = 'QUEUE_SKIP'

const UPDATE_VOLUME = 'UPDATE_VOLUME'

const reducer = (state, action) => {
  const payload = { action }
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
      return {
        ...state,
        volume: payload,
      }
      break
  }
}

export default reducer

export { UPDATE_VOLUME, QUEUE_ADD }
