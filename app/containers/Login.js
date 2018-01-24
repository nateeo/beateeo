import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Input from '../components/Input'
import Button from '../components/Button'

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
  render() {
    console.log(this.props)
    return (
      <Container>
        <Title>Beateeo</Title>
        <Login>
          <Input placeholder="Token" />
          <Button color={colors.primary} colorShade={colors.primaryShade}>
            Login
          </Button>
        </Login>
      </Container>
    )
  }
}
