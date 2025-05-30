import axiosInstance from "@/utils/axiosInstance"
import { IUser } from "../../../types/userTypes"
import axios, { AxiosError } from "axios";
import { getErrorMessage } from "@/utils/handleError";
import IUserFullData from "@/types/user";
import axiosInstanceDoctor from "@/utils/axiosInstanceDoctor";
import IDoctor from "@/types/IDoctor";
import { IUserDetails } from "@/components/admin/ui/UserRegistrationForm";
import { UserProfileData } from "@/types/userProfileData";
import { ApiResponse, AppointmentDetailDTO, AppointmentListItemDTO, CancelAppointmentResponseDTO, formatDate, IInitiateBookingResponse, InitiateBookingPayload, IVerifyBookingResponse, VerifyBookingPayload } from "@/types/slotBooking";
import { ChatUser } from "@/types/chat";
import { PaginatedTransactionResponseDTO, TransactionQueryParams, WalletSummaryDTO } from "@/types/wallet";
import { NotificationDTO } from "@/types/notificationDto";
import { ReviewFormData } from "@/components/commonUIElements/DoctorReviewForm";
import { API_PREFIX } from "@/constants/apiRoutes";

export const registerBasicDetails = async (data: Partial<IUser>) => {

    try {
        console.log("From registerBasicDetails=>>>", data);

        const response = await axiosInstance.post(`${API_PREFIX.PATIENT}signup/basic_details`, data)
        return response.data
    } catch (error: unknown) {
         if (axios.isAxiosError(error)) {

            throw new Error(error.response?.data?.error || "signup failed")
        } else {
            throw new Error("An unexpected error occurred");
        }
    }

}


export const verifyOTP = async (email: string, otp: string) => {
    try {
        const response = await axiosInstance.post(`${API_PREFIX.PATIENT}signup/verify_otp`, { email, otp })
        return response.data
    } catch (error: unknown) {
         if (axios.isAxiosError(error)) {

            throw new Error(error.response?.data?.error || "OTP verification failed")
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}


export const resentOTP = async (email: string) => {
    try {
        const response = await axiosInstance.post(`${API_PREFIX.PATIENT}signup/resend_otp`, { email })
        console.log(response);

        return response.data
    } catch (error: unknown) {
         if (axios.isAxiosError(error)) {

            throw new Error(error.response?.data?.error || "Resend OTP failed")
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}


export const login = async (email: string, password: string): Promise<{ accessToken: string, user: IUser }> => {


    try {
        const response = await axiosInstance.post(`${API_PREFIX.PATIENT}login`, { email, password }, { withCredentials: true })

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

        const response = await axiosInstance.post(`${API_PREFIX.PATIENT}forgot-password`, { email })
        return response.data
    } catch (error: unknown) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage)
    }

}


export const updatePassword = async (email: string, password: string) => {
    try {


        const response = await axiosInstance.post(`${API_PREFIX.PATIENT}update-password`, { email, password })

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
        await axiosInstance.post(`${API_PREFIX.PATIENT}logout`, {}, { withCredentials: true })

    } catch (error) {
        console.error("Error during logout:", error);
        throw new Error("Logut failed")
    }
}


export const fetchPatientProfile = async (): Promise<IUserFullData | null> => {
    try {
        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}profile`);
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



        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}doctor-profile/${doctorId}`)


        return response.data
    } catch (error) {
        console.error("Error fetching doctor profile:", error);
        throw error;
    }
}


export const changeUserPassword = async (userId: string, oldPassword: string, newPassword: string) => {
    try {

        const response = await axiosInstance.put(`${API_PREFIX.PATIENT}change-password`, { userId, oldPassword, newPassword })
        return response
    } catch (error) {

        console.error("User password change Error", error);
        throw error


    }
}


export const userCompleteRegistration = async (data: IUserDetails) => {
    try {

        


        const response = await axiosInstance.put(`${API_PREFIX.PATIENT}complete-registration`, data)

        return response

    } catch (error) {
        console.error("User complete registration error");
        throw error
    }
}

export const userProfileEdit = async (data: Partial<UserProfileData>) => {

    



    try {
        const user = data.user
        const updatedata = {
            address: { ...user?.address },
            email: user?.email,
            fullName: user?.fullName,
            mobile: user?.mobile,
            personalInfo: { ...user?.personalInfo }
        }




        const response = await axiosInstance.put(`${API_PREFIX.PATIENT}complete-registration`, updatedata)


        return response

    } catch (error) {
        console.error("user profile update error");
        throw error
    }

}



