import React, { useState } from "react";
import { View, Button, Image, Alert, ActivityIndicator, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqjhgnivi/image/upload";
const UPLOAD_PRESET = "crystal";

interface UploadImageProps {
  onUpload: (urls: string[]) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onUpload }) => {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Allow multiple selection if supported
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...selectedImages]); // Append new images
      uploadImages(selectedImages);
    }
  };

  const uploadImages = async (uris: string[]) => {
    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const uri of uris) {
        let formData = new FormData();
        formData.append("file", {
          uri,
          type: "image/jpeg",
          name: "upload.jpg",
        } as any);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Cloudinary response:", response.data);
        uploadedUrls.push(response.data.secure_url);
      }

      onUpload(uploadedUrls); // Pass the array of URLs back to the parent
      Alert.alert("Success", "Images uploaded successfully!");
    } catch (error) {
      Alert.alert("Upload Failed", "Error uploading images");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <Button title="Pick Images" onPress={pickImages} />
      <ScrollView horizontal>
        {images.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={{ width: 80, height: 80, margin: 5 }} />
        ))}
      </ScrollView>
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default UploadImage;
