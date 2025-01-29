import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Book & User Community!</Text>
      <Button title="Create a User" onPress={() => navigation.navigate('CreateUser')} />
      <Button title="View All Users" onPress={() => navigation.navigate('ListUsers')} />
      <Button title="Write a Book Review" onPress={() => navigation.navigate('CreateReview')} />
      <Button title="Read Book Reviews" onPress={() => navigation.navigate('ListReviews')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});


