import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000";


const axiosInstance = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    }
})


export default axiosInstance