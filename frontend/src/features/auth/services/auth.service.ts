import axiosInstance from "../../../config/axios.config";
import { type IRegisterPayload, type ILoginPayload } from "../../../types/auth.type";
import { API_ROUTES } from "../../../constants/api.constants";
const { AUTH } = API_ROUTES
export const AuthService = {
    register: async (payload: IRegisterPayload) => {
        const response = await axiosInstance.post(AUTH.REGISTER, payload);
        return response.data;
    },

    login: async (payload: ILoginPayload) => {
        const response = await axiosInstance.post(AUTH.LOGIN, payload);
        return response.data;
    },
}