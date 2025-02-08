
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  ScrollView,
  Image,
  TextInput,
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
}

const ReviewGrid: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://franky-app-ix96j.ondigitalocean.app/api`);
        setReviews(response.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, []);

  // Function to filter reviews based on search query
  const filteredReviews = (reviews || []).filter((review) => review.author &&
    review.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>
        By {item.author} ({item.userId ? item.userId.username : "Unknown"})
      </Text>
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.genre}>Genre: {item.genre}</Text>
      <Text style={styles.rating}>Rating: {item.rating}/5</Text>
      {item.images && item.images.length > 0 && (
        <View

          style={styles.imagesContainer}
        >
          {item.images.map((imageUri, index) => (
            <Image
              key={index}
              source={{ uri: imageUri }}
              style={styles.reviewImage}
            />
          ))}
        </View>
      )}
    </View>
  );
  if (!reviews) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by author..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        ref={flatListRef}
        data={filteredReviews}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#640D5F",
    justifyContent: "center",
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
  reviewContainer: {
    width: width * 0.95,
    backgroundColor: "#fff2af",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: "#df6d2d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  genre: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d39d55",
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d35400",
  },
  imagesContainer: {
    marginTop: 10,
  },
  reviewImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
});

export default ReviewGrid;
