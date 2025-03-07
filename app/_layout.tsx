import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Stack, useRouter, Slot } from "expo-router";
import { TimerProvider } from "./TimerContext";
import TimerShape from "./FancyTimer"; // ✅ Import the timer component

export default function Layout() {
  const router = useRouter();

  return (
    <TimerProvider> {/* ✅ Wrap everything inside TimerProvider */}
      <View style={{ flex: 1 }}>
        {/* ✅ Navigation Bar */}
        <View style={styles.navbar}>
          <Button title="Home" onPress={() => router.push("/")} />
          <Button title="Create User" onPress={() => router.push("/CreateUser")} />
          <Button title="Users" onPress={() => router.push("/ListUsers")} />
          <Button title="Create Review" onPress={() => router.push("/CreateReview")} />
          <Button title="List Reviews" onPress={() => router.push("/ListReviews")} />
        </View>

        {/* ✅ The Timer is placed inside the global layout so it appears on all pages */}
        <TimerShape />

        {/* ✅ Ensures pages are rendered dynamically */}
        <Stack screenOptions={{ headerShown: false }}>
          <Slot />
        </Stack>
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
