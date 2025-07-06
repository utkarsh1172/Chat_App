import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { useEffect, useContext, useState } from 'react';

import LoginPage from './Screens/Login&Register/Login';
import RegisterPage from './Screens/Login&Register/Register';
import ChatScreen from './Screens/ChatScreen';
import MessageScreen from './Screens/MessagingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './context';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedin, setIsLoggedin, setCurrentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initialize = async () => {
      SplashScreen.hide();
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        if (token && user) {
          setIsLoggedin(true);
          setCurrentUser(JSON.parse(user));
        } else {
          setIsLoggedin(false);
        }
      } catch (err) {
        console.error('Error loading token/user:', err);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) return null; // Or splash/loading screen

  return (
    <NavigationContainer>
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {!isLoggedin ? (
      <>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
      </>
    ) : (
      <>
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="MessageScreen" component={MessageScreen} />
      </>
    )}
  </Stack.Navigator>
</NavigationContainer>
  );
}

export default AppNavigator;
