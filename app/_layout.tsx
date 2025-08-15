import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack, useRouter, Slot } from "expo-router";
import { layoutNavStyles as layoutNavStyles } from "./styles/layoutNavStyles";
import { AuthProvider } from "./contexts/AuthContext"; // Add this import

export default function Layout() {
  const router = useRouter();

  return (
    <AuthProvider>
    <View style={{ flex: 1 }}>
      {/* ✅ Navigation Bar */}
      <View style={layoutNavStyles.navbar}>
        <TouchableOpacity
          style={layoutNavStyles.button}
          onPress={() => router.push("/")}
        >
          <Text style={layoutNavStyles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={layoutNavStyles.button}
          onPress={() => router.push("/CreateUser")}
        >
          <Text style={layoutNavStyles.buttonText}>Create User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={layoutNavStyles.button}
          onPress={() => router.push("/ListUsers")}
        >
          <Text style={layoutNavStyles.buttonText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={layoutNavStyles.button}
          onPress={() => router.push("/CreateReview")}
        >
          <Text style={layoutNavStyles.buttonText}>Create Review</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={layoutNavStyles.button}
          onPress={() => router.push("/ListReviews")}
        >
          <Text style={layoutNavStyles.buttonText}>List Reviews</Text>
        </TouchableOpacity>
      </View>
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>
    </View>
    </AuthProvider>
  );
}

