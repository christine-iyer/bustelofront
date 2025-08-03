import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const isSmallScreen = width < 600;
export const isLargeScreen = width >= 1024;
export const numColumns = isSmallScreen ? 1 : isLargeScreen ? 3 : 2;


export const layoutNavStyles = StyleSheet.create({
  navbar: {
  flexDirection: "row",
  justifyContent: "space-around",
  paddingVertical: 12,
  paddingHorizontal: 8,
  backgroundColor: "#fff8e1", // scrapbook paper yellow
  borderBottomWidth: 2,
  borderBottomColor: "#e0b97f",
  shadowColor: "#bfa77a",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.12,
  shadowRadius: 4,
  elevation: 3,
},
button: {
  marginHorizontal: 5,
  backgroundColor: "transparent",
  borderRadius: 0,
  paddingVertical: 6,
  paddingHorizontal: 10,
  alignItems: "center",
  justifyContent: "center",
  borderBottomWidth: 2,
  borderBottomColor: "#e0b97f",
},
buttonText: {
  color: "#b77b2b",
  fontSize: 16,
  fontWeight: "bold",
  fontFamily: "Georgia",
  textDecorationLine: "underline",
  letterSpacing: 0.5,
},
container: {
  flex: 1,
  backgroundColor: "#fed1edff", // scrapbook paper yellow
  padding: 16,
},
title: {
  fontSize: 24,
},})