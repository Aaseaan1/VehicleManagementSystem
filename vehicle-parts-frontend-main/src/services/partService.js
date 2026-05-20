import axios from "axios";

const API_URL = "http://localhost:5200/api/Parts";

export const getParts = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const addPart = async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
};

export const updatePart = async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
};

export const deletePart = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};