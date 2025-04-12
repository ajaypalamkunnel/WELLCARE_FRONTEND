import axiosInstance from "@/utils/axiosInstance"
import { IUser } from "../../../types/userTypes"
import OTPInput from "@/components/otpPage/OTPInput";
import axios, { AxiosError } from "axios";
import { getErrorMessage } from "@/utils/handleError";
import { NewPasswordFormValues } from "@/components/NewPassword";

import IUserFullData from "@/types/user";
import axiosInstanceDoctor from "@/utils/axiosInstanceDoctor";
import IDoctor from "@/types/IDoctor";
import { IUserDetails } from "@/components/admin/ui/UserRegistrationForm";
import { threadId } from "worker_threads";
import { UserProfileData, UserProfileFormData } from "@/types/userProfileData";
import { ApiResponse, AppointmentDetailDTO, AppointmentListItemDTO, CancelAppointmentResponseDTO, formatDate, IInitiateBookingResponse, InitiateBookingPayload, IVerifyBookingResponse, VerifyBookingPayload } from "@/types/slotBooking";
import { promises } from "dns";

export const registerBasicDetails = async (data: Partial<IUser>) => {

    try {
        console.log("From registerBasicDetails=>>>", data);

        const response = await axiosInstance.post("/signup/basic_details", data)
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "signup failed")
    }

}


export const verifyOTP = async (email: string, otp: string) => {
    try {
        const response = await axiosInstance.post("/signup/verify_otp", { email, otp })
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "OTP verification failed");
    }
}


export const resentOTP = async (email: string) => {
    try {
        const response = await axiosInstance.post("/signup/resend_otp", { email })
        console.log(response);

        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Resend OTP failed");
    }
}


export const login = async (email: string, password: string): Promise<{ accessToken: string, user: IUser }> => {


    try {
        const response = await axiosInstance.post("/login", { email, password }, { withCredentials: true })

        const { accessToken, user } = response.data

        return { accessToken, user }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {

            throw new Error(error.response?.data?.error || "Login failed")
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}


export const forgotPassword = async (email: string) => {
    try {

        const response = await axiosInstance.post("/forgot-password", { email })
        return response.data
    } catch (error: unknown) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage)
    }

}


export const updatePassword = async (email: string, password: string) => {
    try {


        const response = await axiosInstance.post("/update-password", { email, password })

        return response.data

    } catch (error: unknown) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage)
    }
}

export const googleAuth = async (role: "patient" | "doctor") => {
    console.log("auth service :", role);

    window.location.href = `${process.env.NEXT_PUBLIC_API_URI}/auth/google?role=${role}`;
};


