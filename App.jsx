import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { useEffect, useContext, useState } from 'react';

import LoginPage from './Screens/Login&Register/Login';
import RegisterPage from './Screens/Login&Register/Register';
import ChatScreen from './Screens/ChatScreen';
import { AuthContext } from './context';
import MessageScreen from './Screens/MessagingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedin } = useContext(AuthContext);
  const [token, setToken] = useState('') 
  // const token = AsyncStorage.getItem('token');

  console.log("isloggedin", isLoggedin,token)

  useEffect(() => {
    SplashScreen.hide();
    setToken(AsyncStorage.getItem('token'))
    console.log('token,', token)
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedin ? (
          <Stack.Screen name="Login" component={LoginPage} />
        ) : (
          <Stack.Screen name="Chatscreen" component={ChatScreen} />
        )}
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name='MessageScreen' component={MessageScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;