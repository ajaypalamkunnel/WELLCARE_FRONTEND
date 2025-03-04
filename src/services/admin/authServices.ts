import axiosInstance from "@/utils/axiosInstance"
import axiosInstanceAdmin from "@/utils/axiosInstanceAdmin"
import axios from "axios"



export const login = async (email:string,password:string)=>{

    try {
        const response = await axiosInstance.post("/api/admin/login",{email,password},{withCredentials:true})

        const {accessTokenAdmin,admin} = response.data

        return {accessTokenAdmin,admin}
    } catch (error) {
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data?.error || "Login failed")
        }else{
            throw new Error("An unexpected error occured")
        }
    }

}


export const logoutAdmin = async()=>{
    try {
        console.log("logout admin");
        
        const response = await axiosInstance.post("/api/admin/logout",{},{withCredentials:true})
        console.log(response);
        
         return response
    } catch (error) {
        console.error("Error during logout: ",error);
        throw new Error("Logout failed")
        
    }
}

export const fetchAllDoctors = async()=>{
    try {
        console.log("frontend service");

        const response = await axiosInstanceAdmin.get("/api/admin/doctors")
        console.log(response);
        
        return response
    } catch (error) {
        console.error("Error during featching doctors =",error);
        throw new Error("fetch doctors failed")
        
    }
}