"use client"
import axios from "axios";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";

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


axiosInstanceDoctor.interceptors.response.use(
    
    (response)=>response,
    async(error) =>{
       
        const adminLogout = useAuthStoreDoctor.getState().adminLogout
        console.log("----> interscepot respsose ",error.response);

        if(error.response?.status === 403){
            console.warn("Doctor is blocked! Logging out...");

            adminLogout()
            
        }
        return Promise.reject(error)
    }
)

export default axiosInstanceDoctor;