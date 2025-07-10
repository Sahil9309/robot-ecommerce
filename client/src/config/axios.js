// Create this file: src/config/axios.js
import axios from 'axios';

// Set the base URL for your API
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;

export default axios;