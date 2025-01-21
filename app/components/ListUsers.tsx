import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/user";

interface User {
  _id: string;
  username: string;
  email: string;
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [tempUsername, setTempUsername] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(API_BASE_URL);
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch users.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      Alert.alert("Success", "User deleted!");
      fetchUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to delete user.");
    }
  };

  const handleSave = async (id: string) => {
    try {
      await axios.put(`${API_BASE_URL}/${id}`, {
        username: tempUsername,
        email: tempEmail,
      });
      Alert.alert("Success", "User updated!");
      setEditableUserId(null);
      fetchUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to update user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userContainer}>
      {editableUserId === item._id ? (
        <>
          <TextInput
            style={styles.input}
            value={tempUsername}
            onChangeText={setTempUsername}
          />
          <TextInput
            style={styles.input}
            value={tempEmail}
            onChangeText={setTempEmail}
          />
          <Button
            title="Save"
            onPress={() => handleSave(item._id)}
            color="#4caf50"
          />
          <Button
            title="Cancel"
            onPress={() => setEditableUserId(null)}
            color="#f44336"
          />
        </>
      ) : (
        <>
          <Text style={styles.text}>
            {item.username} - {item.email}
          </Text>
          <Button
            title="Edit"
            onPress={() => {
              setEditableUserId(item._id);
              setTempUsername(item.username);
              setTempEmail(item.email);
            }}
          />
          <Button
            title="Delete"
            onPress={() => handleDelete(item._id)}
            color="#f44336"
          />
        </>
      )}
    </View>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    />
  );
};

const styles = StyleSheet.create({
  userContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default ListUsers;
