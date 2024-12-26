import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // כתובת הבסיס של השרת שלך

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Server error');
    }
};