const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

const apiUrl = (path) => `${API_BASE_URL}${path}`;

export { API_BASE_URL, SOCKET_URL, apiUrl };