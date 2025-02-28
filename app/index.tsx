import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import TimerModal from "./components/TimerModal"; 
import { useRouter } from "expo-router";
const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router= useRouter()

  return (
    <View style={styles.container}>
      <Button title="Open Timer" onPress={() => setModalVisible(true)} />

      {/* Timer Modal */}
      <TimerModal isVisible={modalVisible} onClose={() => setModalVisible(false)} />

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
