const {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} = require('react-native');
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useContext, useEffect, useState} from 'react';
import {log} from 'react-native-reanimated';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext, GlobalContext } from '../../context';

function LoginPage({props}) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
     const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState('');
  const { setIsLoggedin, setCurrentUser } = useContext(AuthContext);

function handleLogin() {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password');
    return;
  }

  const userData = { email, password };

  axios.post('http://192.168.1.102:5001/login-user', userData)
    .then(res => {
      const data = res.data;

      if (data.status === 'ok') {
        Alert.alert('Success', 'Logged in successfully');
        AsyncStorage.setItem('token', data.token);
        AsyncStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedin(true);
        setCurrentUser(data.user);
        // navigation.navigate('ChatScreen');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
        console.log('Login error (invalid):', data);
      }
    })
    .catch(error => {
      if (error.response) {
        const message = error.response.data?.message || 'Invalid email or password';

        if (message.includes("User not registered")) {
          Alert.alert(
            "Account Not Found",
            "No account found with this email. Would you like to register?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "Register",
                onPress: () => navigation.navigate('Register')
              }
            ]
          );
        } else {
          Alert.alert('Login Failed', message);
        }

        console.log('Login error (response):', error.response);
      } else if (error.request) {
        Alert.alert('Network Error', 'Unable to connect to the server');
        console.log('Login error (no response):', error.request);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
        console.log('Login error (other):', error.message);
      }
    });
}
  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    
    console.log(data, 'at app.jsx');
  
  }
  useEffect(()=>{
    getData();
    console.log("Hii");
  },[])

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps={'always'}>
      <View style={{backgroundColor: 'white'}}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/mainLogo.png')}
          />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>Login !!!</Text>
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color="#7d48ff"
              style={styles.smallIcon}
            />
            <TextInput
              placeholder="Enter Email"
               placeholderTextColor="#999" 
              style={styles.textInput}
              onChange={e => setEmail(e.nativeEvent.text)}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#7d48ff" style={styles.smallIcon} />
            <TextInput
              placeholder="Password"
               placeholderTextColor="#999" 
              style={styles.textInput}
              onChange={e => setPassword(e.nativeEvent.text)}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length < 1 ? null : !showPassword ? (
                  <Feather
                    name="eye-off"
                    style={{marginRight: -10}}
                    color={ '#7d48ff'}
                    size={23}
                  />
                ) : (
                  <Feather
                    name="eye"
                    style={{marginRight: -10}}
                 color={ '#7d48ff'}
                    size={23}
                  />
                )}
              </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginTop: 8,
              marginRight: 10,
            }}>
            <Text style={{color: '#7d48ff', fontWeight: '700'}}>
              Forgot Password
            </Text>
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.inBut} onPress={() => handleLogin()}>
            <View>
              <Text style={styles.textSign}>Log in</Text>
            </View>
          </TouchableOpacity>

          <View style={{padding: 15}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#919191'}}>
              ----Or Continue as----
            </Text>
          </View>
          <View style={styles.bottomButton}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity style={styles.inBut2}>
                <FontAwesome
                  name="user-circle-o"
                  color="white"
                  style={styles.smallIcon2}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Guest</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={styles.inBut2}
                onPress={() => {
                  navigation.navigate('Register');
                }}>
                <FontAwesome
                  name="user-plus"
                  color="white"
                  style={[styles.smallIcon2, {fontSize: 30}]}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Sign Up</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={styles.inBut2}
                onPress={() => alert('Coming Soon')}>
                <FontAwesome
                  name="google"
                  color="white"
                  style={[styles.smallIcon2, {fontSize: 30}]}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Google</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={styles.inBut2}
                onPress={() => alert('Coming Soon')}>
                <FontAwesome
                  name="facebook-f"
                  color="white"
                  style={[styles.smallIcon2, {fontSize: 30}]}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Facebook</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
export default LoginPage;