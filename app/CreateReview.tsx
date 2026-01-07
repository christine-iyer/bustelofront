import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { createReviewStyles } from "./styles/createReviewStyles";
import UploadImage from "./UploadImage";
import { useAuthContext } from "./contexts/AuthContext";

const CreateReview: React.FC = () => {
  const { user } = useAuthContext(); // Get the logged-in user
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [genre, setGenre] = useState<string>("");
  const [setting, setSetting] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSubmit = async () => {
    // Validate that user is logged in
    if (!user) {
      Alert.alert("Error", "You must be logged in to create a review!");
      return;
    }

    // Validate required fields
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a strain name!");
      return;
    }

    const payload = {
      title,
      author: user.username,  // Auto-populate from logged-in user
      userId: user._id,       // Auto-populate from logged-in user
      text,
      rating,
      genre,
      setting,
      source,
      format,
      images: imageUrls,
    };
    
    console.log("=== Submitting Review ===");
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("Author (auto-populated):", user.username);
    console.log("Setting:", setting);
    console.log("Source:", source);
    console.log("Format:", format);

    try {
      const response = await axios.post(
        `https://franky-app-ix96j.ondigitalocean.app/api/review`, 
        payload
      );
      
      console.log("Review Created:", response.data);
      Alert.alert("Success", "Review written!");

      // Reset form fields
      setTitle("");
      setText("");
      setGenre("");
      setRating(0);
      setSetting("");
      setSource("");
      setFormat("");
      setImageUrls([]);
    } catch (error: any) {
      console.error("Error creating review:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong!");
    }
  };

  // Show message if user is not logged in
  if (!user) {
    return (
      <View style={createReviewStyles.form}>
        <Text style={createReviewStyles.labelText}>
          Please sign in to create a review.
        </Text>
      </View>
    );
  }

  return (
    <View style={createReviewStyles.form}>
      {/* Display logged-in user info */}
      <View style={{ marginBottom: 16, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
        <Text style={{ fontSize: 14, color: '#666' }}>
          Posting as: <Text style={{ fontWeight: 'bold', color: '#333' }}>{user.username}</Text>
        </Text>
      </View>

      <TextInput 
        style={createReviewStyles.input} 
        placeholder="Required Strain Name" 
        value={title} 
        onChangeText={setTitle} 
      />
      
      <TextInput 
        style={createReviewStyles.input} 
        placeholder="Optional Review" 
        value={text} 
        onChangeText={setText} 
      />
      
      <Picker 
        style={createReviewStyles.input} 
        selectedValue={genre} 
        onValueChange={(itemValue) => setGenre(itemValue)}
      >
        <Picker.Item label="Select Type" value="" />
        <Picker.Item label="Sativa" value="Sativa" />
        <Picker.Item label="Hybrid leans Sativa" value="Hybrid leans Sativa" />
        <Picker.Item label="Indica" value="Indica" />
        <Picker.Item label="Hybrid leans Indica" value="Hybrid leans Indica" />
        <Picker.Item label="Fantasy" value="Fantasy" />
        <Picker.Item label="Hybrid 50-50" value="Hybrid 50-50" />
      </Picker>

      <TextInput 
        style={createReviewStyles.input} 
        placeholder="Optional Setting" 
        value={setting} 
        onChangeText={setSetting} 
      />
      
      <TextInput 
        style={createReviewStyles.input} 
        placeholder="Optional Source" 
        value={source} 
        onChangeText={setSource} 
      />
      
      <Picker 
        style={createReviewStyles.input} 
        selectedValue={format} 
        onValueChange={(itemValue) => setFormat(itemValue)}
      >
        <Picker.Item label="Select Format" value="" />
        <Picker.Item label="Preroll" value="Preroll" />
        <Picker.Item label="Joint" value="Joint" />
        <Picker.Item label="Edible" value="Edible" />
        <Picker.Item label="Concentrate" value="Concentrate" />
        <Picker.Item label="Dispo" value="Dispo" />
      </Picker>

      <TextInput 
        style={createReviewStyles.input} 
        placeholder="Optional Rating (1-5)" 
        keyboardType="numeric"
        value={rating ? rating.toString() : ""} 
        onChangeText={(value) => setRating(parseInt(value) || 0)} 
      />
      
      <UploadImage onUpload={(urls) => {
        console.log("Uploaded image URLs:", urls);
        setImageUrls([...imageUrls, ...urls]);
      }} />

      {imageUrls.length > 0 && (
        <ScrollView horizontal>
          {imageUrls.map((img, index) => (
            <Image 
              key={index} 
              source={{ uri: img }} 
              style={{ width: 80, height: 80, margin: 5 }} 
            />
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