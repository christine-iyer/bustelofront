import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useRouter, Slot } from "expo-router";

export default function Layout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/CreateUser")}
        >
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/ListUsers")}
        >
          <Text style={styles.buttonText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/CreateReview")}
        >
          <Text style={styles.buttonText}>Create Review</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/ListReviews")}
        >
          <Text style={styles.buttonText}>List Reviews</Text>
        </TouchableOpacity>
      </View>
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#EB5B00",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "rgba(25, 255, 255, 0.8)",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 16,
    fontWeight: "bold",
  },
});