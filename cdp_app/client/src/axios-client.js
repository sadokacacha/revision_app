// src/axios-client.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: false,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Setting Authorization header with token');
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        console.error('API Error:', {
            status: response?.status,
            statusText: response?.statusText,
            url: response?.config?.url,
            method: response?.config?.method,
            data: response?.data,
            headers: response?.headers
        });
        
        if (response?.status === 401) {
            console.warn('Unauthorized response received - clearing auth state');
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('USER');
            localStorage.removeItem('USER_ROLE');
            
            // Use soft redirect to avoid interrupting current operations
            setTimeout(() => {
                window.location.href = '/login';
            }, 100);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
