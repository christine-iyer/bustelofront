import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import {
  listReviewsStyles as styles,
  isSmallScreen,
  isLargeScreen,
  numColumns
} from "./styles/listReviewStyles";


const { width } = Dimensions.get("window");

interface Comment {
  _id: string;
  text: string;
  likes: number;
  createdAt?: string;
  updatedAt?: string;
}


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
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [showCommentForm, setShowCommentForm] = useState<{ [key: string]: boolean }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<{ reviewId: string; commentId: string } | null>(null);
  const [editReviewData, setEditReviewData] = useState<{ title: string; text: string; author: string; genre: string }>({ title: "", text: "", author: "", genre: "" });
  const [editCommentText, setEditCommentText] = useState<string>("");
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("https://franky-app-ix96j.ondigitalocean.app/api/review");
        console.log("API Response:", response.data);
        console.log("Sample review structure:", response.data?.data?.[0]);
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

  const handleAddComment = async (reviewId: string) => {
    console.log("handleAddComment called for review:", reviewId);

    const commentContent = commentText[reviewId]?.trim();
    if (!commentContent) {
      alert("Please enter a comment before submitting.");
      return;
    }

    try {
      const url = `https://franky-app-ix96j.ondigitalocean.app/api/review/${reviewId}/comment`;
      console.log("Making request to:", url);
      console.log("Sending comment:", commentContent);

      const response = await axios.post(url, { text: commentContent });
      console.log("Comment response:", response.data);

      // Update the reviews state with the new comment
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? {
              ...review,
              comments: [...(review.comments || []), response.data]
            }
            : review
        )
      );

      // Clear the comment form
      setCommentText(prev => ({ ...prev, [reviewId]: "" }));
      setShowCommentForm(prev => ({ ...prev, [reviewId]: false }));

    } catch (error: any) {
      console.error("Error adding comment:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert("Failed to add comment. Please try again.");
    }
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
    console.log("Liking comment:", commentId, "for review:", id);

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
  };

  // New edit review functionality
  const handleEditReview = (review: Review) => {
    setEditingReview(review._id);
    setEditReviewData({
      title: review.title,
      text: review.text,
      author: review.author,
      genre: review.genre
    });
  };

  const handleSaveReview = async (reviewId: string) => {
    try {
      const url = `https://franky-app-ix96j.ondigitalocean.app/api/review/${reviewId}`;
      const response = await axios.put(url, editReviewData);

      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? { ...review, ...editReviewData }
            : review
        )
      );

      setEditingReview(null);
      Alert.alert("Success", "Review updated successfully!");
    } catch (error: any) {
      console.error("Error updating review:", error);
      Alert.alert("Error", "Failed to update review. Please try again.");
    }
  };



  // New edit comment functionality
  const handleEditComment = (reviewId: string, commentId: string, currentText: string) => {
    setEditingComment({ reviewId, commentId });
    setEditCommentText(currentText);
  };

  const handleSaveComment = async () => {
    if (!editingComment) return;

    try {
      // Fixed URL structure - removed '/like' part
      const url = `https://franky-app-ix96j.ondigitalocean.app/api/review/${editingComment.reviewId}/comment/${editingComment.commentId}`;
      await axios.put(url, { text: editCommentText });

      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === editingComment.reviewId
            ? {
              ...review,
              comments: review.comments?.map(comment =>
                comment._id === editingComment.commentId
                  ? { ...comment, text: editCommentText }
                  : comment
              ) || []
            }
            : review
        )
      );

      setEditingComment(null);
      setEditCommentText("");
      Alert.alert("Success", "Comment updated successfully!");
    } catch (error: any) {
      console.error("Error updating comment:", error);
      Alert.alert("Error", "Failed to update comment. Please try again.");
    }
  };
  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("🗑️ Attempting to delete review:", reviewId);
              const url = `https://franky-app-ix96j.ondigitalocean.app/api/review/${reviewId}`;
              console.log("📡 DELETE request URL:", url);

              const response = await axios.delete(url);
              console.log("✅ Delete review response:", response.data);
              console.log("📊 Response status:", response.status);

              setReviews(prevReviews =>
                prevReviews.filter(review => review._id !== reviewId)
              );

              Alert.alert("Success", "Review deleted successfully!");
            } catch (error: any) {
              console.error("❌ Error deleting review:", error);
              console.error("📋 Error details:", error.response?.data);
              console.error("🔢 Error status:", error.response?.status);
              console.error("🌐 Full error response:", error.response);
              Alert.alert("Error", `Failed to delete review: ${error.response?.data?.message || error.message}`);
            }
          }
        }
      ]
    );
  };

  const handleDeleteComment = (reviewId: string, commentId: string) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("🗑️ Attempting to delete comment:", commentId, "from review:", reviewId);
              const url = `https://franky-app-ix96j.ondigitalocean.app/api/review/${reviewId}/comment/${commentId}`;
              console.log("📡 DELETE request URL:", url);

              const response = await axios.delete(url);
              console.log("✅ Delete comment response:", response.data);
              console.log("📊 Response status:", response.status);

              setReviews(prevReviews =>
                prevReviews.map(review =>
                  review._id === reviewId
                    ? {
                      ...review,
                      comments: review.comments?.filter(comment => comment._id !== commentId) || []
                    }
                    : review
                )
              );

              Alert.alert("Success", "Comment deleted successfully!");
            } catch (error: any) {
              console.error("❌ Error deleting comment:", error);
              console.error("📋 Error details:", error.response?.data);
              console.error("🔢 Error status:", error.response?.status);
              console.error("🌐 Full error response:", error.response);
              Alert.alert("Error", `Failed to delete comment: ${error.response?.data?.message || error.message}`);
            }
          }
        }
      ]
    );
  };

  const renderGridItem = ({ item }: { item: Review }) => {
  const cardWidth = isSmallScreen 
    ? width - 32
    : isLargeScreen 
      ? (width - 84) / 3
      : (width - 52) / 2;
  
  const isEditing = editingReview === item._id;
  
  return (
    <View style={styles.gridItem}>
      {/* Add notebook line effect */}
      <View style={styles.notebookLines} />
      
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <>
            {/* Tape pieces for photo effect */}
            <View style={[styles.photoTape, styles.tapeTopLeft]} />
            <View style={[styles.photoTape, styles.tapeTopRight]} />
            <View style={[styles.photoTape, styles.tapeBottomLeft]} />
            <View style={[styles.photoTape, styles.tapeBottomRight]} />
            
            {item.images.length === 1 ? (
              <View style={styles.imageGallery}>
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
              </View>
            ) : (
              <View style={styles.imageGallery}>
                <FlatList
                  data={item.images.filter(img => img && img.trim() !== '')}
                  horizontal
                  pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={cardWidth * 0.85}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  keyExtractor={(image, index) => `${item._id}-${index}`}
                  renderItem={({ item: imageUri }) => (
                    <View style={[styles.imageSlide, { width: cardWidth * 0.85 }]}>
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
                    <View key={index} style={styles.indicator} />
                  ))}
                </View>
              </View>
            )}
          </>
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
        {isEditing ? (
          // Edit form for review
          <View style={styles.editForm}>
            <Text style={styles.labelText}>Title:</Text>
            <TextInput
              style={styles.editInput}
              value={editReviewData.title}
              onChangeText={(text) => setEditReviewData(prev => ({ ...prev, title: text }))}
              placeholder="Review title"
            />
            
            <Text style={styles.labelText}>Author:</Text>
            <TextInput
              style={styles.editInput}
              value={editReviewData.author}
              onChangeText={(text) => setEditReviewData(prev => ({ ...prev, author: text }))}
              placeholder="Book author"
            />
            
            <Text style={styles.labelText}>Genre:</Text>
            <TextInput
              style={styles.editInput}
              value={editReviewData.genre}
              onChangeText={(text) => setEditReviewData(prev => ({ ...prev, genre: text }))}
              placeholder="Book genre"
            />
            
            <Text style={styles.labelText}>Review:</Text>
            <TextInput
              style={[styles.editInput, styles.multilineInput]}
              value={editReviewData.text}
              onChangeText={(text) => setEditReviewData(prev => ({ ...prev, text: text }))}
              placeholder="Your review"
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditingReview(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSaveReview(item._id)}
              >
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Normal review display - UPDATED FORMAT
          <>
            {/* Title - Capitalized and prominent */}
            <Text style={styles.gridTitle}>{item.title.toUpperCase()}</Text>
            
            {/* Author with "By" prefix */}
            <Text style={styles.gridAuthor}>
              By {item.author || item.userId?.username || "Unknown Author"}
            </Text>
            
            {/* Date and time */}
            {(item.createdAt || item.updatedAt) && (
              <Text style={styles.dateText}>
                {new Date(item.createdAt || item.updatedAt || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            )}
            
            {/* Genre tag */}
      
            
            {/* Review text - full content, multiple lines */}
            <Text style={styles.gridText}>
              {item.text}
            </Text>      
            <Text style={styles.gridText}>{item.genre}</Text>
          </>
        )}
      </View>
      
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f0f0f0' }]}
          onPress={() => handleLikeReview(item._id)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>👍</Text>
          <Text style={styles.actionCount}>{item.like || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
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

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setShowCommentForm(prev => ({
              ...prev,
              [item._id]: !showCommentForm[item._id]
            }));
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>✍️</Text>
          <Text style={styles.actionText}>Add</Text>
        </TouchableOpacity>

        {/* Edit Review Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditReview(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>✏️</Text>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        {/* Delete Review Button */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ffebee' }]}
          onPress={() => handleDeleteReview(item._id)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>🗑️</Text>
          <Text style={[styles.actionText, { color: '#d32f2f' }]}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Comment Form */}
      {showCommentForm[item._id] && (
        <View style={styles.commentForm}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write your comment..."
            value={commentText[item._id] || ""}
            onChangeText={(text) => 
              setCommentText(prev => ({ ...prev, [item._id]: text }))
            }
            multiline
            numberOfLines={3}
            maxLength={500}
          />
          <View style={styles.commentFormActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowCommentForm(prev => ({ ...prev, [item._id]: false }));
                setCommentText(prev => ({ ...prev, [item._id]: "" }));
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { opacity: commentText[item._id]?.trim() ? 1 : 0.5 }
              ]}
              onPress={() => handleAddComment(item._id)}
              disabled={!commentText[item._id]?.trim()}
            >
              <Text style={styles.submitButtonText}>Post Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Expanded Comments Section */}
      {expandedComments[item._id] &&
        item.comments?.map((comment) => (
          <View key={comment._id} style={styles.commentContainer}>
            {editingComment?.commentId === comment._id ? (
              // Edit comment form
              <View style={styles.editCommentForm}>
                <TextInput
                  style={styles.commentInput}
                  value={editCommentText}
                  onChangeText={setEditCommentText}
                  multiline
                  numberOfLines={3}
                />
                <View style={styles.commentFormActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setEditingComment(null);
                      setEditCommentText("");
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSaveComment}
                  >
                    <Text style={styles.submitButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // Normal comment display
              <>
                <Text style={styles.commentText}>{comment.text}</Text>
                <View style={styles.commentActions}>
                  <View style={styles.commentLeftActions}>
                    <Text style={styles.commentLikes}>👍 {comment.likes}</Text>
                    <TouchableOpacity
                      style={styles.commentLikeButton}
                      onPress={() => handleLikeComment(item._id, comment._id)}
                    >
                      <Text style={styles.commentLikeText}>Like</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.commentRightActions}>
                    <TouchableOpacity
                      style={styles.commentEditButton}
                      onPress={() => handleEditComment(item._id, comment._id, comment.text)}
                    >
                      <Text style={styles.commentEditText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.commentDeleteButton}
                      onPress={() => handleDeleteComment(item._id, comment._id)}
                    >
                      <Text style={styles.commentDeleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        ))}
    </View>
  );
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
        key={numColumns}
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



export default ListReviews;