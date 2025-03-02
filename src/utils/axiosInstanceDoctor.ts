import axios from "axios";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { config } from "process";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000";

const axiosInstanceDoctor = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

axiosInstanceDoctor.interceptors.request.use((config)=>{
    const token = useAuthStoreDoctor.getState().accessTokenDoctor;
    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config
})


export default axiosInstanceDoctor;