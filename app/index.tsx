import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CreateUserForm from "./components/CreateUserForm"; 
const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create User</Text>
<CreateUserForm />
      <Text style={styles.heading}>User List</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "yellow",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
});

export default App;
