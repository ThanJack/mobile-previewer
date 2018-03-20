import React, { Component } from 'react'
import { AsyncStorage, Alert } from 'react-native'
import { SubmissionError } from 'redux-form'
import { NavigationActions } from 'react-navigation'

import { authenticate } from '../../utils/io'
import Form from './LoginForm'

export default class Login extends Component {
  handleLogin = data => {
    console.log("LOGGING IN WITH:", data)
    authenticate(data, async ({ success, sessionToken }) => {
      let { navigation } = this.props

      console.log(success, sessionToken)

      if (!success) {
        // Show errors
        Alert.alert(
          'Invalid email or password',
          'Please check the email and password you entered, and try again.',
          { text: 'OK', onPress: () => {} }
        )

        return
      }

      try {
        await AsyncStorage.setItem('protonSession', sessionToken)
        navigation.dispatch(NavigationActions.back())
      } catch (err) {
        Alert.alert(
          'An error occurred',
          'Please try again',
          { text: 'OK', onPress: () => {} }
        )
      }
    })
  }

  render() {
    return (
      <Form onSubmit={this.handleLogin} />
    )
  }
}
