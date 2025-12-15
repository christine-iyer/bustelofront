import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from './contexts/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        let token: string | null = null;

        // Get token from URL
        if (Platform.OS === 'web') {
          const urlParams = new URLSearchParams(window.location.search);
          token = urlParams.get('token');
          const urlError = urlParams.get('error');

          if (urlError) {
            setError('Authentication failed. Please try again.');
            setTimeout(() => router.replace('/'), 3000);
            return;
          }
        }

        if (!token) {
          setError('No authentication token received');
          setTimeout(() => router.replace('/'), 3000);
          return;
        }

        // Store token
        await AsyncStorage.setItem('authToken', token);
        
        // Fetch user data
        const response = await fetch(
          'https://franky-app-ix96j.ondigitalocean.app/api/auth/me',
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        
        // Update auth context
        login(userData, token);
        
        // Redirect to home
        router.replace('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Something went wrong. Please try again.');
        setTimeout(() => router.replace('/'), 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: 20 
    }}>
      {error ? (
        <>
          <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>
            {error}
          </Text>
          <Text style={{ marginTop: 16, color: '#666' }}>
            Redirecting...
          </Text>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={{ marginTop: 16, fontSize: 16 }}>
            Completing sign in...
          </Text>
        </>
      )}
    </View>
  );
}