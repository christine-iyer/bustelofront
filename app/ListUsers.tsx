
import React, { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, TextInput, Platform} from "react-native";
import axios from "axios";


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
      const response = await axios.get<User[]>("https://franky-app-ix96j.ondigitalocean.app/api/user");
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete a user
  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`https://franky-app-ix96j.ondigitalocean.app/api/user/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      Alert.alert("Success", "User deleted!");
      fetchUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to delete user.");
    }
  };
  const handleSave = async (id: string) => {
    const updatedFields: Partial<User> = {};
  
    // Add only modified fields to the update object
    if (tempUsername && tempUsername !== users.find((user) => user._id === id)?.username) {
      updatedFields.username = tempUsername;
    }
    if (tempEmail && tempEmail !== users.find((user) => user._id === id)?.email) {
      updatedFields.email = tempEmail;
    }
    if (tempPassword) {
      updatedFields.password = tempPassword; // Update password only if provided
    }
  
    // Ensure at least one field is being updated
    if (Object.keys(updatedFields).length === 0) {
      Alert.alert("No changes detected", "Please modify at least one field.");
      return;
    }
  
    try {
      await axios.put(`https://franky-app-ix96j.ondigitalocean.app/api/${id}`, updatedFields);
      Alert.alert("Success", "User updated!");
      setEditableUserId(null);
      fetchUsers(); // Refresh user list
    } catch (error) {
      Alert.alert("Error", "Failed to update user. Please check your input.");
    }
  };
  // Render each user in the list
  const renderItem = ({ item }: { item: User }) => (
   
    <View style={styles.userContainer}>
    {editableUserId === item._id ? (
      <>
        <TextInput
          style={styles.input}
          placeholder="Edit Username"
          value={tempUsername ?? ""} // Ensure value is always a string
          onChangeText={setTempUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Edit Email"
          value={tempEmail ?? ""} // Ensure value is always a string
          onChangeText={setTempEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Edit Password (optional)"
          value={tempPassword ?? ""} // Ensure value is always a string
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
            setTempUsername(item.username ?? ""); // Default to empty string
            setTempEmail(item.email ?? ""); // Default to empty string
            setTempPassword(""); // Clear password input
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
    backgroundColor: Platform.select({
      ios:'blue',
      android:'red'
    }),
    
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
