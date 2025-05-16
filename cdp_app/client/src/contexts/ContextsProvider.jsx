// src/contexts/ContextsProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../axios-client';

const StateContext = createContext({});

export const ContextsProvider = ({ children }) => {
  const [user, setUser]   = useState(JSON.parse(localStorage.getItem('USER_DATA')));
  const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  // keep localStorage in sync
  useEffect(() => {
    if (user)  localStorage.setItem('USER_DATA', JSON.stringify(user));
    else       localStorage.removeItem('USER_DATA');
  }, [user]);

  useEffect(() => {
    if (token) setToken(token);
    else       localStorage.removeItem('ACCESS_TOKEN');
  }, [token]);

const login = async (email, password) => {
  const { user, token } = await axiosClient.post('/login', { email, password });
  setUser(user);
  localStorage.setItem('ACCESS_TOKEN', token);
  return user;
};

  const logout = async () => {
    await axiosClient.post('/logout');
    setUser(null);
    setToken(null);
  };

  return (
    <StateContext.Provider value={{ user, login, logout }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
