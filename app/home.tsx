import React from "react";
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen({  }) {
  return (
    <View >
      <Text>Welcome to the Book & User Community!</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: "#640D5F" },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' , padding: '30px'},
  button: {color: 'red'}
});


