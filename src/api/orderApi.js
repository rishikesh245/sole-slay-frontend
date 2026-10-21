
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;

export const createOrder = (orderData) => {
    const token = localStorage.getItem("token");

    return axios.post(API_URL, orderData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getMyOrders = () => {
    const token = localStorage.getItem("token");

    return axios.get(`${API_URL}/my-orders`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
