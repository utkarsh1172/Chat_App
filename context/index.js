import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const GlobalState = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (token && user) {
        setIsLoggedin(true);
        setCurrentUser(JSON.parse(user));
      }
      setLoading(false);
    };

    restoreUser();
  }, []);

  if (loading) return null; // or a splash loader

  return (
    <AuthContext.Provider value={{ isLoggedin, setIsLoggedin, currentUser, setCurrentUser,isDark, setIsDark }}>
      {children}
    </AuthContext.Provider>
  );
};

export default GlobalState;