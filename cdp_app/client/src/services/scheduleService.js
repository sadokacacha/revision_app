import axiosClient from '../axios-client';

export const scheduleService = {
  getSchedules: async () => {
    const { data } = await axiosClient.get('/schedules');
    return data;
  },

  getTodaySchedule: async () => {
    const { data } = await axiosClient.get('/schedules/today');
    return data;
  },

  getWeekSchedule: async () => {
    const { data } = await axiosClient.get('/schedules/week');
    return data;
  },

  getNextWeekSchedule: async () => {
    const { data } = await axiosClient.get('/emploi/next-week');
    return data;
  },

  getClassroomSchedule: async (classroomId) => {
    const { data } = await axiosClient.get(`/schedules/classroom/${classroomId}`);
    return data;
  },

  getTeacherSchedule: async (teacherId) => {
    const { data } = await axiosClient.get(`/schedules/teacher/${teacherId}`);
    return data;
  },

  createSchedule: async (scheduleData) => {
    const { data } = await axiosClient.post('/schedules', scheduleData);
    return data;
  },

  updateSchedule: async (id, scheduleData) => {
    const { data } = await axiosClient.put(`/schedules/${id}`, scheduleData);
    return data;
  },

  deleteSchedule: async (id) => {
    const { data } = await axiosClient.delete(`/schedules/${id}`);
    return data;
  },

  createRecurringSchedule: async (scheduleData) => {
    const { data } = await axiosClient.post('/schedules/recurring', scheduleData);
    return data;
  },

  updateRecurringSchedule: async (scheduleData) => {
    const { data } = await axiosClient.put('/schedules/recurring', scheduleData);
    return data;
  },

  deleteRecurringSchedule: async () => {
    const { data } = await axiosClient.delete('/schedules/recurring');
    return data;
  }
}; 