import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import TimerShape from "./FancyTimer";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>

 
            <Text style={styles.title}>Timer Modal</Text>

            {/* Timer Component */}
            <TimerShape />


     

      {/* Main Content */}
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
  modalContainer: {  
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // ✅ Dark overlay background
  },
  modalContent: {  
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonClose: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
