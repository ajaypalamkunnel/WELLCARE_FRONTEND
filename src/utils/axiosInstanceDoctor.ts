"use client";
import axios from "axios";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { RefreshResponse } from "./axiosTypes";
import { isTokenExpired } from "./axiosInstance";
import { error } from "console";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000";

const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post<RefreshResponse>(
            `${API_BASE_URL}/api/doctor/refresh-token`,
            {},
            { withCredentials: true }
        );

        if (response.data.success) {
            const newAccessToken = response.data.accessToken;
            console.log("new access token==>", newAccessToken);

            useAuthStoreDoctor.setState({ accessTokenDoctor: newAccessToken });
            return newAccessToken;
        }

        return null;
    } catch (error) {
        console.error("error while refreshin access token", error);

        return null;
    }
};

const axiosInstanceDoctor = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstanceDoctor.interceptors.request.use(
    async (config) => {
        let token = useAuthStoreDoctor.getState().accessTokenDoctor;
        if (token) {
            if (isTokenExpired(token)) {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    token = newToken;
                } else {
                    useAuthStoreDoctor.getState().logout();

                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }

                    return Promise.reject(
                        new Error("session Expired please login again")
                    );
                }
            }
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstanceDoctor.interceptors.response.use(
    (response) => response,
    async (error) => {
        const adminLogout = useAuthStoreDoctor.getState().adminLogout;
        console.log("----> interscepot respsose ", error.response);

        if (error.response?.status === 403) {
            console.warn("Doctor is blocked! Logging out...");

            adminLogout();
        }
        return Promise.reject(error);
    }
);

export default axiosInstanceDoctor;
