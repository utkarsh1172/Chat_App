import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { currentUser } = useContext(AuthContext); // current user from context

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://192.168.1.100:5001/get-all-user');
        if (res.data.status === 'Ok') {
          const filtered = res.data.data.filter(user => user._id !== currentUser?._id);
          setUsers(filtered);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('MessageScreen', { user: item })}
    >
      <Image
        source={{ uri: `https://ui-avatars.com/api/?name=${item.name}&background=random` }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#fff" />;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={item => item._id}
      renderItem={renderUser}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default UserList;

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F2F',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    color: '#fff',
  },
});
