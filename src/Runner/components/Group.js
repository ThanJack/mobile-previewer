import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import ActionWrapper from './ActionWrapper'

export default class Group extends Component {
  render() {
    let { object, children, component, styleOverrides } = this.props

    return (
      <ActionWrapper component={component} object={object}>
        <View style={[styles.group, styleOverrides]} pointerEvents="box-none">
          {children}
        </View>
      </ActionWrapper>
    )
  }
}

const styles = StyleSheet.create({
  group: {
    position: 'absolute',
    left: 0,
    top: 0
  }
})
