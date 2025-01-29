import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
 import CreateUser from "./components/users/CreateUser";
 import ListUsers from "./components/users/ListUsers";
 import CreateReview from "./components/reviews/CreateReview";
 import ListReviews from "./components/reviews/ListReviews";
//import PlaceholderOne from "./components/placeholderscreens/PlaceHolderOne";
// import PlaceholderTwo from "./components/placeholderscreens/PlaceHolderTwo";
// import PlaceholderThree from "./components/placeholderscreens/PlaceHolderThree";
// import PlaceholderFour from "./components/placeholderscreens/PlaceHolderFour";
import { NavigationIndependentTree } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationIndependentTree>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#f194ff" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Welcome" }} />
        <Stack.Screen name="CreateUser" component={CreateUser} options={{ title: "Create User" }} />
        <Stack.Screen name="ListUsers" component={ListUsers} options={{ title: "All Users" }} />
        <Stack.Screen name="CreateReview" component={CreateReview} options={{ title: "Write a Review" }} />
        <Stack.Screen name="ListReviews" component={ListReviews} options={{ title: "Read Reviews" }} />
      </Stack.Navigator>
    </NavigationContainer>
    </NavigationIndependentTree>
  );
}
