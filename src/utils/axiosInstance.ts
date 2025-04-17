import axios from "axios";
import { config } from "process";
import { useAuthStore } from "@/store/user/authStore";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000";


const axiosInstancePatinet = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

axiosInstancePatinet.interceptors.request.use((config)=>{
    const token = useAuthStore.getState().accessToken
    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config
})


axiosInstancePatinet.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        
        const logoutByAdmin = useAuthStore.getState().logoutByAdmin;

        if(error.response?.status === 403){
            console.warn("Doctor is blocked! Logging out...");
            
            logoutByAdmin()
            
        }

        return Promise.reject(error);
    }



)


export default axiosInstancePatinet