export const getDoctorScheduleByDate = async (doctorId: string, date: Date) => {

    try {

        const formattedDate = formatDate(date)

        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}schedules`, {
            params: {
                doctorId,
                date: formattedDate
            }
        })


        return response.data

    } catch (error) {
        // console.error("Error fetching schedules:", error);
        throw error;
    }

}



export const initiateConsultationBooking = async (data: InitiateBookingPayload): Promise<IInitiateBookingResponse> => {

    try {

        const response = await axiosInstance.post(`${API_PREFIX.PATIENT}consultation-booking/initiate`, data)


        return response.data.data

    } catch (error) {
        console.error("initiateConsultationBooking error:", error);
        throw error;
    }

}


export const verifyConsultationBooking = async (data: VerifyBookingPayload): Promise<IVerifyBookingResponse> => {


    try {
        const response = await axiosInstance.post(`${API_PREFIX.PATIENT}consultation-booking/verify`, data);
        return response.data.data;

    } catch (error) {

        console.error("verifyConsultationBooking error:", error);
        throw error;

    }
}



export const getBookingDetails = async (bookingId: string, slotId: string): Promise<ApiResponse> => {
    try {




        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}consultation-booking/details`, {
            params: {
                bookingId,
                slotId
            }
        })



        return response.data

    } catch (error) {
        throw error
    }
}



export const getAppoinments = async (filter: string): Promise<AppointmentListItemDTO[]> => {
    try {

        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}my-appoinments`, {
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



        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}my-appoinments-detail/${id}`);



        return response.data.data

    } catch (error) {

        throw error

    }
}


export const CancelAppointment = async (appointmentId: string, reason?: string): Promise<CancelAppointmentResponseDTO> => {
    try {

        const response = await axiosInstance.patch(`${API_PREFIX.PATIENT}appointments/${appointmentId}/cancel`, { reason })

        return response.data

    } catch (error: unknown) {

        const axiosError = error as AxiosError<{ error: string }>;

        const errorMessage =
            axiosError.response?.data?.error || "Failed to cancel the appointment";

        console.error("CancelAppointment error:", errorMessage);
        throw new Error(errorMessage);

    }
}



export const getChatInboxUser = async (): Promise<ChatUser[]> => {
    try {


        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}inbox`);

        return response.data.data

    } catch (error) {

        throw error
    }
}




export const getUserBasicInfo = async (userId: string): Promise<ChatUser> => {

    try {
        const response = await axiosInstanceDoctor.get(`/user-info/${userId}`);


        return response.data.data;

    } catch (error) {

        console.error("❌ getUserBasicInfo failed", error);

        throw error

    }

}


export const getWalletSummary = async (): Promise<WalletSummaryDTO> => {
    try {

        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}wallet`);

        return response.data.data

    } catch (error) {

        throw error

    }
}

export const getWalletTransactions = async (params: TransactionQueryParams): Promise<PaginatedTransactionResponseDTO> => {
    try {

        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}wallet/transactions`, {
            params: {
                page: params.page || 1,
                limit: params.limit || 10,
                sort: params.sort || "desc",
            }
        })

        return response.data.data

    } catch (error) {
        throw error;
    }
}


export const fetchNotifications = async () => {
    try {



        const response = await axiosInstance.get(`${API_PREFIX.PATIENT}get-notifications`,);



        return response.data.data as NotificationDTO[];

    } catch (error) {
        throw error
    }
};


export const fetchPrescriptionFile = async (filename: string): Promise<Blob> => {
    const response = await axiosInstance.get(`${API_PREFIX.PATIENT}download-prescription`, {
        params: { filename },
        responseType: "blob",
    });

    return response.data;
};



export const addDoctorReview = async (
    data: ReviewFormData
): Promise<void> => {
    console.log("===>",data.doctorId);
    
    try {

        const response = await axiosInstance.post(`${API_PREFIX.PATIENT}doctors/${data.doctorId}/review`, {
            rating: data.rating,
            reviewText: data.reviewText
        })

        return response.data.data

    } catch (error) {
        console.error("addDoctorReview error:", error);
        throw error;
    }

}