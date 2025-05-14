// useAuth.js
import { useStateContext } from './ContextsProvider';

export default function useAuth() {
  const { user, token, setUser, setToken } = useStateContext();

  const login = async (email, password) => {
    try {
      const { data } = await axiosClient.post('/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        errors: err.response?.data?.errors || { message: err.message },
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('USER_ROLE');
  };

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };
}
