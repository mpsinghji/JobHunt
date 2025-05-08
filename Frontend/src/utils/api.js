import axios from 'axios';
import { BASE_BACKEND_URL } from './constants';

const api = axios.create({
    baseURL: BASE_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add any request modifications here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error
            console.error('Authentication error:', error);
            // You might want to redirect to login or clear user data
        }
        return Promise.reject(error);
    }
);

export default api; 