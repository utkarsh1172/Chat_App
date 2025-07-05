import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserList from '../component/UserList';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { lightTheme, darkTheme } from '../theme';
import { AuthContext } from '../context';

const ChatScreen = () => {
  const navigation = useNavigation();
const { setIsLoggedin, isDark, setIsDark } = useContext(AuthContext);
const theme = isDark ? darkTheme : lightTheme;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
              setIsLoggedin(false); 
    navigation.replace('Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Chatify</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Switch
            value={isDark}
            onValueChange={() => setIsDark(!isDark)}
            thumbColor={isDark ? '#fff' : '#000'}
          />
          <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 16 }}>
            <Icon name="log-out" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Icon name="search" size={18} color={theme.placeholder} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search users..."
          placeholderTextColor={theme.placeholder}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      {/* User List */}
      <UserList theme={theme} />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
  },
});
