
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/upload`;

export const uploadImage = (imageFile) => {
    const formData = new FormData();

    formData.append("image", imageFile);

    return axios.post(API_URL, formData);
};
