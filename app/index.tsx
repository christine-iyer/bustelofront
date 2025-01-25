import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CreateReview from "./components/reviews/CreateReview"; 
import ListReviews from "./components/reviews/ListReviews";
const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Write a Book Review</Text>
<CreateReview />
      <Text style={styles.heading}>Wondering what to read next?</Text>
      <ListReviews />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "green",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
});

export default App;
