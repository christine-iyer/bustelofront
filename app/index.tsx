import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { layoutNavStyles as layoutNavStyles } from "./styles/layoutNavStyles";


const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={layoutNavStyles.container}>
      <Text style={layoutNavStyles.title}>Welcome to Boostelo! Show us your flores</Text>
    </View>
  );
};



export default HomeScreen;
