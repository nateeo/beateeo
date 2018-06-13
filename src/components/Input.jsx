import React, { Component } from 'react'
import styled from 'styled-components'

const CustomInput = styled.input`
  outline: none;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid grey;
  margin: 5px;
`

const Input = props => <CustomInput {...props} />

export default Input
