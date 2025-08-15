import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { createReviewStyles } from "./styles/createReviewStyles";
import UploadImage from "./UploadImage";
import { useAuthContext } from "./contexts/AuthContext"; // Add this import

const CreateReview: React.FC = () => {
  const { user } = useAuthContext(); // user = { _id, username }
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [genre, setGenre] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);



  const handleSubmit = async () => {

    try {
      const response = await axios.post(`https://franky-app-ix96j.ondigitalocean.app/api/review`, {
        title,
        author: user.username,
        userId: user._id, // Ensure userId is set correctly
        text,
        rating,
        genre,
        images: imageUrls, // Send multiple images
      });
      console.log("Review Created:", response.data);
      Alert.alert("Success", "Review written!");

      // Reset form fields
      setTitle("");
      setText("");
      setGenre("");
      setRating(0);
      setImageUrls([]);
    } catch (error: any) {
      console.error("Error creating review:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <View style={createReviewStyles.form}>

      <TextInput style={createReviewStyles.input} placeholder="Required Title" value={title} onChangeText={setTitle} />
      <TextInput style={createReviewStyles.input} placeholder="Optional Review" value={text} onChangeText={setText} />
      <Picker style={createReviewStyles.input} selectedValue={genre} onValueChange={(itemValue) => setGenre(itemValue)}>
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

      <TextInput style={createReviewStyles.input} placeholder="Optional Rating (1-5)" keyboardType="numeric"
        value={rating ? rating.toString() : ""} onChangeText={(value) => setRating(parseInt(value) || 0)} />
      <UploadImage onUpload={(urls) => {
        console.log("Uploaded image URLs:", urls);
        setImageUrls([...imageUrls, ...urls]);
      }} />


      {imageUrls.length > 0 && (
        <ScrollView horizontal>
          {imageUrls.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={{ width: 80, height: 80, margin: 5 }} />
          ))}
        </ScrollView>
      )}
      <TouchableOpacity style={createReviewStyles.button} onPress={handleSubmit}>
        <Text style={createReviewStyles.buttonText}>Submit your Details</Text>
      </TouchableOpacity>
    </View>
  );
};


export default CreateReview;
