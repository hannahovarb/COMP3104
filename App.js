import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// One row in the user list. It only shows the name and email and tells the parent when it gets tapped.
function UserItem({ user, onPress }) {
  return (
    <Pressable style={styles.userItem} onPress={onPress}>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
    </Pressable>
  );
}

export default function App() {
  // All the users we get back from the API
  const [users, setUsers] = useState([]);
  // Whichever user was tapped. null just means we're on the list screen.
  const [selectedUser, setSelectedUser] = useState(null);
  // Start as true since we fetch the data as soon as the app opens
  const [loading, setLoading] = useState(true);
  // Holds an error message if the fetch fails
  const [error, setError] = useState(null);
  // Runs once when the app first loads to grab the users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        );
        // fetch doesn't throw on a bad status like 404 or 500, so we have to check it ourselve
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        // Keep the message simple, the user doesn't need the technical details
        setError('Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Loading users...</Text>
      </View>
    );
  }
  // Something went wrong, so show the error instead of an empty screen
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  // No user picked yet, so show the full list
  if (selectedUser === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Users</Text>
        <FlatList
          data={users}
          // FlatList wants string keys, and the API gives us numeric ids
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              onPress={() => setSelectedUser(item)}
            />
          )}
        />
      </SafeAreaView>
    );
  }
  // A user is selected, so show all of their details.
  // ScrollView is used here because there's a lot to fit on one screen.
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.details}>
        <Pressable
          style={styles.backButton}
          onPress={() => setSelectedUser(null)}
        >
          <Text style={styles.backButtonText}>Back to Users</Text>
        </Pressable>

        <Text style={styles.title}>User Details</Text>

        <Text style={styles.detailLabel}>ID</Text>
        <Text style={styles.detailValue}>{selectedUser.id}</Text>

        <Text style={styles.detailLabel}>Name</Text>
        <Text style={styles.detailValue}>{selectedUser.name}</Text>

        <Text style={styles.detailLabel}>Username</Text>
        <Text style={styles.detailValue}>{selectedUser.username}</Text>

        <Text style={styles.detailLabel}>Email</Text>
        <Text style={styles.detailValue}>{selectedUser.email}</Text>

        <Text style={styles.detailLabel}>Phone</Text>
        <Text style={styles.detailValue}>{selectedUser.phone}</Text>

        <Text style={styles.detailLabel}>Website</Text>
        <Text style={styles.detailValue}>{selectedUser.website}</Text>

        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.detailValue}>
          {selectedUser.address.street}, {selectedUser.address.suite}
        </Text>
        <Text style={styles.detailValue}>
          {selectedUser.address.city}, {selectedUser.address.zipcode}
        </Text>

        <Text style={styles.detailLabel}>Coordinates</Text>
        <Text style={styles.detailValue}>
          Lat: {selectedUser.address.geo.lat} Lng:{' '}
          {selectedUser.address.geo.lng}
        </Text>

        <Text style={styles.sectionTitle}>Company</Text>

        <Text style={styles.detailLabel}>Company Name</Text>
        <Text style={styles.detailValue}>{selectedUser.company.name}</Text>

        <Text style={styles.detailLabel}>Catch Phrase</Text>
        <Text style={styles.detailValue}>
          {selectedUser.company.catchPhrase}
        </Text>

        <Text style={styles.detailLabel}>Business</Text>
        <Text style={styles.detailValue}>{selectedUser.company.bs}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
// All the styling lives down here to keep the component code easier to read
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#B00020',
  },
  details: {
    paddingBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1D4ED8',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 18,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailValue: {
    fontSize: 16,
    marginTop: 2,
  },
});
