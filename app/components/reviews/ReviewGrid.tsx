import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Picker,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://192.168.1.12:3001/api";

interface Review {
  _id: string;
  username: string;
  reviewText: string;
}

const ReviewGrid: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [selectedUsername, setSelectedUsername] = useState<string>("");

  // Fetch reviews from the API
  const fetchReviews = async () => {
    try {
      const response = await axios.get<Review[]>(`${API_BASE_URL}/review`);
      setReviews(response.data);
      setFilteredReviews(response.data);

      // Extract unique usernames from the reviews
      const uniqueUsernames = Array.from(
        new Set(response.data.map((review) => review.username))
      );
      setUsernames(uniqueUsernames);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter reviews based on the selected username
  useEffect(() => {
    if (selectedUsername) {
      const filtered = reviews.filter(
        (review) => review.username === selectedUsername
      );
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(reviews);
    }
  }, [selectedUsername, reviews]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Review Grid</Text>

      {/* Username Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Username:</Text>
        <Picker
          selectedValue={selectedUsername}
          style={styles.picker}
          onValueChange={(value) => setSelectedUsername(value)}
        >
          <Picker.Item label="All Users" value="" />
          {usernames.map((username) => (
            <Picker.Item key={username} label={username} value={username} />
          ))}
        </Picker>
      </View>

      {/* Review Grid */}
      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item._id}
        numColumns={2} // Number of columns in the grid
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardUsername}>{item.username}</Text>
            <Text style={styles.cardText}>{item.reviewText}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reviews found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  picker: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardUsername: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  cardText: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default ReviewGrid;
