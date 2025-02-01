// To add photo upload functionality to CreateReview.tsx using Cloudinary in React Native, follow these steps:

// 🔹 Steps to Add Image Upload
// Install Dependencies
// You'll need react-native-image-picker to allow users to pick an image.

// sh
// Copy
// Edit
// npm install react-native-image-picker
// Modify CreateReview.tsx to include:

// Image picker for selecting an image
// Uploading the image to Cloudinary
// Storing the Cloudinary URL in the review
// 🚀 Updated CreateReview.tsx with Image Upload
// tsx
// Copy
// Edit
// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import axios from "axios";
// import { launchImageLibrary } from "react-native-image-picker"; // ✅ Import Image Picker

// const API_BASE_URL = "http://192.168.1.12:3001/api/review";

// interface User {
//   _id: string;
//   username: string;
// }

// const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload"; // ✅ Replace with your Cloudinary cloud name
// const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // ✅ Replace with your Cloudinary upload preset

// const CreateReview: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [title, setTitle] = useState<string>("");
//   const [author, setAuthor] = useState<string>("");
//   const [text, setText] = useState<string>("");
//   const [rating, setRating] = useState<number>(0);
//   const [genre, setGenre] = useState<string>("");
//   const [image, setImage] = useState<string | null>(null); // ✅ Store uploaded image URL

//   // Fetch users
//   useEffect(() => {
//     axios.get("http://192.168.1.12:3001/api/user")
//       .then(res => setUsers(Array.isArray(res.data) ? res.data : res.data.users || []))
//       .catch(err => console.error("Error fetching users:", err));
//   }, []);

//   // ✅ Image Picker Function
//   const selectImage = () => {
//     launchImageLibrary({ mediaType: "photo" }, async (response) => {
//       if (response.didCancel) return;
//       if (response.errorCode) return Alert.alert("Error", response.errorMessage || "Something went wrong!");

//       if (response.assets && response.assets.length > 0) {
//         const selectedAsset = response.assets[0];
//         await uploadImage(selectedAsset.uri); // ✅ Upload to Cloudinary
//       }
//     });
//   };

//   // ✅ Upload Image to Cloudinary
//   const uploadImage = async (imageUri: string) => {
//     const formData = new FormData();
//     formData.append("file", { uri: imageUri, type: "image/jpeg", name: "upload.jpg" });
//     formData.append("upload_preset", UPLOAD_PRESET); // Required by Cloudinary

//     try {
//       const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setImage(response.data.secure_url); // ✅ Save uploaded image URL
//       Alert.alert("Success", "Image uploaded!");
//     } catch (error) {
//       console.error("Upload Error:", error);
//       Alert.alert("Error", "Image upload failed!");
//     }
//   };

//   // ✅ Submit Review with Image
//   const handleSubmit = async () => {
//     if (!selectedUser) return Alert.alert("Error", "Please select a user!");

//     try {
//       await axios.post(API_BASE_URL, { 
//         userId: selectedUser, 
//         title, author, text, rating, genre, image 
//       });

//       Alert.alert("Success", "Review created!");
//       setTitle(""); setAuthor(""); setText(""); setGenre(""); setRating(0); setImage(null);
//     } catch (error: any) {
//       console.error("Error creating review:", error.response?.data || error);
//       Alert.alert("Error", error.response?.data?.message || "Something went wrong!");
//     }
//   };

//   return (
//     <View style={styles.form}>
//       <Picker selectedValue={selectedUser} onValueChange={setSelectedUser}>
//         <Picker.Item label="Select a user" value="" />
//         {users.map(user => (
//           <Picker.Item key={user._id} label={user.username} value={user._id} />
//         ))}
//       </Picker>

//       <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
//       <TextInput style={styles.input} placeholder="Author" value={author} onChangeText={setAuthor} />
//       <TextInput style={styles.input} placeholder="Text" value={text} onChangeText={setText} />
//       <TextInput style={styles.input} placeholder="Rating (1-5)" keyboardType="numeric"
//         value={rating ? rating.toString() : ""} onChangeText={(value) => setRating(parseInt(value) || 0)} />

//       <Picker selectedValue={genre} onValueChange={setGenre}>
//         <Picker.Item label="Select Genre" value="" />
//         <Picker.Item label="Action" value="Action" />
//         <Picker.Item label="Adventure" value="Adventure" />
//         <Picker.Item label="Comedy" value="Comedy" />
//         <Picker.Item label="Drama" value="Drama" />
//         <Picker.Item label="Fantasy" value="Fantasy" />
//         <Picker.Item label="Horror" value="Horror" />
//         <Picker.Item label="Mystery" value="Mystery" />
//         <Picker.Item label="Romance" value="Romance" />
//       </Picker>

//       {/* ✅ Image Upload Button */}
//       <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
//         <Text style={styles.buttonText}>Upload Photo</Text>
//       </TouchableOpacity>

//       {/* ✅ Show Selected Image */}
//       {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Submit Review</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   form: {
//     padding: 16,
//     backgroundColor: "#f9f9f9",
//   },
//   input: {
//     height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 8, paddingHorizontal: 8, borderRadius: 4,
//   },
//   button: {
//     paddingVertical: 12, backgroundColor: "#007bff", borderRadius: 4, alignItems: "center", marginTop: 10,
//   },
//   uploadButton: {
//     paddingVertical: 12, backgroundColor: "#28a745", borderRadius: 4, alignItems: "center", marginBottom: 10,
//   },
//   buttonText: {
//     color: "#fff", fontWeight: "bold",
//   },
//   imagePreview: {
//     width: 200, height: 200, borderRadius: 10, alignSelf: "center", marginVertical: 10,
//   },
// });

// export default CreateReview;
// 🔹 Features of this Code
// ✅ Allows user to pick an image from their device
// ✅ Uploads image to Cloudinary and gets the URL
// ✅ Stores the URL in the review before submitting
// ✅ Shows a preview of the selected image

// 🔹 Cloudinary Setup (Important)
// Sign up for Cloudinary at cloudinary.com (Free tier available).
// Get your Cloud Name & Upload Preset from Cloudinary Dashboard.
// Replace YOUR_CLOUD_NAME and YOUR_UPLOAD_PRESET in the code.
// 🚀 Next Steps
// Modify the backend to store the image field in reviews.
// Allow multiple image uploads by changing image to images: string[].
// Improve UI by adding an image gallery in ListReviews.tsx.