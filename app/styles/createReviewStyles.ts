
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const isSmallScreen = width < 600;
export const isLargeScreen = width >= 1024;

export const createReviewStyles = StyleSheet.create({
button: {
     backgroundColor: "transparent",
  padding: 0,
  borderRadius: 0,
  alignItems: "center",
  elevation: 0,
  shadowColor: "transparent",
},
buttonText: {
       color: "#4682B4", // or any link color you like
  fontWeight: "bold",
  textDecorationLine: "underline",
  fontFamily: "Georgia",
  fontSize: 15,
},
input: {
     height: 40,
     borderColor: "#ccc",
     borderWidth: 1,
     marginBottom: 10,
     paddingHorizontal: 10,
     borderRadius: 5,
},
form:      {
     padding: 20,
     backgroundColor: "#f9f9f9",
     borderRadius: 5,
     shadowColor: "#000",
     shadowOffset: {
         width: 0,
         height: 2,
     },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 2,
}});