export const fetchTokens = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/auth/tokens`, {
            withCredentials: true, //  Ensures cookies are sent
        });

        return response.data; // { accessToken, role }
    } catch (error) {
        console.error("Error fetching tokens:", error);
        throw new Error("Failed to fetch authentication tokens.");
    }
};

export const logout = async () => {
    try {
        await axiosInstance.post("/logout", {}, { withCredentials: true })

    } catch (error) {
        console.error("Error during logout:", error);
        throw new Error("Logut failed")
    }
}


export const fetchPatientProfile = async (): Promise<IUserFullData | null> => {
    try {
        const response = await axiosInstance.get("/profile");
        return response.data.user
    } catch (error) {
        console.error("Error fetching patient profile:", error);
        return null;
    }
}

export const getAllActiveDepartments = async () => {

    try {

        const response = await axiosInstanceDoctor.get("/get-all-active-departments")
        return response.data

    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;
    }

}


export const getAllSubscribedDoctors = async (filters?: {
    search?: string
    departmentId?: string;
    gender?: string;
    experience?: string;
    availability?: string;
    searchQuery?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}): Promise<{ doctors: IDoctor[]; total: number; totalPages: number }> => {
    try {


        const response = await axiosInstanceDoctor.get("/doctors", { params: filters });



        // Return the correctly structured response
        return {
            doctors: response.data.doctors,
            total: response.data.total,
            totalPages: response.data.totalPages
        };
    } catch (error) {
        console.error("Error fetching subscribed doctors:", error);
        throw error;
    }
};


export const getDoctorById = async (doctorId: string) => {
    try {



        const response = await axiosInstance.get(`/doctor-profile/${doctorId}`)


        return response.data
    } catch (error) {
        console.error("Error fetching doctor profile:", error);
        throw error;
    }
}


export const changeUserPassword = async (userId: string, oldPassword: string, newPassword: string) => {
    try {

        const response = await axiosInstance.put("/change-password", { userId, oldPassword, newPassword })
        return response
    } catch (error) {

        console.error("User password change Error", error);
        throw error


    }
}


export const userCompleteRegistration = async (data: IUserDetails) => {
    try {

        console.log("--->", data);


        const response = await axiosInstance.put("/complete-registration", data)

        return response

    } catch (error) {
        console.error("User complete registration error");
        throw error
    }
}

export const userProfileEdit = async (data: Partial<UserProfileData>) => {

    console.log("=======>>>>", data.user);



    try {
        const user = data.user
        const updatedata = {
            address: { ...user?.address },
            email: user?.email,
            fullName: user?.fullName,
            mobile: user?.mobile,
            personalInfo: { ...user?.personalInfo }
        }

        console.log(">>>>>>", updatedata)


        const response = await axiosInstance.put("/complete-registration", updatedata)
        console.log("------------------>", response.data);

        return response

    } catch (error) {
        console.error("user profile update error");
        throw error
    }

}



export const getDoctorScheduleByDate = async (doctorId: string, date: Date) => {

    try {

        const formattedDate = formatDate(date)

        const response = await axiosInstance.get(`/schedules`, {
            params: {
                doctorId,
                date: formattedDate
            }
        })

        console.log("vannath==>", response.data)
        return response.data

    } catch (error) {
        // console.error("Error fetching schedules:", error);
        throw error;
    }

}



export const initiateConsultationBooking = async (data: InitiateBookingPayload): Promise<IInitiateBookingResponse> => {

    try {

        const response = await axiosInstance.post("/consultation-booking/initiate", data)

        console.log("initiateConsultationBooking==>", response.data)

        return response.data.data

    } catch (error) {
        console.error("initiateConsultationBooking error:", error);
        throw error;
    }

}


export const verifyConsultationBooking = async (data: VerifyBookingPayload): Promise<IVerifyBookingResponse> => {


    try {
        const response = await axiosInstance.post("/consultation-booking/verify", data);
        return response.data.data;

    } catch (error) {

        console.error("verifyConsultationBooking error:", error);
        throw error;

    }
}



export const getBookingDetails = async (bookingId: string, slotId: string): Promise<ApiResponse> => {
    try {

        console.log("get Booking====>", bookingId, slotId);




        const response = await axiosInstance.get("/consultation-booking/details", {
            params: {
                bookingId,
                slotId
            }
        })

        console.log("succes page ill kittith ===>", response.data);


        return response.data

    } catch (error) {
        throw error
    }
}



export const getAppoinments = async (filter: string): Promise<AppointmentListItemDTO[]> => {
    try {

        const response = await axiosInstance.get("/my-appoinments", {
            params: {
                status: filter
            }
        })
        console.log(response.data)

        return response.data.data
    } catch (error) {

        throw error

    }
}

export const getAppoinmentsDetails = async (id: string): Promise<AppointmentDetailDTO> => {
    try {

        console.log("get appoinment===id", id);


        const response = await axiosInstance.get(`/my-appoinments-detail/${id}`);

        return response.data.data

    } catch (error) {

        throw error

    }
}


export const CancelAppointment = async (appointmentId: string, reason?: string): Promise<CancelAppointmentResponseDTO> => {
    try {

        const response = await axiosInstance.patch(`/appointments/${appointmentId}/cancel`, { reason })

        return response.data

    } catch (error: any) {

        const axiosError = error as AxiosError<{ error: string }>;

        const errorMessage =
            axiosError.response?.data?.error || "Failed to cancel the appointment";

        console.error("CancelAppointment error:", errorMessage);
        throw new Error(errorMessage);

    }
}