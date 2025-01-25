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

const API_BASE_URL = "http://localhost:3001/api/review";

interface User {
  _id: string;
  title: string;
  author: string;
  text: string;
  rating: number;
  genre: string;
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempAuthor, setTempAuthor] = useState<string>("");
  const [tempText, setTempText] = useState<string>("");
  const [tempRating, setTempRating] = useState<number>(0);
  const [tempGenre, setTempGenre] = useState<string>("");

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
        password: tempPassword,
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
        <TextInput
          style={styles.input}
          value={tempPassword}
          onChangeText={setTempPassword}  
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
          {item.username} - {item.email} - {item.password}
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => {
            setEditableUserId(item._id);
            setTempUsername(item.username);
            setTempEmail(item.email);
            setTempPassword(item.password);
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
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 4,
    alignItems: "center",
    maxWidth: 100,
    alignSelf: "flex-end",
}, 
  saveButton: {
    backgroundColor: "green",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  editButton: {
    backgroundColor: "blue",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "brown",
    fontWeight: "bold",
  },
      

});

export default ListUsers;
