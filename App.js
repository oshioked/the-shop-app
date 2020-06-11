import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style = {styles.boxes}></View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'android'? 'blue' : 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxes: {
    height: 200,
    width: '50%',
    margin: 10,
    backgroundColor: 'black'
  }
});
