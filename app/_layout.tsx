import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Stack, useRouter, Slot } from "expo-router";

export default function Layout() {
  const router = useRouter();

  return (

      <View style={{ flex: 1 }}>
        {/* ✅ Navigation Bar */}
        <View style={styles.navbar}>
          <Button title="Home" onPress={() => router.push("/")} />
          <Button title="Create User" onPress={() => router.push("/CreateUser")} />
          <Button title="Users" onPress={() => router.push("/ListUsers")} />
          <Button title="Create Review" onPress={() => router.push("/CreateReview")} />
          <Button title="List Reviews" onPress={() => router.push("/ListReviews")} />
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
});
