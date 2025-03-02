import { IUser } from "@/types/userTypes";
import axiosInstance from "@/utils/axiosInstance";
import axiosInstanceDoctor from "@/utils/axiosInstanceDoctor";
import { getErrorMessage } from "@/utils/handleError";
import axios from "axios";
import { emitWarning } from "process";


export const registerBasicDetailsDoctor = async (data: Partial<IUser>) => {
    try {

        const respose = await axiosInstance.post("/api/doctor/signup/basic_details", data)
        return respose.data

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {

            throw new Error(error.response?.data?.error || "Signup failed")
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}



export const verify_otp_doctor = async (email: string, otp: string) => {
    try {

        const respose = await axiosInstance.post("/api/doctor/signup/verify_otp", { email, otp })
        return respose.data

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {

            throw new Error(error.response?.data?.error || "Verify OTP Error")
        } else {
            throw new Error("An unexpected error occurred");
        }


    }
}


export const resend_otp_doctor = async (email: string) => {

    try {

        const response = await axiosInstance.post("/api/doctor/signup/resend_otp",{email})
        console.log(response);
        return response.data
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            console.log(error);
            
            throw new Error(error.response?.data?.error || "Resend OTP failed")
        } else {
            throw new Error("An unexpected error occurred");
        }

    }

}


export const login_doctor = async (email: string, password: string): Promise<{ doctorAccessToken: string, doctor: IUser }> => {

    try {

        const response = await axiosInstance.post("/api/doctor/login",{email,password})

        const { doctorAccessToken, doctor } = response.data

        return { doctorAccessToken, doctor }

    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {

            throw new Error(error.response?.data?.error || "Login failed")
        } else {
            throw new Error("An unexpected error occurred");
        }


    }

}

export const forgotPasswordDoctor = async(email:string)=>{
    try {
        const respose = await axiosInstance.post("/api/doctor/forgot-password",{email})
        return respose.data
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage)
    }
}

export const updatePasswordDoctor = async(email:string,password:string)=>{
    try {
        const response = await axiosInstance.post("/api/doctor/update-password",{email,password})
        return response.data
    } catch (error:unknown) {

        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage)
        
    }
}

export const logoutDoctor = async()=>{
    try {
        await axiosInstance.post("/api/doctor/logout",{},{withCredentials:true})
    } catch (error) {
        console.error("Error during logout:",error);
        throw new Error("Logut failed")
    }
}