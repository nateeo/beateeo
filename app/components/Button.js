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
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  transition: all 70ms ease-out;
  background: ${props => props.color};
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
