import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/products`;


// GET ALL / FILTERED PRODUCTS
export const getProducts = (category = "", subcategory = "") => {

    let url = API_URL;

    const params = new URLSearchParams();

    if (category && category !== "All") {
        params.append("category", category);
    }

    if (subcategory) {
        params.append("subcategory", subcategory);
    }

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

        const token = localStorage.getItem("token");

    return axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

   
};


// GET ONE PRODUCT
export const getProductById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};


// CREATE PRODUCT
export const addProduct = (product) => {
    const token = localStorage.getItem("token");
    return axios.post(API_URL, product,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    );
};


// UPDATE PRODUCT
export const updateProduct = (id, product) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/${id}`, product,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


// DELETE PRODUCT
export const deleteProduct = (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_URL}/${id}`,
        {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
        );
};