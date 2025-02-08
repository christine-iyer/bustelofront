import { Stack } from "expo-router";

export default function RootLayout() {
  console.log("Loading Stack...");

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="CreateUser" options={{ title: "Create User" }} />
      <Stack.Screen name="ListUsers" options={{ title: "List Users" }} />
      <Stack.Screen name="CreateReview" options={{ title: "Create Review" }} />
      <Stack.Screen name="ListReviews" options={{ title: "List Reviews" }} />
      <Stack.Screen name="ReviewGrid" options={{ title: "Review Grid" }} />
    </Stack>
  );
}
