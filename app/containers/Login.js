import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'

import Input from '../components/Input'
import Button from '../components/Button'
import history from '../utils/history'
import colors from '../constants/colors'

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #7b8fd8;
`

const Title = styled.div`
  font-size: 48px;
  font-family: 'Fredoka One', sans-serif;
  color: white;
  user-select: none;
  padding: 15px 30px;
  border-radius: 4px;
  text-align: center;
  position: absolute;
  top: 100px;
`

const Login = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  justify-content: center;
  border-radius: 4px;
  width: 300px;
  background-color: ${colors.secondary};
`

export default class Home extends Component {
  state = {
    token: '',
    loading: false,
    error: false,
  }

  componentDidMount = () => {
    ipcRenderer.on('login', this.handleMainLoginResponse)
  }

  handleTokenChange = e => {
    this.setState({
      token: e.target.value.trim(),
    })
  }

  handleLogin = () => {
    this.setState({ loading: true })
    ipcRenderer.send('login', this.state.token)
  }

  handleMainLoginResponse = (event, status, response) => {
    if (status === 'success') {
      console.log('succesfully logged in')
      history.push('/dashboard')
    } else {
      console.log('error logging in')
      this.setState({
        loading: false,
        error: true,
      })
    }
    // status: 'success' w/ token as response, 'error' w/ empty object as response
  }

  componentWillUnmount = () => {
    ipcRenderer.removeAllListeners('login')
  }

  render() {
    return (
      <Container>
        <Title>Beateeo</Title>
        <Login>
          <Input
            placeholder="Token"
            value={this.state.token}
            onChange={this.handleTokenChange}
          />
          <Button color={colors.primary} onClick={this.handleLogin}>
            Login
          </Button>
        </Login>
      </Container>
    )
  }
}