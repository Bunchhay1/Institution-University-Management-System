import axios from 'axios';

const apiClient = axios.create({
    // This MUST be the URL of your Laravel backend
    baseURL: 'http://localhost:8000', 
    
    withCredentials: true, 
});

export default apiClient;