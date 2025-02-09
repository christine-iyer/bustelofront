import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

const CreateUserForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const API_URL = "https://franky-app-ix96j.ondigitalocean.app/api/user";


  const handleSubmit = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields ar, well just username, so we can highlight your talent!");
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      Alert.alert("Success", "User created successfully!");
      console.log("Response:", response.data);
      
      // Reset fields
      setUsername("");
      setEmail("");
      setPassword("");

    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong! Please try again."
      );
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Skip Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Skip Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 16,
    paddingHorizontal: 10,
    borderStyle: "solid",
  },
  input: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#EB5B00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateUserForm;
