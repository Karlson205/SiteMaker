import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Этот перехватчик добавляет токен ко всем запросам (get/post/put/delete)
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;