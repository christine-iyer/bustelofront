import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CreateReview from "./components/reviews/CreateReview"; 
import ListUsers from "./components/users/ListUsers";
const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create User</Text>
<CreateReview />
      <Text style={styles.heading}>User List</Text>
      <ListUsers />
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
