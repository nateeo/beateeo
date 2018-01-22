import React, { Component } from 'react'
import 'typeface-fredoka-one'
import 'typeface-open-sans'

export default class App extends Component {
  render() {
    return <div>{this.props.children}</div>
  }
}
