import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth apis
export const authAPI = {
    register: (userData) => { api.post('/api/auth/register', userData) },
    login: (credentials) => { api.post('/api/auth/login', credentials) },
};

// Metrics api
export const metricsAPI = {
    getMetrics: (params) => { api.get('/api/metrics', { params }) },
    getLatest: (serverId) => { api.get('/api/metrics/latest', { params: { serverId } }) },
};

export default api;