import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

// Replace localhost with your machine's IP address
const API_BASE_URL = "http://192.168.1.12:3001/api/review";
//leah's 192.168.1.12
//chris' 192.168.0.49

interface User {
  _id: string;
  username: string;
}

const CreateReview: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [genre, setGenre] = useState<string>("");

  useEffect(() => {
    axios.get("http://192.168.1.12:3001/api/user")
      .then(res => {
        console.log("Users API Raw Response:", res.data); // Log full response
        if (Array.isArray(res.data)) {
          setUsers(res.data); // ✅ If API returns an array
        } else if (Array.isArray(res.data.users)) {
          setUsers(res.data.users); // ✅ If API wraps users inside an object
        } else {
          console.error("Unexpected API response format:", res.data);
          setUsers([]); // Prevent .map() error
        }
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setUsers([]); // Ensure it's an array even on error
      });
  }, []);
  const handleSubmit = async () => {
    if (!selectedUser) {
      Alert.alert("Error", "Please select a user in order to write a review!");
      return;
    }
    try {
      const response = await axios.post(API_BASE_URL, {  // ✅ Corrected the API request
        userId: selectedUser, 
        title, 
        author, 
        text, 
        rating: Number(rating), 
        genre
      });
      console.log("Review Created:", response.data); // ✅ Debugging response
      Alert.alert("Success", "Review written!");
      
      // Reset form fields
      setTitle("");
      setAuthor("");
      setText("");
      setGenre("");
      setRating(0);
    } catch (error: any) {
      console.error("Error creating review:", error.response?.data || error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong!"
      );
    }
  };
  

  return (
    <View style={styles.form}>
      {/* <Text>Select User:</Text> */}
      <Picker selectedValue={selectedUser} onValueChange={(value) => setSelectedUser(value)}>
        <Picker.Item label="Select a user" value="" />
        {users.map((user) => (
          <Picker.Item key={user._id} label={user.username} value={user._id} />
        ))}
      </Picker>
      
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Text"
        value={text}
        onChangeText={setText}
      />
      <TextInput
  style={styles.input}
  placeholder="Rating (1-5)"
  keyboardType="numeric"
  value={rating ? rating.toString() : ""}
  onChangeText={(value) => setRating(parseInt(value) || 0)}
/>
      <Picker
        style={styles.input}
        selectedValue={genre}
        onValueChange={(itemValue) => setGenre(itemValue)}
      >
        <Picker.Item label="Select Genre" value="" />
        <Picker.Item label="Action" value="Action" />
        <Picker.Item label="Adventure" value="Adventure" />
        <Picker.Item label="Comedy" value="Comedy" />
        <Picker.Item label="Drama" value="Drama" />
        <Picker.Item label="Fantasy" value="Fantasy" />
        <Picker.Item label="Horror" value="Horror" />
        <Picker.Item label="Mystery" value="Mystery" />
        <Picker.Item label="Romance" value="Romance" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit your Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  button: {
    paddingVertical: 12,
    backgroundColor: "#007bff",
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CreateReview;