// useAuth.js
import { useStateContext } from './ContextsProvider';
import axiosClient from '../axios-client';

export default function useAuth() {
  const { user, token, setUser, setToken } = useStateContext();

  const login = async (email, password) => {
    try {
      const { data } = await axiosClient.post('/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ACCESS_TOKEN', data.token);
      localStorage.setItem('USER_ROLE', data.user.role);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        errors: err.response?.data?.errors || { message: err.message },
      };
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post('/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('USER_ROLE');
    }
  };

  const getUser = async () => {
    try {
      const { data } = await axiosClient.get('/user');
      setUser(data);
      return data;
    } catch (err) {
      logout();
      throw err;
    }
  };

  return {
    user,
    token,
    login,
    logout,
    getUser,
    isAuthenticated: !!token,
  };
}
