import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { layoutNavStyles } from "./styles/layoutNavStyles";
import { useAuthContext } from "./contexts/AuthContext";
import GoogleSignInButton from "./components/Auth/GoogleSignInButton";

const HomeScreen = () => {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View style={[layoutNavStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={{ marginTop: 16, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={layoutNavStyles.container}>
      <Text style={layoutNavStyles.title}>
        Welcome to Boostelo! Show us your flores
      </Text>
      
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.welcome}>Welcome back, {user.username}! 🌺</Text>
          {user.avatar && (
            <Image 
              source={{ uri: user.avatar }} 
              style={styles.avatar}
            />
          )}
          {user.email && (
            <Text style={styles.email}>{user.email}</Text>
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.signInContainer}>
          <Text style={styles.subtitle}>Sign in to create and view reviews</Text>
          <GoogleSignInButton />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    alignItems: 'center',
    marginTop: 32,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#4285F4',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  signInContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default HomeScreen;