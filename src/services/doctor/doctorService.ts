import { FilterParams } from "@/components/doctorComponents/AppoinmentSchedules";
import { DoctorProfileUpdateForm } from "@/components/doctorComponents/forms/modals/EditProfileModal";
import { CertificationFormData, EducationFormData } from "@/components/doctorComponents/forms/qualification/QualificationManagement";
import { RecurringScheduleForm } from "@/components/doctorComponents/RecurringScheduleModal";
import { FormValues, ScheduleCreationData } from "@/components/doctorComponents/ScheduleModal";
import { ServiceData } from "@/components/doctorComponents/ServiceComponent";
import { RazorpayPaymentResponse } from "@/components/doctorComponents/Subscription";
import { API_PREFIX } from "@/constants/apiRoutes";
import { ChatUser } from "@/types/chat";
import { AppointmentStatusSummary } from "@/types/dashboardDto";
import  { ICertificate } from "@/types/doctorFullDataType";
import { DoctorFormValues } from "@/types/doctorRegistrationFormTypes";
import { NotificationDTO } from "@/types/notificationDto";
import { SubmitPrescriptionPayload } from "@/types/prescription";
import { ApiResponseDoctorAppointmentListItemDTO, AppointmentFilters, DoctorAppointmentDetailDTO } from "@/types/slotBooking";
import axiosInstancePatinet from "@/utils/axiosInstance";
import axiosInstanceDoctor from "@/utils/axiosInstanceDoctor";
import { getErrorMessage } from "@/utils/handleError";
import axios, { AxiosError } from "axios";

export const featchAllDepartments = async () => {
    try {
        const response = await axiosInstanceDoctor.get(`${API_PREFIX.ADMIN}/getalldepartments`)

        return response.data
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
}
export const doctorRegistration = async (doctorProfileData: DoctorFormValues) => {

    try {

        console.log("==>",doctorProfileData);
        
        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/doctorregistration`, doctorProfileData)
        setTimeout(() => {

        }, 1000)

        return response.data
    } catch (error) {

        console.error("Error doctor registration:", error);
        throw error;

    }

}


export const updateDoctorProfile = async (doctorId: string, data: DoctorProfileUpdateForm) => {

    try {

        const response = await axiosInstanceDoctor.put(`${API_PREFIX.DOCTOR}/doctor-profile-update`, { doctorId, updateData: data })
        return response

    } catch (error) {
        console.error("Error doctor registration:", error);
        throw error;

    }

}



export const changePassword = async (doctorId: string, oldPassword: string, newPassword: string) => {

    try {

        const response = await axiosInstanceDoctor.put(`${API_PREFIX.DOCTOR}/change-password`, { doctorId, oldPassword, newPassword })

        return response

    } catch (error) {
        console.error("Error doctor change-password:", error);
        throw error;
    }

}

export const getAllSubscriptionPlans = async () => {
    try {

        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/subscription-plans`)
        return response.data
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;

    }
}

export const createSubscriptionOrder = async (doctorId: string, planId: string) => {

    try {

        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/create-order`, { doctorId, planId })
        return response.data
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }

}

export const verifyPayment = async (paymentData: RazorpayPaymentResponse) => {
    try {
        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/verify-payment`, paymentData);
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
};


export const createService = async (data: ServiceData) => {
    try {

        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/create-service`, data)
        return response.data

    } catch (error) {
        
        throw error;
    }
}


export const getServices = async (doctorId: string) => {
    try {

        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/get-services`, {
            params: { doctorId }
        });

        return response.data

    } catch (error) {
        console.error("Error while featching services")
        throw error
    }
}



export const updateService = async (updatedData: ServiceData) => {

    try {
        console.log("--->", updatedData);

        const response = await axiosInstanceDoctor.put(`${API_PREFIX.DOCTOR}/update-service`, updatedData)
        return response.data

    } catch (error) {
        console.error("Error while Updating service");
        throw error

    }
}


