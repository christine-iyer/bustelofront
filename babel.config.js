module.exports = {
     presets: ["babel-preset-expo"], // Use babel-preset-expo for Expo apps
     plugins: [
       [
         "module:react-native-dotenv",
         {
           moduleName: "@env",
           path: ".env",
           safe: true,
           allowUndefined: false,
         },
       ],
       "expo-router/babel", // Ensure this is included for expo-router
     ],
   };
   