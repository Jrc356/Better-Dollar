/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    // eslint-disable-next-line no-use-before-define
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