export const getDoctorSubscription = async (subscriptionId: string) => {
    try {

        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/get-my-subscription/${subscriptionId}`)

        return response.data

    } catch (error) {
        console.log("Error while get doctor subscription data");
        throw error
    }
}


export const validateSchedule = async (data: FormValues) => {
    try {
        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/validate-schedule`, data);
        console.log("validate schedule", response.data)

        return response.data;

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error
        }

        throw new Error(getErrorMessage(error))
    }
};

export const generateSlote = async (data: FormValues) => {

    try {
        console.log("i am service==> ", data);

        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/generate-slots`, data)

        return response.data

    } catch (error: unknown) {
        console.error("Error while slot generation:", error);
        return {
            success: false,
            message: getErrorMessage(error)
        };
    }

}

export const createSchedule = async (data: ScheduleCreationData) => {
    try {

        console.log("going data**", data);

        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/create-schedule`, data)

        return response.data

    } catch (error: unknown) {
        console.error("Error while creating schedule:", error);
        return {
            success: false,
            message: getErrorMessage(error)
        };
    }
}




export const generateRecurringSlots = async (data: RecurringScheduleForm & { doctorId: string }) => {
  try {

    console.log("generate Recuring slots : ",data);
    


    const response = await axiosInstanceDoctor.post(
      `${API_PREFIX.DOCTOR}/generate-recurring-slots`,
      data
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Error while generating recurring slots:", error);
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const createMultiDaySchedule = async (data: RecurringScheduleForm & { doctorId: string }) => {
  try {
    const response = await axiosInstanceDoctor.post(
      `${API_PREFIX.DOCTOR}/create-multi-day-schedule`,
      data
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Error while creating recurring schedule:", error);
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};





export const fetchSchedules = async (params: FilterParams) => {
    try {

        console.log("...",params);

        // Convert params object to URLSearchParams
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                // Handle Date objects by converting to ISO string and taking just the date part
                if (value instanceof Date) {
                    queryParams.append(key, value.toISOString().split('T')[0]);
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });

        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/fetch-schedules?${queryParams.toString()}`);

        console.log("Evade kitttitoo", response.data.data);

        return response.data.data;
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
};


export const getDoctorAppointments = async (
    filters: AppointmentFilters
): Promise<ApiResponseDoctorAppointmentListItemDTO> => {
    try {

        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/appointments`, {
            params: filters,
        });

        return response.data.data;
    } catch (error) {
        console.error("Error while fetching doctor appointments:", error);
        throw error;
    }
};



export const getDoctorAppointmentDetail = async (appointmentId: string): Promise<DoctorAppointmentDetailDTO> => {
    try {
        const response = await axiosInstanceDoctor.get(
            `${API_PREFIX.DOCTOR}/appointments/${appointmentId}/details`
        );

        // Assuming your backend response follows: { success: true, message: "...", data: {...} }
        return response.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ error: string }>;

        const errorMessage =
            axiosError.response?.data?.error || "Failed to fetch appointment detail";

        console.error("getDoctorAppointmentDetail error:", errorMessage);
        throw new Error(errorMessage);
    }
}



export const getChatInboxDoctor = async (): Promise<ChatUser[]> => {
    try {

        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/inbox`);

        return response.data.data

    } catch (error) {

        throw error
    }
}

export const getDoctorBasicInfo = async (doctorId: string): Promise<ChatUser> => {

    try {
        const response = await axiosInstancePatinet.get(`/api/doctor/doctor-info/${doctorId}`);

        return response.data.data;

    } catch (error) {

        console.error("❌ getDoctorBasicInfo failed", error);

        throw error

    }

}




export const markMessagesAsReadDoctor = async (receiverId: string) => {
    return await axiosInstanceDoctor.patch(`/api/chat/messages/mark-read/${receiverId}`)
}



export const editEducation = async () => {

}

export const addNewEducation = async (data: EducationFormData) => {

    try {

        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/profile/addeducation`, data)

        return response.data.data

    } catch (error) {

        console.error("add new education", error);
        throw error

    }

}


export const addNewCertification = async (data: ICertificate) => {

    try {

        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/profile/addCertificate`, data)

        return response.data.data

    } catch (error) {

        throw error

    }

}



export const updateEducation = async (data: EducationFormData) => {

    try {
        console.log(data);

        const response = await axiosInstanceDoctor.put(`${API_PREFIX.DOCTOR}/profile/updateEducation`, data)

        return response.data

    } catch (error) {

        console.error("Update education error:", error);

        throw error

    }

}



export const updateCertification = async (data: CertificationFormData) => {

    try {
        console.log(data);

        const response = await axiosInstanceDoctor.put(`${API_PREFIX.DOCTOR}/profile/updateCertification`, data)

        return response.data

    } catch (error) {

        console.error("Update education error:", error);

        throw error

    }

}




export const cancelSchedule = async (reason: string, selectedScheduleId: string) => {

    try {

        const response = await axiosInstanceDoctor.patch(`${API_PREFIX.DOCTOR}/schedules/${selectedScheduleId}/cancel`, {
            reason: reason
        })

        return response.data
    } catch (error) {

        // console.error("error while cancelling schedule",error);

        throw error

    }

}


export const submitPrescription = async (data: SubmitPrescriptionPayload) => {
    try {
        console.log(data);

        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/submit-prescription`, data)
        return response.data
    } catch (error) {
        console.error("Prescription submission failed:", error);
        throw error;
    }
}


