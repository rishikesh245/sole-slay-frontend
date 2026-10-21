
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

export const loginUser = (loginData) => {
    return axios.post(
        `${API_URL}/login`,
        loginData
    );
};

export const registerUser = (registerData) => {
    return axios.post(
        `${API_URL}/register`,
        registerData
    );
};
