import axios from "axios";
import { useAdminStore } from "@/store/admin/adminStore";
import { RefreshResponse } from "./axiosTypes";
import { isTokenExpired } from "./axiosInstance";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000";

const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post<RefreshResponse>(
            `${API_BASE_URL}/api/admin/refresh-token`,
            {},
            { withCredentials: true }
        );

        if (response.data.success) {
            const newAccessToken = response.data.accessToken;
            console.log("new access token==>", newAccessToken);

            useAdminStore.setState({ accessToken: newAccessToken });
            return newAccessToken;
        }

        return null;
    } catch (error) {
        console.error("error while refreshin access token", error);
        return null;
    }
};
    
const axiosInstanceAdmin = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstanceAdmin.interceptors.request.use(
    async (config) => {
        let token = useAdminStore.getState().accessToken;
        if (token) {
            if (isTokenExpired(token)) {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    token = newToken;
                } else {
                    useAdminStore.getState().logout();

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

export default axiosInstanceAdmin;
