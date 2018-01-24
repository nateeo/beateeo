// export named actions
// export default REDUCER

const UPDATE_VOLUME = 'UPDATE_VOLUME'

const QUEUE_ADD = 'QUEUE_ADD'

const reducer = (state, action) => {
  const payload = { action }
  switch (action.type) {
    case UPDATE_VOLUME:
      return {
        ...state,
        volume: payload,
      }
      break
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
  }
}

export default reducer

export { UPDATE_VOLUME, QUEUE_ADD }
