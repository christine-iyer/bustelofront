import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="CreateUser" options={{ title: "Create User" }} />
      <Stack.Screen name="ListUsers" options={{ title: "All Users" }} />
      <Stack.Screen name="CreateReview" options={{ title: "Write a Review" }} />
      <Stack.Screen name="ListReviews" options={{ title: "Read Reviews" }} />
      <Stack.Screen name="ReviewGrid" options={{ title: "Search Reviews" }} />
    </Stack>
  );
}
