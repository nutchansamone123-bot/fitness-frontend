import axios, { InternalAxiosRequestConfig } from "axios";

// ດຶງ URL ຈາກ .env.local ຫຼື ໃຊ້ URL ຫຼັກ
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fitness-bxqs.onrender.com";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor ໃສ່ Token ໃຫ້ທຸກໆ Request ອັດໂນມັດຖ້າມີ token ໃນ localStorage
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: unknown) => Promise.reject(error)
);

export default api;