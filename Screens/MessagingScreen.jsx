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
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import SendIcon from 'react-native-vector-icons/Ionicons';
import TickIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const MessageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDark, currentUser } = useContext(AuthContext);
  const theme = isDark ? darkTheme : lightTheme;
  const { user } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.emit('user_connected', currentUser._id);
    fetchMessages();
socket.on("receive_message", (data) => {
  if (data.senderId !== currentUser._id) {
    const newMsg = {
      id: Date.now().toString(),
      text: data.message,
      image: data.image || null,
      sender: 'them',
      timestamp: new Date(),
      seen: true,
    };

    setMessages(prev => [newMsg, ...prev]);

    // ✅ Inform backend or sender it's seen
    axios.post("http://192.168.1.102:5001/mark-seen", {
      senderId: data.senderId,
      receiverId: currentUser._id,
    });

    // ✅ Emit to sender that message is seen
    socket.emit("message_seen", {
      senderId: data.senderId,
      receiverId: currentUser._id,
    });
  }
});
    socket.on("user_typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    });

    return () => {
      socket.disconnect();
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, []);

  useEffect(() => {
    if (currentUser._id && user._id) {
      axios.post("http://192.168.1.102:5001/mark-seen", {
        senderId: user._id,
        receiverId: currentUser._id,
      });
    }
  }, [user, currentUser]);
  useEffect(() => {
  socket.on("message_seen", ({ senderId, receiverId }) => {
    // ✅ Update the latest message as seen
    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.sender === 'me') {
          return { ...msg, seen: true };
        }
        return msg;
      })
    );
  });

  return () => socket.off("message_seen");
}, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: theme.header },
      headerTintColor: '#FFF',
      headerTitle: () => (
        <View style={styles.headerContent}>
          <View style={[styles.avatarInitials, { backgroundColor: theme.primary }]}>
            <Text style={[styles.initialsText, { color: theme.text }]}>
              {user?.name?.split(' ')[0][0]}{user?.name?.split(' ')[1]?.[0] || ''}
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
      const response = await axios.post("http://192.168.1.102:5001/get-messages", {
        senderId: currentUser._id,
        receiverId: user._id,
      });

      const msgs = response.data.data.map((msg) => ({
        id: msg._id,
        text: msg.text,
        image: msg.image || null,
        sender: msg.senderId === currentUser._id ? "me" : "them",
        seen: msg.seen,
        timestamp: msg.timestamp,
      }));

      setMessages(msgs.reverse());
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() && !image) return;

    const formdata = {
      senderId: currentUser._id,
      receiverId: user._id,
      message: newMessage,
      image,
    };

    socket.emit("send_message", formdata);

    setMessages(prev => [{
      id: Date.now().toString(),
      text: newMessage,
      image,
      sender: 'me',
      seen: false,
      timestamp: new Date(),
    }, ...prev]);

    setNewMessage('');
    setImage('');
  };

  const handleTyping = (text) => {
    setNewMessage(text);
    socket.emit("typing", { to: user._id });
  };

  const selectPhoto = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(img => {
      const imageData = `data:${img.mime};base64,${img.data}`;
      setImage(imageData);
    }).catch(err => console.log("Picker error:", err));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
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
    {/* Row: Text + Time + Tick */}
     {item.image ? (
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
    ) : null}
    <View style={styles.textRow}>
      {item.text ? (
        <Text style={[styles.messageText, { color: theme.text, marginTop:item.image? 5: 0 }]}>{item.text}</Text>
      ) : null}
      

      <View style={[styles.messageFooter, {marginTop:item.image? 10: 0, alignContent:'flex-end'}]}>
        <Text style={styles.timeText}>{formatTime(item.timestamp || new Date())}</Text>
        {item.sender === 'me' && (
          <TickIcon
            name={item.seen ? 'check-all' : 'check'}
            size={16}
            color={item.seen ? '#4fc3f7' : '#aaa'}
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
    </View>

    {/* Optional image below */}
   
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

      {isTyping && (
        <Text style={{ marginLeft: 16, marginBottom: 10, color: theme.placeholder }}>Typing...</Text>
      )}

      <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={selectPhoto} style={[styles.sendButton, { backgroundColor: theme.primary }]}>
          <SendIcon name="image" size={20} color="white" />
        </TouchableOpacity>

        {image !== '' && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}

        <TextInput
          placeholder="Type a message..."
          placeholderTextColor={theme.placeholder}
          style={[styles.input, { color: theme.text, backgroundColor: theme.input }]}
          value={newMessage}
          onChangeText={handleTyping}
        />

        <TouchableOpacity onPress={sendMessage} style={[styles.sendButton, { backgroundColor: theme.primary }]}>
          <SendIcon name="send" size={20} color="white" />
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
    flexDirection: 'column', // message structure (text row + image stacked)
  },
  textRow: {
    flexDirection: 'row', // ✅ text + time/tick inline
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  messageText: {
    flexShrink: 1,
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#ccc',
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
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
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});
