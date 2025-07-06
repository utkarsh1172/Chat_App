import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context';
import socket from '../utils/Socket';
import { darkTheme, lightTheme } from '../theme';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { currentUser, isDark } = useContext(AuthContext);
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://192.168.1.102:5001/get-all-user');
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

    // Listen for new users in real-time
    socket.on('new_user_added', newUser => {
      if (newUser._id !== currentUser._id) {
        setUsers(prev => [...prev, newUser]);
      }
    });

    return () => socket.off('new_user_added');
  }, [currentUser]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#fff" />;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <UserItem item={item} navigation={navigation} theme={theme} />
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

const UserItem = ({ item, navigation, theme }) => {
  const [imageError, setImageError] = useState(false);

  const name = item?.name?.trim() || 'User';
  const encodedName = encodeURIComponent(name);
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('MessageScreen', { user: item })}
    >
      {!imageError ? (
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodedName}&background=random`,
          }}
          style={styles.avatar}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={[styles.avatarInitials, { backgroundColor: theme.primary }]}>
          <Text style={[styles.initialsText, { color: theme.text }]}>{initials}</Text>
        </View>
      )}
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
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
  avatarInitials: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    fontSize: 20,
    fontWeight: 'bold',
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
