import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { TimerProvider } from "./TimerContext"; // ✅ Ensure correct import

export default function Layout() {
  const router = useRouter();

  return (
    <TimerProvider> {/* ✅ Wrap everything inside TimerProvider */}
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="CreateUser" options={{ title: "Create User" }} />
        <Stack.Screen name="ListUsers" options={{ title: "Users" }} />
        <Stack.Screen name="CreateReview" options={{ title: "Write Review" }} />
        <Stack.Screen name="ListReviews" options={{ title: "Reviews" }} />
      </Stack>
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
