import { PlanFormData } from "@/components/admin/ui/NewPlanModalForm";
import { API_PREFIX } from "@/constants/apiRoutes";
import { DoctorAnalyticsSummaryDTO, RevenueDoctorTrendDTO, ServiceRevenueDTO, TopDoctorDTO } from "@/types/adminDashboardDoctoryAnlyticsDto";
import { PlanDistributionDTO, RevenueTrendDTO, SubscriptionOverviewDTO } from "@/types/adminReportDto";
import axiosInstanceAdmin from "@/utils/axiosInstanceAdmin"
import axios from "axios";


export const createDepartment = async (name: string, icon: string) => {
    try {
        const response = await axiosInstanceAdmin.post(`${API_PREFIX.ADMIN}/adddepartment`, { name, icon })
        console.log(response);
        return response.data
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create department";
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred");
    }
}


export const featchAllDepartments = async () => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/getalldepartments`)
        return response.data
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
}



export const fetchAllPaginatedDepartments = async (page:number=1) =>{
    try {

        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/getallPaginateddepartments?page=${page}&limit=6`)

        return response.data
        
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
}


export const updateDoctorStatus = async (_id: string, newStatus: number) => {
    try {
        console.log("updated servicee");
        const response = await axiosInstanceAdmin.put(`${API_PREFIX.ADMIN}/update-doctor-status`, { doctorId: _id, status: newStatus })
        return response
    } catch (error) {
        console.error("Error doctor status update:", error);
        throw error;
    }
}

export const verifyDoctorApplication = async (_id: string, isVerified: boolean, reason?: string) => {
    try {
        const response = await axiosInstanceAdmin.put(`${API_PREFIX.DOCTOR}/verify-doctor`, { doctorId: _id, isVerified, reason })
        return response
    } catch (error) {
        console.error("Error doctor registration:", error);
        throw error
    }
}

export const fetchAllPatients = async (currentPage: number, limit: number, searchTerm: string) => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/users?page=${currentPage}&limit=${limit}&search=${searchTerm}`)
        return response.data
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
}


export const updateUserStatus = async (userId: string, status: number) => {
    try {
        const response = await axiosInstanceAdmin.put(`${API_PREFIX.ADMIN}/updateStatus`, { userId, status })
        return response
    } catch (error) {
        console.error("Error user update:", error);
        throw error;
    }
}


export const updateDepartmentStatus = async (deptId: string, status: boolean) => {
    try {
        const response = await axiosInstanceAdmin.put(`${API_PREFIX.ADMIN}/update-department-status`, { deptId, status })
        return response
    } catch (error) {
        console.error("Error updating department status:", error);
        throw error;
    }
}


export const createNewPlan = async (data: PlanFormData) => {
    try {
        const response = await axiosInstanceAdmin.post(`${API_PREFIX.ADMIN}/create-subscription-plan`, { subscriptionData: data })
        return response
    } catch (error) {
        console.error("Error while creating plan");
        throw error
    }
}

export const getAllSubscriptionPlans = async (page:number,limit:number) => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/get-subscription-plans?page=${page}&limit=${limit}`)
        return response
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;
    }
}


export const updateSubscriptionPlanStatus = async (planId: string) => {
    try {
        const response = await axiosInstanceAdmin.put(`${API_PREFIX.ADMIN}/toggle-subscription-status`, { planId })
        return response
    } catch (error) {
        console.error("Error updating subscription plan status:", error);
        throw error;
    }
}


export const updateSubscriptionPlan = async (planId: string, data: PlanFormData) => {
    try {
        const response = await axiosInstanceAdmin.put(`${API_PREFIX.ADMIN}/update-plan`, { planId, updatedData: data });
        return response;
    } catch (error) {
        console.error("Error updating subscription plan:", error);
        throw error;
    }
};


export const fetchSubscriptionOverview = async () => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/subscription/overview`);
        return response.data.data as SubscriptionOverviewDTO;
    } catch (error) {
        console.error("Error fetching subscription overview:", error);
        throw error;
    }
};


export const fetchRevenueTrend = async (
    startDate: string,
    endDate: string,
    interval: "day" | "week" | "month"
): Promise<RevenueTrendDTO[]> => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/subscription/revenue-trend`,
            { params: { startDate, endDate, interval }, }
        )
        console.log("fetchRevenueTrend ==>", response.data.data);
        return response.data.data
    } catch (error) {
        console.error("Error fetching revenue trend:", error);
        throw error;
    }
}



export const fetchPlanDistribution = async (startDate?: string, endDate?: string) => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/subscription/plan-distribution`, {
            params: { startDate, endDate }
        })
        console.log("data : ", response.data.data);
        return response.data.data as PlanDistributionDTO[];
    } catch (error) {
        console.error("Error fetching plan distribution:", error);
        throw error;
    }
}



export const downloadSubscriptionReport = async (
    startDate: string,
    endDate: string,
    format: "pdf" | "excel"
) => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/subscription/report/download`, {
            params: { startDate, endDate, format },
        });
        console.log("link : ", response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error downloading subscription report:", error);
        throw error;
    }
};



export const fetchDoctorAnalyticsSummary = async (): Promise<DoctorAnalyticsSummaryDTO[]> => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/doctor-analytics/summary`);
        return response.data.data as DoctorAnalyticsSummaryDTO[];
    } catch (error) {
        console.error("Error fetching doctor analytics summary:", error);
        throw error;
    }
};



export const fetchDoctorRevenueTrend = async (
    startDate: string,
    endDate: string,
    interval: "day" | "month"
) => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/doctor-analytics/revenue-trend`, {
            params: { startDate, endDate, interval },
        });
        return response.data.data as RevenueDoctorTrendDTO[];
    } catch (error) {
        console.error("Error fetching doctor revenue trend:", error);
        throw error;
    }
};


export const fetchServiceRevenue = async (): Promise<ServiceRevenueDTO[]> => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/doctor-analytics/service-revenue`);
        return response.data.data as ServiceRevenueDTO[];
    } catch (error) {
        console.error("Error fetching service revenue:", error);
        throw error;
    }
};


export const fetchTopPerformingDoctors = async (): Promise<TopDoctorDTO[]> => {
    try {
        const response = await axiosInstanceAdmin.get(`${API_PREFIX.ADMIN}/doctor-analytics/top-performing`);
        return response.data.data as TopDoctorDTO[];
    } catch (error) {
        console.error("Error fetching top-performing doctors:", error);
        throw error;
    }
};


export const fetchDoctorDocument = async (
    type: "license" | "idproof",
    doctorId: string
): Promise<void> => {
    try {
        const response = await axiosInstanceAdmin.get(
            `${API_PREFIX.ADMIN}/view-document/${type}/${doctorId}`,
            {
                responseType: "blob",
            }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (error) {
        console.error(`Error fetching ${type} document for doctor ${doctorId}:`, error);
        throw error;
    }
};
