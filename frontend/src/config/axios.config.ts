import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false,
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status

        if (status === 401) {
            localStorage.removeItem('accessToken')
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }


        if (error.response) {
            const { status, data } = error.response

            if ([500, 403].includes(status)) {
                const serverMessage = data?.message || "Internal Server Error";
                window.location.href = `/error?status=${status}&msg=${encodeURIComponent(serverMessage)}`;
            }

            const customErrorMessage = data?.message || "An unexpected error occurred.";
            return Promise.reject({ message: customErrorMessage });
        }
    }
)

export default axiosInstance;