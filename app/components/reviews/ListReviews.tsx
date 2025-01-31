// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   FlatList,
//   TextInput,
// } from "react-native";
// import axios from "axios";

// const API_BASE_URL = "http://192.168.1.12:3001/api/review";

// interface Review {
//   _id: string;
//   title: string;
//   author: string;
//   text: string;
//   rating: number;
//   genre: string;
//   userId: { _id: string; username: string } | null;
//   createdAt: Date
// }

// const ListReviews: React.FC = () => {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [editableUserId, setEditableUserId] = useState<string | null>(null);
//   const [tempTitle, setTempTitle] = useState<string>("");
//   const [tempAuthor, setTempAuthor] = useState<string>("");
//   const [tempText, setTempText] = useState<string>("");
//   const [tempRating, setTempRating] = useState<number>(0);
//   const [tempGenre, setTempGenre] = useState<string>("");

//   const fetchReviews = async () => {
//     try {
//       const response = await axios.get(API_BASE_URL);
//       console.log("Fetched Reviews:", response.data); // ✅ Debug API response
  
//       if (Array.isArray(response.data)) {
//         setReviews(response.data); // ✅ If API directly returns an array
//       } else if (Array.isArray(response.data.data)) {
//         setReviews(response.data.data); // ✅ If API wraps the array inside `data`
//       } else if (Array.isArray(response.data.reviews)) {
//         setReviews(response.data.reviews); // ✅ If API wraps the array inside `reviews`
//       } else {
//         console.error("Unexpected API format:", response.data);
//         setReviews([]); // Prevents `.map` error
//       }
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//       Alert.alert("Error", "Failed to fetch reviews.");
//     }
//   };
  
  

//   const handleDelete = async (id: string) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/${id}`);
//       Alert.alert("Success", "Review deleted!");
//       fetchReviews();
//     } catch (error) {
//       Alert.alert("Error", "Failed to delete review.");
//     }
//   };

//   const handleSave = async (id: string) => {
//     try {
//       await axios.put(`${API_BASE_URL}/${id}`, {
//         title: tempTitle,
//         author: tempAuthor,
//         text: tempText,
//         genre: tempGenre,
//         rating: tempRating
//       });
//       Alert.alert("Success", "Review updated!");
//       setEditableUserId(null);
//       fetchReviews();
//     } catch (error) {
//       Alert.alert("Error", "Failed to update review.");
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   const renderItem = ({ item }: { item: Review }) => (
//     <View style={styles.ReviewContainer}>
//       {editableUserId === item._id ? (
//         // Editing mode
//         <>
//           <TextInput
//             style={styles.input}
//             value={tempTitle}
//             onChangeText={setTempTitle}
//           />
//           <TextInput
//             style={styles.input}
//             value={tempAuthor}
//             onChangeText={setTempAuthor}
//           />
//           <TextInput
//             style={styles.input}
//             value={tempText}
//             onChangeText={setTempText}
//             multiline={true}
//             numberOfLines={4}
//           />
//           <TouchableOpacity
//             style={[styles.button, styles.saveButton]}
//             onPress={() => handleSave(item._id)}
//           >
//             <Text style={styles.buttonText}>Save</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.cancelButton]}
//             onPress={() => setEditableUserId(null)}
//           >
//             <Text style={styles.buttonText}>Cancel</Text>
//           </TouchableOpacity>
//         </>
//       ) : (
//         // View mode
//         <>
//           <Text style={styles.text}>
//             {item.title} - {item.author} - {item.text} - {item.genre}. 
//             I give it a {item.rating}. By {item.userId ? item.userId.username : "Unknown"}
//           </Text>
//           <TouchableOpacity
//             style={[styles.button, styles.editButton]}
//             onPress={() => {
//               setEditableUserId(item._id);  // ✅ Set editable review ID
//               setTempTitle(item.title); 
//               setTempAuthor(item.author);
//               setTempText(item.text);
//               setTempGenre(item.genre);
//               setTempRating(item.rating);
//             }}
//           >
//             <Text style={styles.buttonText}>Edit</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.deleteButton]}
//             onPress={() => handleDelete(item._id)}
//           >
//             <Text style={styles.buttonText}>Delete</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );


//   return (
//     <FlatList
//       data={reviews}
//       renderItem={renderItem}
//       keyExtractor={(item) => item._id}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   ReviewContainer: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     marginBottom: 8,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//   },
//   button: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//     marginVertical: 4,
//     alignItems: "center",
//     maxWidth: 100,
//     alignSelf: "flex-end",
//   },
//   saveButton: {
//     backgroundColor: "green",
//   },
//   cancelButton: {
//     backgroundColor: "red",
//   },
//   editButton: {
//     backgroundColor: "blue",
//   },
//   deleteButton: {
//     backgroundColor: "red",
//   },
//   buttonText: {
//     color: "brown",
//     fontWeight: "bold",
//   },
//   boldText: {
//     fontWeight: "bold"
//   }


// });

// export default ListReviews;
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, Animated } from "react-native";
import axios from "axios";

const API_BASE_URL = "http://192.168.1.12:3001/api/review";
const { width } = Dimensions.get("window");

interface Review {
  _id: string;
  title: string;
  author: string;
  text: string;
  rating: number;
  genre: string;
  userId: { _id: string; username: string } | null;
}

const ListReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        setReviews(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, []);

  const renderItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>By {item.author} ({item.userId ? item.userId.username : "Unknown"})</Text>
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.genre}>Genre: {item.genre}</Text>
      <Text style={styles.rating}>Rating: {item.rating}/5</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={reviews}
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
    alignItems: "center",
    justifyContent: "center",
  },
  reviewContainer: {
    width: width * 0.8,
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
});

export default ListReviews;
