import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";


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