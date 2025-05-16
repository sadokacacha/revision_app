import axiosClient from '../axios-client';

export const attendanceService = {
  getTodayAttendance: async () => {
    const { data } = await axiosClient.get('/attendance/today');
    return data;
  },

  markAttendance: async (attendanceData) => {
    const { data } = await axiosClient.post('/attendance', attendanceData);
    return data;
  },

  updateAttendance: async (attendanceId, attendanceData) => {
    const { data } = await axiosClient.put(`/attendance/${attendanceId}`, attendanceData);
    return data;
  },

  getAttendanceHistory: async (userId) => {
    const { data } = await axiosClient.get(`/attendance/history/${userId}`);
    return data;
  }
}; 