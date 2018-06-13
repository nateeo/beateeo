import React, { Component } from 'react'
import PropTypes from 'prop-types'

const shallowEqual = (a, b) => {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}

const connect = (
  mapStateToProps = () => ({}),
  mapDispatchToProps = () => ({})
) => Component => {
  class Connected extends Component {
    static contextTypes = {
      store: PropTypes.object,
    }

    onStoreOrPropsChange(props) {
      const { store } = this.context
      const state = store.getState()
      const stateProps = mapStateToProps(state, props)
      const dispatchProps = mapDispatchToProps(store.dispatch, props)
      this.setState({
        ...stateProps,
        ...dispatchProps,
      })
    }

    componentWillMount() {
      const { store } = this.context
      this.onStoreOrPropsChange(this.props)
      this.unsubscribe = store.subscribe(() =>
        this.onStoreOrPropsChange(this.props)
      )
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(this.props, nextProps)) {
        this.onStoreOrPropsChange(nextProps)
      }
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      return <Component {...this.props} {...this.state} />
    }
  }

  return Connected
}

export default connect
