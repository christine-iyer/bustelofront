import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Platform } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const BACKEND_URL = 'https://franky-app-ix96j.ondigitalocean.app';

interface GoogleSignInButtonProps {
  buttonText?: string;
}

export default function GoogleSignInButton({ buttonText = "Sign in with Google" }: GoogleSignInButtonProps) {
  const handleGoogleSignIn = async () => {
    try {
      const authUrl = `${BACKEND_URL}/api/user/auth/google`;
      
      if (Platform.OS === 'web') {
        // For web, use window.location
        window.location.href = authUrl;
      } else {
        // For mobile, use Linking API
        const supported = await Linking.canOpenURL(authUrl);
        
        if (supported) {
          await Linking.openURL(authUrl);
        } else {
          Alert.alert('Error', `Cannot open URL: ${authUrl}`);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open Google Sign In');
      console.error('Error opening URL:', error);
    }
  };

  return (
    <View style={styles.userContainer}>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        activeOpacity={0.8}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" style={styles.googleIcon}>
          <Path 
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
            fill="#4285F4" 
          />
          <Path 
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
            fill="#34A853" 
          />
          <Path 
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
            fill="#FBBC05" 
          />
          <Path 
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
            fill="#EA4335" 
          />
        </Svg>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 4,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  buttonText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    color: '#3c4043',
  },
});