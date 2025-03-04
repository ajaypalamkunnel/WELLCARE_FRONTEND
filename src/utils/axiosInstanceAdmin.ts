import axios from "axios"
import { useAdminStore } from "@/store/admin/adminStore"


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000";

const axiosInstanceAdmin = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

axiosInstanceAdmin.interceptors.request.use((config)=>{
    const token = useAdminStore.getState().accessToken;
    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config
})

export default axiosInstanceAdmin