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

const ListReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
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

  const renderItem = ({ item }: { item: Review }) => {
    const randomImage =
      item.images && item.images.length > 0
        ? item.images[Math.floor(Math.random() * item.images.length)]
        : null;

    return (
      <View style={styles.reviewContainer}>
        <View style={styles.spine} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>
          By {item.author} ({item.userId ? item.userId.username : "Unknown"})
        </Text>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.genre}>Genre: {item.genre}</Text>
        <Text style={styles.rating}>Rating: {item.rating}/5</Text>
        {randomImage && (
          <Image source={{ uri: randomImage }} style={styles.reviewImage} />
        )}
      </View>
    );
  };

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
      </View>
    );
  };

  if (!reviews) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by title..."
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reviews found.</Text>
        }
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: "#d39d55",
    position: "relative",
  },
  spine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 10,
    height: "100%",
    backgroundColor: "#d39d55",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#3e2723",
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
    color: "#5d4037",
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: "#4e342e",
  },
  genre: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#795548",
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8d6e63",
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
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
    marginTop: 20,
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
});

export default ListReviews;
