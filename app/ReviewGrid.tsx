import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";

const API_BASE_URL = "http://192.168.1.12:3001/api/review";

interface Review {
  _id: string;
  title: string;
  author: string;
  text: string;
  rating: number;
  genre: string;
  userId: { _id: string; username: string } | null;
  images?: string[];
}

const ReviewGrid: React.FC = () => {
  const { title: selectedBookTitle = "" } = useLocalSearchParams();
  const router = useRouter();

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await axios.get(API_BASE_URL);
      return response.data.data;
    },
  });

  const bookTitles = useMemo(() => {
    if (!reviews) return [];
    return Array.from(new Set(reviews.map((review) => review.title)));
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    return selectedBookTitle
      ? reviews.filter((review) => review.title === selectedBookTitle)
      : reviews;
  }, [reviews, selectedBookTitle]);

  const handleTitleChange = (title: string) => {
    router.replace({
      pathname: "/FilteredReviews",
      params: { title },
    });
  };

  if (isLoading) return <ActivityIndicator size="large" color="blue" />;
  if (error) return <Text style={styles.error}>Failed to load reviews.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reviews</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Book Title:</Text>
        <Picker
          selectedValue={selectedBookTitle}
          style={styles.picker}
          onValueChange={handleTitleChange}
        >
          <Picker.Item label="All Books" value="" />
          {bookTitles.map((title, index) => (
            <Picker.Item key={`${title}-${index}`} label={title} value={title} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardAuthor}>by {item.author}</Text>
            <Text style={styles.cardUsername}>
              Reviewed by: {item.userId?.username || "Unknown"}
            </Text>
            <Text style={styles.cardText}>{item.text}</Text>
            <Text style={styles.cardRating}>⭐ {item.rating}/5</Text>
            <Text style={styles.cardGenre}>Genre: {item.genre}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No reviews found.</Text>}
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
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardAuthor: {
    fontSize: 16,
    color: "#555",
  },
  cardUsername: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  cardRating: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    color: "gold",
  },
  cardGenre: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  error: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
});

export default ReviewGrid;
