import React, { Component } from 'react'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'

import connect from '../state/connect'

import {
  QUEUE_ADD,
  QUEUE_REMOVE,
  QUEUE_SKIP,
  QUEUE_PAUSE,
  QUEUE_RESUME,
  UPDATE_VOLUME,
} from '../state/actions'

const Layout = styled.div`
  background-color: black;
  width: 100vw;
  height: 100vh;
  color: white;
`

class Dashboard extends Component {
  handleMessages = () => {
    ipcRenderer.send('start')
  }
  render() {
    return (
      <Layout>
        <div onClick={this.handleMessages}>some dashboard</div>
        <div>current volume: {this.props.volume}</div>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  volume: state.volume,
})

const mapDispatchToProps = dispatch => ({
  add: song =>
    dispatch({
      type: QUEUE_ADD,
      payload: song,
    }),
  remove: song =>
    dispatch({
      type: QUEUE_REMOVE,
      payload: song,
    }),
  skip: song =>
    dispatch({
      type: QUEUE_SKIP,
      payload: song,
    }),
  pause: () =>
    dispatch({
      type: QUEUE_PAUSE,
    }),
  pause: () =>
    dispatch({
      type: QUEUE_RESUME,
    }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
