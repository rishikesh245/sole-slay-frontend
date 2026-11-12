import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sole-slay-backend.onrender.com";

const API_URL = `${API_BASE}/api/upload`;

export const uploadImage = (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const token = localStorage.getItem("token");

    return axios.post(API_URL, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const deleteImage = (publicId) => {
    const token = localStorage.getItem("token");

    return axios.delete(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: { publicId }
    });
};

