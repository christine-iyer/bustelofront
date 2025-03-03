import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import { useRouter } from "expo-router";
const HomeScreen = () => {
  
  const router= useRouter()

  return (
    <View style={styles.container}>
      

      {/* Timer Modal */}
      

      <Text style={styles.title}>Welcome to Boostelo!</Text>
      <Button title="Create a User" onPress={() => router.push("./CreateUser")} />
      <Button title="View All Users" onPress={() => router.push("./ListUsers")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
});

export default HomeScreen;
