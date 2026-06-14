import React from "react";
import { Navigate } from "react-router-dom";
interface Props {
    children: React.ReactNode;
}


export const PrivateRoute = ({ children }: Props) => {
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children

}