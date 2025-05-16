import { createContext, useContext, useState } from 'react';
import axiosClient from '../axios-client';

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  // Try to parse the stored user data, fallback to null if it fails
  let parsedUser = null;
  try {
    const storedUser = localStorage.getItem('USER');
    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
      
      // If we have a role in localStorage but not in the parsed user, add it
      const storedRole = localStorage.getItem('USER_ROLE');
      if (storedRole && (!parsedUser.role || parsedUser.role !== storedRole)) {
        console.log(`Restoring role from localStorage: ${storedRole}`);
        parsedUser.role = storedRole;
      }
    }
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    localStorage.removeItem('USER');
  }

  const [user, setUser] = useState(parsedUser);
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('USER');
      localStorage.removeItem('USER_ROLE');
      setUser(null);
    }
  };

  const setUserData = (userData) => {
    // Ensure we have a role - use localStorage as backup if missing
    if (userData) {
      if (!userData.role) {
        const storedRole = localStorage.getItem('USER_ROLE');
        if (storedRole) {
          console.log(`Adding missing role from localStorage: ${storedRole}`);
          userData.role = storedRole;
        }
      }
      
      // Always sync the role to localStorage
      if (userData.role) {
        console.log(`Setting USER_ROLE in localStorage to: ${userData.role}`);
        localStorage.setItem('USER_ROLE', userData.role);
      }
      
      localStorage.setItem('USER', JSON.stringify(userData));
    }
    
    setUser(userData);
  };

  return (
    <StateContext.Provider value={{
      user,
      token,
      setUser: setUserData,
      setToken,
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext); 