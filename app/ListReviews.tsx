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

// Responsive breakpoints
const isSmallScreen = width < 600; // Tablet/phone breakpoint
const isLargeScreen = width >= 1024; // Desktop breakpoint
const numColumns = isSmallScreen ? 1 : isLargeScreen ? 3 : 2;

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
  comments?: { _id: string; text: string; likes: number }[];
  createdAt?: string;
  updatedAt?: string;
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
        console.log("Sample review structure:", response.data?.data?.[0]);
        setReviews(response.data?.data || []);
        
        // Try to discover available endpoints
        try {
          console.log("Checking if /api/reviews exists...");
          const reviewsResponse = await axios.get("https://franky-app-ix96j.ondigitalocean.app/api/reviews");
          console.log("Reviews endpoint response:", reviewsResponse.data);
        } catch (e) {
          console.log("/api/reviews endpoint not found");
        }
        
        // Check if there's an API documentation endpoint
        try {
          console.log("Checking for API docs...");
          const docsResponse = await axios.get("https://franky-app-ix96j.ondigitalocean.app/api");
          console.log("API docs response:", docsResponse.data);
        } catch (e) {
          console.log("No API docs found");
        }
        
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
    // Responsive card width calculation
    const cardWidth = isSmallScreen 
      ? width - 32 // Single column: full width minus margins
      : isLargeScreen 
        ? (width - 84) / 3 // Three columns
        : (width - 52) / 2; // Two columns
    
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
                onError={(error) => {
                  console.log('Single image load error:', error.nativeEvent.error);
                  console.log('Image URL:', item.images?.[0]);
                }}
                onLoad={() => console.log('Single image loaded successfully:', item.images?.[0])}
                resizeMode="cover"
              />
            ) : (
              // Multiple images - carousel
              <View style={styles.imageGallery}>
                <FlatList
                  data={item.images.filter(img => img && img.trim() !== '')}
                  horizontal
                  pagingEnabled={true}
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
                        onError={(error) => {
                          console.log('Carousel image load error:', error.nativeEvent.error);
                          console.log('Image URL:', imageUri);
                        }}
                        onLoad={() => console.log('Carousel image loaded successfully:', imageUri)}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  contentContainerStyle={styles.imageCarouselContent}
                  style={styles.imageCarousel}
                />
                <View style={styles.imageIndicators}>
                  {item.images.filter(img => img && img.trim() !== '').map((_, index) => (
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
          {(item.createdAt || item.updatedAt) && (
            <>
              <Text style={styles.labelText}>Date:</Text>
              <Text style={styles.dateText}>
                {new Date(item.createdAt || item.updatedAt || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </>
          )}
          <Text style={styles.labelText}>Review:</Text>
          <Text style={styles.gridText} numberOfLines={1}>
            {item.text}
          </Text>
        </View>
        <View style={styles.actionBar}>
          {/* Like Button */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#f0f0f0' }]}
            onPress={() => {
              console.log("Like button pressed for review:", item._id);
              console.log("Current like count:", item.like);
              handleLikeReview(item._id);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>👍</Text>
            <Text style={styles.actionCount}>{item.like || 0}</Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log("Comment button pressed for review:", item._id);
              setExpandedComments((prev) => ({
                ...prev,
                [item._id]: !expandedComments[item._id],
              }));
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>{item.comments?.length || 0}</Text>
          </TouchableOpacity>

          {/* Add Comment Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log("Add comment button pressed for review:", item._id);
              handleAddComment(item._id);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>✍️</Text>
            <Text style={styles.actionText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Expanded Comments Section */}
        {expandedComments[item._id] &&
          item.comments?.map((comment) => (
            <View key={comment._id} style={styles.commentContainer}>
              <Text style={styles.commentText}>{comment.text}</Text>
              <View style={styles.commentActions}>
                <Text style={styles.commentLikes}>👍 {comment.likes}</Text>
                <TouchableOpacity
                  style={styles.commentLikeButton}
                  onPress={() => handleLikeComment(item._id, comment._id)}
                >
                  <Text style={styles.commentLikeText}>Like</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
    );
  };

  const handleAddComment = async (id: string) => {
    console.log("handleAddComment called for review:", id);
    
    // Comments functionality is not implemented in your backend yet
    console.log("Comments feature not available - backend endpoints missing");
    
    // For now, just show a message
    alert("Comments feature not yet implemented on the backend. Please add comment routes and controller methods.");
    
    /* 
    TODO: Once you add comment functionality to your backend, use this:
    
    const testComment = "Test comment from React app";
    console.log("Adding test comment:", testComment);
    
    try {
      const url = `https://franky-app-ix96j.ondigitalocean.app/api/review/${id}/comment`;
      console.log("Making request to:", url);
      const response = await axios.post(url, { text: testComment });
      console.log("Comment response:", response.data);
      
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === id
            ? { ...review, comments: [...(review.comments || []), response.data] }
            : review
        )
      );
    } catch (error: any) {
      console.error("Error adding comment:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
    }
    */
  };

  const handleLikeReview = async (id: string) => {
    console.log("Liking review with ID:", id);
    
    // Find current review to get current like count
    const currentReview = reviews.find(review => review._id === id);
    const newLikeCount = (currentReview?.like || 0) + 1;
    
    // Optimistically update the UI first
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === id ? { ...review, like: newLikeCount } : review
      )
    );
    
    try {
      // Your backend expects a PUT request with the new like count in the body
      const url = `https://franky-app-ix96j.ondigitalocean.app/api/review/${id}`;
      console.log("Making request to:", url);
      console.log("Sending like count:", newLikeCount);
      
      const response = await axios.put(url, { like: newLikeCount });
      console.log("Like response:", response.data);
      console.log("Response status:", response.status);
    } catch (error: any) {
      console.error("Error liking review:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      // Revert state if the request fails
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === id ? { ...review, like: Math.max(0, (currentReview?.like || 0)) } : review
        )
      );
    }
  };

  const handleLikeComment = async (id: string, commentId: string) => {
    // Comment functionality is not implemented in your backend yet
    console.log("Comment like feature not available - backend endpoints missing");
    alert("Comment like feature not yet implemented on the backend.");
    
    /* 
    TODO: Once you add comment functionality to your backend, use this:
    
    try {
      const url = `https://franky-app-ix96j.ondigitalocean.app/api/review/${id}/comment/${commentId}/like`;
      console.log("Liking comment, making request to:", url);
      const response = await axios.post(url);
      console.log("Like comment response:", response.data);
      
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === id
            ? {
              ...review,
              comments: review.comments?.map((comment) =>
                comment._id === commentId
                  ? { ...comment, likes: comment.likes + 1 }
                  : comment
              ) || [],
            }
            : review
        )
      );
    } catch (error: any) {
      console.error("Error liking comment:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
    }
    */
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
        numColumns={numColumns}
        key={numColumns} // Force re-render when columns change
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
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
  row: {
    justifyContent: "space-around",
  },
  gridItem: {
    flex: 1,
    margin: isSmallScreen ? 4 : 8,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
    width: isSmallScreen 
      ? width - 32 // Single column: full width minus margins
      : isLargeScreen 
        ? (width - 84) / 3 // Three columns
        : (width - 52) / 2, // Two columns
  },
  imageContainer: {
    position: "relative",
    width: "100%",
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
    justifyContent: "center",
    alignItems: "center",
  },
  reviewImage: {
    width: "100%",
    height: 150, // Fixed height for consistency
    resizeMode: "cover",
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
    height: 120, // Fixed height only for placeholder
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    color: "#ccc",
  },
  contentContainer: {
    padding: 6,
    minHeight: 60, // Minimal height for text content
  },
  labelText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#888",
    marginTop: 1,
    marginBottom: 0,
    textTransform: "uppercase",
  },
  gridTitle: {
    fontSize: isSmallScreen ? 16 : 14,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#2c2c2c",
    lineHeight: isSmallScreen ? 20 : 16,
  },
  gridAuthor: {
    fontSize: 11,
    fontStyle: "italic",
    marginBottom: 2,
    color: "#666",
  },
  genreTag: {
    fontSize: 9,
    color: "#007AFF",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 3,
    overflow: "hidden",
  },
  gridText: {
    fontSize: isSmallScreen ? 12 : 10,
    color: "#555",
    lineHeight: isSmallScreen ? 16 : 14,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 10,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 2,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fafafa",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
    minWidth: 50,
    minHeight: 36,
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  actionCount: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  actionText: {
    fontSize: 9,
    color: "#666",
    fontWeight: "500",
  },
  commentContainer: {
    margin: 8,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  commentText: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentLikes: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  commentLikeButton: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  commentLikeText: {
    fontSize: 10,
    color: "#007AFF",
    fontWeight: "500",
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