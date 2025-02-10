import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dqjhgnivi/image/upload";
const UPLOAD_PRESET = "crystal";

interface UploadImageProps {
  onUpload: (urls: string[]) => void;
}

// Helper to determine MIME type and file name based on file extension.
const getMimeTypeAndFileName = (uri: string) => {
  const parts = uri.split(".");
  const ext = parts[parts.length - 1].toLowerCase();
  let mimeType = "";
  let fileName = "";
  switch (ext) {
    case "pdf":
      mimeType = "application/pdf";
      fileName = "upload.pdf";
      break;
    case "heic":
      mimeType = "image/heic";
      fileName = "upload.heic";
      break;
    case "jpeg":
    case "jpg":
      mimeType = "image/jpeg";
      fileName = "upload.jpg";
      break;
    default:
      mimeType = "application/octet-stream";
      fileName = "upload.bin";
  }
  return { mimeType, fileName };
};

const UploadImage: React.FC<UploadImageProps> = ({ onUpload }) => {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Change to 'All' if you want to support more than just images.
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Map selected assets to their URI strings.
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...selectedImages]);
      uploadImages(selectedImages);
    }
  };

  const uploadImages = async (uris: string[]) => {
    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const uri of uris) {
        const formData = new FormData();
        let file: any;
        if (Platform.OS === "web") {
          // On web, convert the local URL into a Blob.
          const response = await fetch(uri);
          file = await response.blob();
        } else {
          // For native, create the file object.
          const { mimeType, fileName } = getMimeTypeAndFileName(uri);
          file = { uri, type: mimeType, name: fileName };
        }
        
        // For web, even when using Blob, we pass a file name as the third parameter.
        const { mimeType, fileName } = getMimeTypeAndFileName(uri);
        formData.append("file", file, fileName);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Cloudinary Response:", data);

        const imageUrl = data.secure_url || data.url;
        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        } else {
          console.warn("No URL returned for image:", data);
        }
      }

      onUpload(uploadedUrls);
      Alert.alert("Success", "Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      Alert.alert("Upload Failed", "Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <Button title="Option to add photos" onPress={pickImages} />
      <ScrollView horizontal>
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={{ width: 80, height: 80, margin: 5 }}
          />
        ))}
      </ScrollView>
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default UploadImage;
