import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Book & User Community!</Text>
      <Button title="Create a User" onPress={() => router.push("/CreateUser")} />
      <Button title="View All Users" onPress={() => router.push("/ListUsers")} />
      <Button title="Write a Book Review" onPress={() => router.push("/CreateReview")} />
      <Button title="Read Book Reviews" onPress={() => router.push("/ListReviews")} />
      <Button title="Read Book Reviews by Author" onPress={() => router.push("/ReviewGrid")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#640D5F" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 30, textAlign: "center", padding: 30 },
});
