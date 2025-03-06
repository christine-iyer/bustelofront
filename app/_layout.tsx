import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Stack, useRouter, Slot } from "expo-router";
import { TimerProvider } from "./TimerContext"; // ✅ Import the TimerProvider

export default function Layout() {
  const router = useRouter();

  return (
    <TimerProvider>  {/* ✅ Wrap everything inside TimerProvider */}
      <View style={{ flex: 1 }}>
        {/* Navigation Bar */}
        <View style={styles.navbar}>
          <Button title="Home" onPress={() => router.push("/")} />
          <Button title="Create User" onPress={() => router.push("/CreateUser")} />
          <Button title="Users" onPress={() => router.push("/ListUsers")} />
          <Button title="Write Review" onPress={() => router.push("/CreateReview")} />
          <Button title="Reviews" onPress={() => router.push("/ListReviews")} />
        </View>

        {/* ✅ The main slot where all pages render */}
        <Slot />
      </View>
    </TimerProvider>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#EB5B00",
  },
});
