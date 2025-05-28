import { API_PREFIX } from "@/constants/apiRoutes";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import { IUser } from "@/types/userTypes";
import axiosInstance from "@/utils/axiosInstance";
import axiosInstanceDoctor from "@/utils/axiosInstanceDoctor";
import { getErrorMessage } from "@/utils/handleError";
import axios from "axios";

export const registerBasicDetailsDoctor = async (data: Partial<IUser>) => {
    try {
        const respose = await axiosInstance.post(`${API_PREFIX.DOCTOR}/signup/basic_details`, data)
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
        const respose = await axiosInstance.post(`${API_PREFIX.DOCTOR}/signup/verify_otp`, { email, otp })
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
        const response = await axiosInstance.post(`${API_PREFIX.DOCTOR}/signup/resend_otp`, { email })
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
        const response = await axiosInstance.post(`${API_PREFIX.DOCTOR}/login`, { email, password })
        const { doctorAccessToken, doctor } = response.data
        console.log("data: ",doctor);
        
        return { doctorAccessToken, doctor }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || "Login failed")
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export const forgotPasswordDoctor = async (email: string) => {
    try {
        const respose = await axiosInstance.post(`${API_PREFIX.DOCTOR}/forgot-password`, { email })
        return respose.data
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage)
    }
}

export const updatePasswordDoctor = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post(`${API_PREFIX.DOCTOR}/update-password`, { email, password })
        return response.data
    } catch (error: unknown) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage)
    }
}

export const logoutDoctor = async () => {
    try {
        await axiosInstance.post(`${API_PREFIX.DOCTOR}/logout`, {}, { withCredentials: true })
    } catch (error) {
        console.error("Error during logout:", error);
        throw new Error("Logut failed")
    }
}

export const fetchDoctorProfile = async (): Promise<IDoctorProfileDataType | null> => {
    try {
        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/profile`);
        return response.data.user
    } catch (error) {
        console.error("Error fetching patient profile:", error);
        return null;
    }
}



export const getRegisteredDoctorData = async ()=>{
    try {

        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/registration-data`)

        console.log(response.data);
        

        return response.data
        
    } catch (error) {
         console.error("Error geting registred data:", error);
        throw error;
    }
}
