import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const { width } = Dimensions.get("window");

interface Review {
  _id: string;
  title: string;
  author: string;
  text: string;
  rating: number;
  genre: string;
  userId: { _id: string; username: string } | null;
  images?: string[];
  like: number;
  comments: { _id: string; text: string; likes: number }[];
}

const ListReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null); // For expanding comments
  const [newComment, setNewComment] = useState<string>(""); // For adding a new comment
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({}); // Track expanded comments
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("https://franky-app-ix96j.ondigitalocean.app/api/review");
        console.log("API Response:", response.data);
        setReviews(response.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = (reviews || []).filter((review) =>
    review.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGridItem = ({ item }: { item: Review }) => {
    const randomImage =
      item.images && item.images.length > 0
        ? item.images[Math.floor(Math.random() * item.images.length)]
        : null;

    return (
      <View style={styles.gridItem}>
        {randomImage && (
          <Image source={{ uri: randomImage }} style={styles.reviewImage} />
        )}
        <Text style={styles.gridTitle}>{item.title}</Text>
        <Text style={styles.gridAuthor}>By {item.author}</Text>
        <Text style={styles.gridText} numberOfLines={3}>
          {item.text}
        </Text>
        <View style={styles.buttonContainer}>
          {/* Like Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLikeReview(item._id)}
          >
            <Text style={styles.buttonText}>Like</Text>
          </TouchableOpacity>
          <Text style={styles.buttonText}>how many likes? {item.like}</Text>

          {/* Comment Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              setExpandedComments((prev) => ({
                ...prev,
                [item._id]: !expandedComments[item._id],
              }))
            }
          >
            <Text style={styles.buttonText}>
              {expandedComments[item._id] ? "Hide Comments" : "Comments"}
            </Text>
          </TouchableOpacity>

          {/* Add Comment Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAddComment(item._id)}
          >
            <Text style={styles.buttonText}>Add Comment</Text>
          </TouchableOpacity>
        </View>

        {/* Expanded Comments Section */}
        {expandedComments[item._id] &&
          item.comments.map((comment) => (
            <View key={comment._id} style={styles.commentContainer}>
              <Text style={styles.commentText}>{comment.text}</Text>
              <Text style={styles.commentLikes}>Likes: {comment.likes}</Text>
              <TouchableOpacity
                style={styles.comment}
                onPress={() => handleLikeComment(item._id, comment._id)}
              >
                <Text style={styles.buttonText}>Like Comment</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>
    );
  };

  const handleAddComment = async (id: string) => {
    if (!newComment.trim()) return;
  
    try {
      const response = await axios.post(
        `https://franky-app-ix96j.ondigitalocean.app/api/review/${id}/comment`,
        { text: newComment }
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === id
            ? { ...review, comments: [...review.comments, response.data] }
            : review
        )
      );
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLikeReview = async (id: string) => {
    console.log("Liking review with ID:", id); // Debugging
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === id ? { ...review, like: review.like + 1 } : review
      )
    );
    try {
      await axios.post(
        `https://franky-app-ix96j.ondigitalocean.app/api/review/${id}/like`
      );
    } catch (error) {
      console.error("Error liking review:", error);
      // Revert state if the request fails
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === id ? { ...review, like: review.like = 0 } : review
        )
      );
    }
  };

  const handleLikeComment = async (id: string, commentId: string) => {
    try {
      await axios.post(
        `https://franky-app-ix96j.ondigitalocean.app/api/review/${id}/comment/${commentId}/like`
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === id
            ? {
                ...review,
                comments: review.comments.map((comment) =>
                  comment._id === commentId
                    ? { ...comment, likes: comment.likes + 1 }
                    : comment
                ),
              }
            : review
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by title..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        data={filteredReviews}
        renderItem={renderGridItem}
        keyExtractor={(item) => item._id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reviews found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText:{
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: "#fff",
  },
  gridContainer: {
    padding: 10,
  },
  gridItem: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: "#fff2af",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: "#d39d55",
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#3e2723",
  },
  gridAuthor: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 5,
    color: "#5d4037",
  },
  gridText: {
    fontSize: 12,
    color: "#4e342e",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#d39d55",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "red",
    fontSize: 12,
    textAlign: "center",
  },
  commentContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  commentLikes: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
});

export default ListReviews;