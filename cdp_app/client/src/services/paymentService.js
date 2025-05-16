import axiosClient from '../axios-client';

export const paymentService = {
  createPayment: async (paymentData) => {
    const { data } = await axiosClient.post('/payments', paymentData);
    return data;
  },

  getUserPaymentHistory: async (userId) => {
    const { data } = await axiosClient.get(`/payments/user/${userId}`);
    return data;
  },

  updatePayment: async (id, paymentData) => {
    const { data } = await axiosClient.put(`/payments/${id}`, paymentData);
    return data;
  },

  deletePayment: async (id) => {
    const { data } = await axiosClient.delete(`/payments/${id}`);
    return data;
  },

  getTeacherPaymentSummary: async () => {
    const { data } = await axiosClient.get('/payments/teacher/summary');
    return data;
  },

  markTeacherPaid: async (teacherId) => {
    const { data } = await axiosClient.post(`/payments/teacher/${teacherId}/mark-paid`);
    return data;
  }
}; 