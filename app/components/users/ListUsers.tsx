import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://192.168.0.49:3001/api/user";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [tempUsername, setTempUsername] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");
  const [tempPassword, setTempPassword] = useState<string>("");

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(API_BASE_URL);
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete a user
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      Alert.alert("Success", "User deleted!");
      fetchUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to delete user.");
    }
  };

  // Save updated user data
  const handleSave = async (id: string) => {
    if (!tempUsername || !tempEmail) {
      Alert.alert("Error", "Username and email are required.");
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/${id}`, {
        username: tempUsername,
        email: tempEmail,
        password: tempPassword || undefined, // 🔥 Avoid sending an empty password
      });
      Alert.alert("Success", "User updated!");
      setEditableUserId(null);
      fetchUsers(); // ✅ Reload list after updating
    } catch (error) {
      Alert.alert("Error", "Failed to update user.");
    }
  };
  

  // Render each user in the list
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
          <TextInput
            style={styles.input}
            value={tempPassword}
            onChangeText={setTempPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={() => handleSave(item._id)}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setEditableUserId(null)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Username:</Text> {item.username} {"\n"}
            <Text style={styles.boldText}>Email:</Text> {item.email}
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => {
              setEditableUserId(item._id);
              setTempUsername(item.username);
              setTempEmail(item.email);
              setTempPassword("");
            }}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item._id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Users List</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  userContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 4,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  saveButton: {
    backgroundColor: "green",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  editButton: {
    backgroundColor: "blue",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default ListUsers;
