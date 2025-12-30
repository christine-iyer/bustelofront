import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { useAuthContext } from './contexts/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('=== Callback started ===');
        console.log('Platform:', Platform.OS);
        console.log('Current URL:', window.location.href);
        
        let token: string | null = null;

        // Get token from URL
        if (Platform.OS === 'web') {
          const urlParams = new URLSearchParams(window.location.search);
          token = urlParams.get('token');
          const urlError = urlParams.get('error');

          console.log('URL Params:', Object.fromEntries(urlParams));
          console.log('Token from URL:', token);
          console.log('Error from URL:', urlError);
          
          setDebugInfo(`Token: ${token ? 'Found' : 'Not found'}, Error: ${urlError || 'None'}`);

          if (urlError) {
            console.error('Auth error from URL:', urlError);
            setError(`Authentication failed: ${urlError}`);
            setTimeout(() => router.replace('/'), 3000);
            return;
          }
        }

        if (!token) {
          console.error('No token found in URL');
          setError('No authentication token received');
          setTimeout(() => router.replace('/'), 3000);
          return;
        }

        console.log('Fetching user data with token...');
        
        // Fetch user data from your backend
        const response = await fetch(
          'https://franky-app-ix96j.ondigitalocean.app/api/user/me',
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const userData = await response.json();
        console.log('User data received:', userData);
        
        // Update auth context
        await login(userData, token);
        console.log('Login successful, redirecting to home');
        
        // Redirect to home
        router.replace('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        setError(`Error: ${error.message || 'Something went wrong'}`);
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
      padding: 20,
      backgroundColor: '#f5f5f5'
    }}>
      {error ? (
        <>
          <Text style={{ color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
            {error}
          </Text>
          {debugInfo && (
            <Text style={{ color: '#666', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>
              Debug: {debugInfo}
            </Text>
          )}
          <Text style={{ marginTop: 16, color: '#666' }}>
            Redirecting to home...
          </Text>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={{ marginTop: 16, fontSize: 16 }}>
            Completing sign in...
          </Text>
          {debugInfo && (
            <Text style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              {debugInfo}
            </Text>
          )}
        </>
      )}
    </View>
  );
}