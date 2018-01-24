import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from '../utils/stateHelpers'

const Layout = styled.div`
  background-color: black;
  width: 100vw;
  height: 100vh;
  color: white;
`

class Dashboard extends Component {
  render() {
    console.log(this.props)
    return (
      <Layout>
        <div onClick={this.props.updateVolume}>some dashboard</div>
        <div>current volume: {this.props.volume}</div>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  volume: state.volume,
})

const mapDispatchToProps = dispatch => ({
  updateVolume: () =>
    dispatch({
      type: 'UPDATE_VOLUME',
      payload: 0.3,
    }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
