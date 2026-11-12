import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sole-slay-backend.onrender.com";

const API_URL = `${API_BASE}/api/orders`;

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

export const getAdminStats = () => {
    const token = localStorage.getItem("token");

    return axios.get(`${API_URL}/admin/stats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getAllOrdersAdmin = () => {
    const token = localStorage.getItem("token");

    return axios.get(`${API_URL}/admin/all`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
