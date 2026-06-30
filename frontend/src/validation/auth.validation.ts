import type { ILoginPayload, IRegisterPayload } from "../types/auth.type";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerValidation = (payload: IRegisterPayload): string | null => {
    if (!payload.name.trim()) {
        return "Name is required";
    }

    if (!payload.email || !emailRegex.test(payload.email)) {
        return "Invalid email address";
    }

    if (!payload.password) {
        return "Password is required";
    }

    if (payload.password.length < 6) {
        return "Password must be at least 6 characters";
    }

    return null;
};

export const loginValidation = (payload: ILoginPayload): string | null => {
    if (!payload.email || !emailRegex.test(payload.email)) {
        return "Invalid email address";
    }

    if (!payload.password) {
        return "Password is required";
    }

    return null;
};