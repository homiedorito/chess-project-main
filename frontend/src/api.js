import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Assuming your FastAPI backend is running locally on port 8000
});

export default api;
