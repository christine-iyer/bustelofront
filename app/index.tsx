import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Boostelo! Show us your favorites</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"green",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { textAlign: "center", 
    backgroundColor: "#EB5B00"
  }
});

export default HomeScreen;
