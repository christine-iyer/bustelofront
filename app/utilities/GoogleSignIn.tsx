import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, Linking } from 'react-native';

export default function GoogleSignIn() {
  const handleGoogleSignIn = async () => {
    const authUrl = 'https://franky-app-ix96j.ondigitalocean.app/api/auth/google';
    
    if (Platform.OS === 'web') {
      window.location.href = authUrl;
    } else {
      await Linking.openURL(authUrl);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handleGoogleSignIn}
    >
      <Text style={styles.buttonText}>🔐 Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});