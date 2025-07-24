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
    const cardWidth = (width - 52) / 2; // More precise card width calculation
    
    // Debug logging
    console.log('Rendering card for:', item.title, 'Images:', item.images?.length || 0);
    
    return (
      <View style={styles.gridItem}>
        <View style={styles.imageContainer}>
          {item.images && item.images.length > 0 ? (
            item.images.length === 1 ? (
              // Single image - simple display
              <Image 
                source={{ uri: item.images[0] }} 
                style={styles.reviewImage}
                onError={(error) => console.log('Single image load error:', error)}
                onLoad={() => console.log('Single image loaded successfully')}
              />
            ) : (
              // Multiple images - carousel
              <View style={styles.imageGallery}>
                <FlatList
                  data={item.images}
                  horizontal
                  pagingEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={cardWidth}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  keyExtractor={(image, index) => `${item._id}-${index}`}
                  renderItem={({ item: imageUri }) => (
                    <View style={[styles.imageSlide, { width: cardWidth }]}>
                      <Image 
                        source={{ uri: imageUri }} 
                        style={styles.reviewImage}
                        onError={(error) => console.log('Carousel image load error:', error)}
                        onLoad={() => console.log('Carousel image loaded successfully')}
                      />
                    </View>
                  )}
                  contentContainerStyle={styles.imageCarouselContent}
                  style={styles.imageCarousel}
                />
                <View style={styles.imageIndicators}>
                  {item.images.map((_, index) => (
                    <View
                      key={index}
                      style={styles.indicator}
                    />
                  ))}
                </View>
              </View>
            )
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>📚</Text>
            </View>
          )}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
          {item.images && item.images.length > 1 && (
            <View style={styles.imageCountBadge}>
              <Text style={styles.imageCountText}>{item.images.length} 📷</Text>
            </View>
          )}
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.labelText}>Title:</Text>
          <Text style={styles.gridTitle}>{item.title}</Text>
          <Text style={styles.labelText}>Author:</Text>
          <Text style={styles.gridAuthor}>
            {item.userId?.username || item.author || "Unknown Author"}
          </Text>
          <Text style={styles.labelText}>Genre:</Text>
          <Text style={styles.genreTag}>{item.genre}</Text>
          <Text style={styles.labelText}>Review:</Text>
          <Text style={styles.gridText} numberOfLines={1}>
            {item.text}
          </Text>
        </View>
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
                style={styles.button}
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
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reviews found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText: {
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
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
    minHeight: 350,
    maxWidth: (width - 52) / 2, // Ensure consistent width
  },
  imageContainer: {
    position: "relative",
    height: 100,
  
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
  imageGallery: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  imageCarousel: {
    width: "100%",
    height: "100%",
  },
  imageCarouselContent: {
    alignItems: "flex-start",
  },
  imageSlide: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    backgroundColor: "#f8f8f8",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: 2,
  },
  imageCountBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  imageCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    color: "#ccc",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 12,
    flex: 1,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
    marginTop: 2,
    marginBottom: 1,
    textTransform: "uppercase",
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2c2c2c",
    lineHeight: 20,
  },
  gridAuthor: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 4,
    color: "#666",
  },
  genreTag: {
    fontSize: 11,
    color: "#fff",
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 6,
    overflow: "hidden",
  },
  gridText: {
    fontSize: 12,
    color: "#555",
    lineHeight: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginHorizontal: 2,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  commentContainer: {
    margin: 8,
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
  comment: {
    backgroundColor: "#007AFF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
});

export default ListReviews;