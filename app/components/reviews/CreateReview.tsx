import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

// Replace localhost with your machine's IP address
const API_BASE_URL = "http://localhost:3001/api/review";

const CreateReview: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [genre, setGenre] = useState<string>("");

  const handleSubmit = async () => {
    if (!title || !author || !text || !genre || rating <= 0) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      await axios.post(API_BASE_URL, { title, author, text, rating, genre });
      Alert.alert("Success", "Review written!");
      setTitle("");
      setAuthor("");
      setText("");
      setGenre("");
      setRating(0);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <View style={styles.form}>
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
        placeholder="Rating"
        value={rating.toString()}
        onChangeText={(value) => setRating(Number(value))}
        keyboardType="numeric"
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
