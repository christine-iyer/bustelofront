import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Stack, useRouter, Slot } from "expo-router";
import { TimerProvider } from "./TimerContext"; // ✅ Ensure correct import

export default function Layout() {
  const router = useRouter();

  return (
    <TimerProvider> {/* ✅ Wrap everything inside TimerProvider */}
      <View style={{ flex: 1 }}>
        <View style={styles.navbar}>
          <Button title="Home" onPress={() => router.push("/")} />
          <Button title="Create User" onPress={() => router.push("/CreateUser")} />
          <Button title="Users" onPress={() => router.push("/ListUsers")} />
        </View>
        <Slot /> {/* ✅ Ensures Timer is available in all screens */}
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
