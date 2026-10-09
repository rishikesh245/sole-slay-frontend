import axios from "axios";

const API_URL = "http://localhost:5001/api/upload";

export const uploadImage = (imageFile) => {

    const formData = new FormData();

    formData.append("image", imageFile);

    return axios.post(API_URL, formData);
};