import axiosInstance from "@/utils/axiosInstance"
import IUser from "../../../types/user"
import OTPInput from "@/components/otpPage/OTPInput";



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