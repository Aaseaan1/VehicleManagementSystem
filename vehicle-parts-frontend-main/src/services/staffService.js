import axios from "axios";

const API_URL = "http://localhost:5200/api";

export const registerCustomer = async (data) => {
    const res = await axios.post(`${API_URL}/Staff/register-customer`, data);
    return res.data;
};

export const getCustomers = async (search = "") => {
    const res = await axios.get(`${API_URL}/Staff/customers?search=${search}`);
    return res.data;
};

export const createSalesInvoice = async (data) => {
    const res = await axios.post(`${API_URL}/SalesInvoice`, data);
    return res.data;
};

export const getSalesInvoices = async () => {
    const res = await axios.get(`${API_URL}/SalesInvoice`);
    return res.data;
};

export const sendInvoiceEmail = async (id) => {
    const res = await axios.post(`${API_URL}/SalesInvoice/${id}/send-email`);
    return res.data;
};

export const getCustomerReports = async () => {
    const res = await axios.get(`${API_URL}/Staff/reports`);
    return res.data;
};