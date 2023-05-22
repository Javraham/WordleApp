import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {MaterialCommunityIcons, AntDesign} from '@expo/vector-icons'
import WordleBox from './WordleBox';
import Keyboard from './Keyboard';

export default class App extends React.Component{

  state = {
    restart: false,
    msg: ''
  }

  restartGame = () => {
    this.setState({restart: !this.state.restart})
  }


  render(){
    return (
        <SafeAreaView style={styles.container}>
          <View style = {styles.heading}>
              <TouchableOpacity onPress={() => this.restartGame()}>
                <MaterialCommunityIcons name='restart' size={30} />
              </TouchableOpacity>
              <Text style = {styles.header}>WORDLE</Text>
              <TouchableOpacity>
                <AntDesign name='questioncircleo' size={30} />
              </TouchableOpacity>
          </View>
          <WordleBox restart = {this.state.restart} renderMessage = {(message) => this.setState({msg: message})}/>
        </SafeAreaView>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10
  },

  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '10%',
    width: '100%'
  },

  header: {
    fontSize: 30,
    fontWeight: 600
  },

  keyboard: {
    
  }
});
