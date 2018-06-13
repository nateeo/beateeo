import React, { Component } from 'react'
import styled from 'styled-components'

import Input from '../../components/Input'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const Title = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  color: white;
`

export default class Login extends Component {
  goToDashboard = () => {
    this.props.goTo('dashboard')
  }
  render() {
    return (
      <Container>
        <Title>Beateeo</Title>
        <Input onChange={this.goToDashboard} />
      </Container>
    )
  }
}
