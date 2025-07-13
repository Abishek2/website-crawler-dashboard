import axios from 'axios';

// Create a reusable Axios instance to communicate with the backend API
const api = axios.create({
  baseURL: 'http://localhost:8080', // Backend server URL (adjust for production)
  headers: {
    'Content-Type': 'application/json', // Ensure JSON format for requests
  },
});

export default api;
