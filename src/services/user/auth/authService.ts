import axiosInstance from "@/utils/axiosInstance"
import {IUser} from "../../../types/userTypes"
import OTPInput from "@/components/otpPage/OTPInput";
import axios from "axios";
import { getErrorMessage } from "@/utils/handleError";
import { NewPasswordFormValues } from "@/components/NewPassword";

import IUserFullData from "@/types/user";

export const registerBasicDetails = async (data:Partial<IUser>)=>{

    try {
        console.log("From registerBasicDetails=>>>",data);
        
        const response = await axiosInstance.post("/signup/basic_details",data)
        return response.data
    } catch (error:any) {
        throw new Error(error.response?.data?.error || "signup failed")
    }

}


export const verifyOTP = async(email:string,otp:string)=>{
    try {
        const response = await axiosInstance.post("/signup/verify_otp",{email,otp})
        return response.data
    } catch (error:any) {
        throw new Error(error.response?.data?.error || "OTP verification failed");
    }
}


export const resentOTP = async(email:string)=>{
    try {
        const response = await axiosInstance.post("/signup/resend_otp",{email})
        console.log(response);
        
        return response.data
    } catch (error:any) {
        throw new Error(error.response?.data?.error || "Resend OTP failed");
    }
}


export const login = async(email:string,password:string): Promise<{accessToken:string,user:IUser}>=>{
    console.log("===>",email,password);
    
    try {
        const response = await axiosInstance.post("/login",{email,password},{withCredentials:true})

        const {accessToken,user} = response.data

        return {accessToken,user}
    } catch (error:unknown) {
        if(axios.isAxiosError(error)){

            throw new Error(error.response?.data?.error || "Login failed")
        }else{
            throw new Error("An unexpected error occurred");
        }
    }
}


export const forgotPassword = async(email:string)=>{
    try {

        const response  = await axiosInstance.post("/forgot-password",{email})
        return response.data
    } catch (error:unknown) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage)
    }

}


export const updatePassword = async(email:string,password:string)=>{
    try {
        
        
        const response = await axiosInstance.post("/update-password",{email,password})

        return response.data
        
    } catch (error:unknown) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage)
    }
}

export const googleAuth = async (role: "patient" | "doctor") => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URI}/auth/google?role=${role}`;
};


export const fetchTokens = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/auth/tokens`, {
            withCredentials: true, // ✅ Ensures cookies are sent
        });

        return response.data; // { accessToken, role }
    } catch (error) {
        console.error("Error fetching tokens:", error);
        throw new Error("Failed to fetch authentication tokens.");
    }
};

export const logout = async ()=>{
    try {
        await axiosInstance.post("/logout",{},{withCredentials:true})

    } catch (error) {
        console.error("Error during logout:",error);
        throw new Error("Logut failed")
    }
}


export const fetchPatientProfile = async ():Promise<IUserFullData|null>=>{
    try {
        const response = await axiosInstance.get("/profile");
        return response.data.user
    } catch (error) {
        console.error("Error fetching patient profile:", error);
        return null;
    }
}