export const getWalletSummary = async (type?: "credit" | "debit", page = 1, limit = 10) => {
    try {
        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/getWalletSummary`, {
            params: { type, page, limit }
        });

        return response.data.data;

    } catch (error) {
        console.error("Wallet summary fetch failed:", error);
        throw error;
    }
};


export const withdrawAmountApi = async (amount: number) => {
    try {
        const response = await axiosInstanceDoctor.post(`${API_PREFIX.DOCTOR}/withdraw`, { amount });
        return response.data;
    } catch (error) {
        console.error("Withdraw failed:", error);
        throw error;
    }
};



export const getAppointmentSummary = async (
    startDate?: string,
    endDate?: string
): Promise<AppointmentStatusSummary> => {

    try {

        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/appointment-summary`, {
            params: { startDate, endDate }
        })

        return response.data.data
    } catch (error) {
        console.error("Failed to fetch appointment summary:", error);
        throw error;
    }

}


export const getAppointmentTrend = async (
    startDate: string,
    endDate: string,
    interval: "day" | "week" | "month"
) => {
    try {

        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/appointment-trend`, {
            params: { startDate, endDate, interval },
        });
        return response.data.data;

    } catch (error) {
        console.error("Failed to fetch appointment trend:", error);
        throw error;
    }
}

export const getRevenueTrend = async (
    startDate: string,
    endDate: string,
    interval: "day" | "week" | "month"
) => {
    try {
        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/revenue-trend`, {
            params: { startDate, endDate, interval },
        });
        return response.data.data;
    } catch (error) {
        console.error("Revenue trend fetch failed:", error);
        throw error;
    }
};


export const getTopServices = async (
    startDate: string,
    endDate: string,
    interval: "day" | "week" | "month"
) => {
    try {
        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/top-services`, {
            params: { startDate, endDate, interval },
        });

        return response.data.data;
    } catch (error) {
        console.error("Top services fetch failed:", error);
        throw error;
    }
};


export const generateDoctorReport = async (
    startDate: string,
    endDate: string,
    format: "pdf" | "excel"
) => {
    try {
        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/generate-report`, {
            params: { startDate, endDate, format },
        });

        return response.data.data; // includes downloadUrl
    } catch (error) {
        console.error("Report generation failed:", error);
        throw error;
    }
};


export const fetchNotificationsDoctor = async () => {
    try {
        const response = await axiosInstanceDoctor.get(`${API_PREFIX.DOCTOR}/get-notifications`,);

        console.log("==>",response.data.data);
        
        return response.data.data as NotificationDTO[];

    } catch (error) {
        console.log(error);
        
        throw error
    }
};
