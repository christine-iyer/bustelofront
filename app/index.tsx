import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Boostelo! We are a Virtue Builder</Text>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
       npm install expo-router flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title:{ textAlign : "center"}
});

export default HomeScreen;
