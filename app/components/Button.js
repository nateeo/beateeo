import React from 'react'
import styled from 'styled-components'

import colors from '../constants/colors'

const Container = styled.div`
  height: 37px;
  margin: 5px;
  display: flex;
  align-items: center;
`

const Layout = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  color: white;
  justify-content: center;
  opacity: ${props => (props.loading ? 0.5 : 1)};
  align-items: center;
  pointer-events: ${props => (props.loading ? 'none' : 'all')};
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  transition: all 70ms ease-out;
  background: ${props => (props.loading ? '#737f8d' : props.color)};
  &:hover {
    background: ${props => props.colorShade};
  }
`

const Button = props => (
  <Container>
    <Layout {...props} />
  </Container>
)

export default Button
