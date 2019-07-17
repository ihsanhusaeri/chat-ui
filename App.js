/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Chat from './src/screen/Chat'
import Login from './src/screen/Login'
import Home from './src/screen/Home'
import {AsyncStorage} from 'react-native'
 
 const RootStack = createStackNavigator({
  Login: {screen:Login,
    navigationOptions:{
      header:null
    }
  },
  Home:{screen:Home,
    navigationOptions:{
      header:null
    }
  },
  Chat: {screen:Chat,
    navigationOptions:{
      header:null
    }
  }
 },
 {
   initialRouteName: 'Login'
 }
 );
 const  AppContainer = createAppContainer(RootStack)

 export default class App extends Component{
   render(){
     return <AppContainer/>
   }
 }