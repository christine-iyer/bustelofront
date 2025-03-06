import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import TimerShape from "./FancyTimer"; // ✅ Correct component name
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer Modal</Text>

      {/* ✅ Directly use TimerShape WITHOUT wrapping it in TimerProvider */}
      <TimerShape />

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
});

export default HomeScreen;
