import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity,  Alert, Image, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { createReviewStyles } from "./styles/createReviewStyles";
import UploadImage from "./UploadImage";


interface User {
  _id: string;
  username: string;
}

const CreateReview: React.FC = () => {
  const { user } = useAuthContext(); // user = { _id, username }
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [genre, setGenre] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get(`https://franky-app-ix96j.ondigitalocean.app/api/user`)
      .then((res) => {
        console.log("Users API Response:", res.data);
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else {
          console.error("Unexpected API response format:", res.data);
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  }, []);

  const handleSubmit = async () => {
    if (!selectedUser) {
      Alert.alert("Error", "Please select a user in order to write a review!");
      return;
    }
    try {
      const response = await axios.post(`https://franky-app-ix96j.ondigitalocean.app/api/review`, {
        userId: selectedUser,
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
      setAuthor("");
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
      <Text>Select User:</Text>
      <Picker selectedValue={selectedUser} onValueChange={(value) => setSelectedUser(value)}>
        <Picker.Item label="Select a user" value="" />
        {users.length > 0 ? (
          users.map((user) => <Picker.Item key={user._id} label={user.username} value={user._id} />)
        ) : (
          <Picker.Item label="No users found" value="" />
        )}
      </Picker>

      <TextInput style={createReviewStyles.input} placeholder="Required Title" value={title} onChangeText={setTitle} />
      <TextInput style={createReviewStyles.input} placeholder="Optional Author" value={author} onChangeText={setAuthor} />
      <TextInput style={createReviewStyles.input} placeholder="Optional Review" value={text} onChangeText={setText} />
      <TextInput style={createReviewStyles.input} placeholder="Optional Genre" value={genre} onChangeText={setGenre} />
      <TextInput style={createReviewStyles.input} placeholder="Optional Rating (1-5)" keyboardType="numeric"
       value={rating ? rating.toString() : ""} onChangeText={(value) => setRating(parseInt(value) || 0)}/>
      {/* <Picker style={styles.input} selectedValue={genre} onValueChange={(itemValue) => setGenre(itemValue)}>
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
 */}

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
