import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://192.168.0.49:3001/api/review";

interface Review {
  _id: string;
  title: string;
  author: string;
  text: string;
  rating: number;
  genre: string;
  userId: { _id: string; username: string } | null;
  createdAt: Date
}

const ListReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempAuthor, setTempAuthor] = useState<string>("");
  const [tempText, setTempText] = useState<string>("");
  const [tempRating, setTempRating] = useState<number>(0);
  const [tempGenre, setTempGenre] = useState<string>("");

  const fetchReviews = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      console.log("Fetched Reviews:", response.data); // Debug the API response
      setReviews(response.data); // Access the `data` property
    } catch (error) {
      console.error(error); // Log detailed error for debugging
      Alert.alert("Error", "Failed to fetch reviews.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      Alert.alert("Success", "Review deleted!");
      fetchReviews();
    } catch (error) {
      Alert.alert("Error", "Failed to delete review.");
    }
  };

  const handleSave = async (id: string) => {
    try {
      await axios.put(`${API_BASE_URL}/${id}`, {
        title: tempTitle,
        author: tempAuthor,
        text: tempText,
        genre: tempGenre,
        rating: tempRating
      });
      Alert.alert("Success", "Review updated!");
      setEditableUserId(null);
      fetchReviews();
    } catch (error) {
      Alert.alert("Error", "Failed to update review.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderItem = ({ item }: { item: Review }) => (
    <View style={styles.ReviewContainer}>
      {/* {editableUserId === item._id ? ( */}
        <>
          <TextInput
            style={styles.input}
            value={tempTitle}
            onChangeText={setTempTitle}
          />
          <TextInput
            style={styles.input}
            value={tempAuthor}
            onChangeText={setTempAuthor}
          />
          <TextInput
            style={styles.input}
            value={tempText}
            onChangeText={setTempText}
            multiline={true}
            numberOfLines={4}
          />
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={() => handleSave(item._id)}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setEditableUserId(null)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>
            {item.title} - {item.author} - {item.text} - {item.genre}. I give it a {item.rating}. By {item.userId ? item.userId.username : "Unknown"} {"\n"} 
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => {
              setEditableUserId(item._id);
              setTempTitle(item.title);
              setTempAuthor(item.author);
              setTempText(item.text);
              setTempGenre(item.genre);
              setTempRating(item.rating)
            }}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item._id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </>
      )
    </View>
  );

  return (
    <FlatList
      data={reviews}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    />
  );
};

const styles = StyleSheet.create({
  ReviewContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 4,
    alignItems: "center",
    maxWidth: 100,
    alignSelf: "flex-end",
  },
  saveButton: {
    backgroundColor: "green",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  editButton: {
    backgroundColor: "blue",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "brown",
    fontWeight: "bold",
  },


});

export default ListReviews;
