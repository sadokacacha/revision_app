import axiosClient from '../axios-client';

export const userService = {
  getUsers: async () => {
    const { data } = await axiosClient.get('/users');
    return data;
  },

  getUser: async (id) => {
    const { data } = await axiosClient.get(`/users/${id}`);
    return data;
  },

  createUser: async (userData) => {
    const { data } = await axiosClient.post('/users', userData);
    return data;
  },

  updateUser: async (id, userData) => {
    const { data } = await axiosClient.put(`/users/${id}`, userData);
    return data;
  },

  deleteUser: async (id) => {
    const { data } = await axiosClient.delete(`/users/${id}`);
    return data;
  }
}; 