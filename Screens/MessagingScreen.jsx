import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context';
import { darkTheme, lightTheme } from '../theme';
import socket from '../utils/Socket';
import axios from 'axios';

const MessageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDark } = useContext(AuthContext);
    const { currentUser } = useContext(AuthContext); 
  const theme = isDark ? darkTheme : lightTheme;

  const { user } = route.params;
  console.log("userdata",user)

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey there!', sender: 'me' },
    { id: '2', text: 'Hi! How are you?', sender: 'them' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages()
  },[])

  useEffect(() => {
  if (user?._id) {
    socket.connect(); // optional if autoConnect is disabled
    socket.emit('user_connected', user._id);
  }

  return () => {
    socket.disconnect();
  };
}, [user]);
useEffect(() => {
  socket.on("receive_message", (data) => {
    if (data.senderId !== currentUser._id) {
      setMessages(prev => [
        {
          id: Date.now().toString(),
          text: data.message,
          sender: 'them',
        },
        ...prev,
      ]);
    }
  });

  return () => {
    socket.off("receive_message");
  };
}, [currentUser]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: theme.header },
       headerTintColor: '#FFFFFF',
      headerTitle: () => (
        <View style={styles.headerContent}>
          
            <View style={[styles.avatarInitials, { backgroundColor: theme.primary }]}>
              <Text style={[styles.initialsText, { color: theme.text }]}>
                {user?.name?.split(' ')[0][0]}
                {user?.name?.split(' ')[1] ? user.name.split(' ')[1][0] : ''}
              </Text>
            </View>
          <View>
            <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
            <Text style={[styles.userNumber, { color: theme.placeholder }]}>{user.mobile}</Text>
          </View>
        </View>
      ),
    });
  }, [navigation, theme]);

  const fetchMessages = async () => {
  try {
    const response = await axios.post("http://192.168.1.100:5001/get-messages", {
      senderId: currentUser._id,
      receiverId: user._id,
    });

    const msgs = response.data.data.map((msg) => ({
      id: msg._id,
      text: msg.text,
      sender: msg.senderId === currentUser._id ? "me" : "them",
    }));

    setMessages(msgs.reverse()); // because FlatList is inverted
  } catch (error) {
    console.error("Failed to fetch messages:", error);
  }
};
  const sendMessage = () => {
  if (newMessage.trim()) {
    const messageData = {
      senderId: currentUser._id,  // from context or auth state
      receiverId: user._id,        // passed in navigation params
      message: newMessage,
    };

    socket.emit("send_message", messageData);

    setMessages(prev => [
      {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'me',
      },
      ...prev,
    ]);
    setNewMessage('');
  }
};

 

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        {
          backgroundColor: item.sender === 'me' ? theme.primary : theme.card,
          alignSelf: item.sender === 'me' ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <Text style={[styles.messageText, { color: theme.text }]}>{item.text}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16 }}
        inverted
      />
      <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor={theme.placeholder}
          style={[styles.input, { color: theme.text, backgroundColor: theme.input }]}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={[styles.sendButton, { backgroundColor: theme.primary }]}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userNumber: {
    fontSize: 13,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    marginVertical: 6,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    marginRight: 8,
  },
  sendButton: {
    padding: 12,
    borderRadius: 25,
  },
});
