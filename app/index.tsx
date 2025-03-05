import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert, Modal, Pressable } from "react-native";
import TimerShape from "./test";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* ✅ Button to open modal */}
      <Button title="Open Timer" onPress={() => setModalVisible(true)} />

      {/* ✅ Modal Component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Timer Modal</Text>

            {/* Timer Component */}
            <TimerShape />

            {/* Close Modal Button */}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Close Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
