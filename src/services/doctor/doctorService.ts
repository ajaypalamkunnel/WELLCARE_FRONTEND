import { DoctorProfileUpdateForm } from "@/components/doctorComponents/forms/modals/EditProfileModal";
import { ServiceData } from "@/components/doctorComponents/ServiceComponent";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import axiosInstanceDoctor from "@/utils/axiosInstanceDoctor";

export const featchAllDepartments = async () => {
    try {
        const response = await axiosInstanceDoctor.get("/api/admin/getalldepartments")

        return response.data
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
}

export const doctorRegistration = async (doctorProfileData: IDoctorProfileDataType) => {

    try {

        console.log("doctorRegistration service ===>", doctorProfileData);

        const response = await axiosInstanceDoctor.post("/api/doctor/doctorregistration", doctorProfileData)
        setTimeout(() => {
            console.log("API from service====>", response);

        }, 1000)

        return response.data
    } catch (error) {

        console.error("Error doctor registration:", error);
        throw error;

    }

}


export const updateDoctorProfile = async (doctorId: string, data: DoctorProfileUpdateForm) => {

    try {

        const response = await axiosInstanceDoctor.put("/api/doctor/doctor-profile-update", { doctorId, updateData: data })
        return response

    } catch (error) {
        console.error("Error doctor registration:", error);
        throw error;

    }

}



export const changePassword = async (doctorId: string, oldPassword: string, newPassword: string) => {

    try {

        const response = await axiosInstanceDoctor.put("/api/doctor/change-password", { doctorId, oldPassword, newPassword })

        return response

    } catch (error) {
        console.error("Error doctor change-password:", error);
        throw error;
    }



}

export const getAllSubscriptionPlans = async () => {
    try {

        const response = await axiosInstanceDoctor.get("/api/doctor/subscription-plans")
        return response.data
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;

    }
}

export const createSubscriptionOrder = async (doctorId: string, planId: string) => {

    try {

        const response = await axiosInstanceDoctor.post("/api/doctor/create-order", { doctorId, planId })
        return response.data
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }

}

export const verifyPayment = async (paymentData: any) => {
    try {
        const response = await axiosInstanceDoctor.post("/api/doctor/verify-payment", paymentData);
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
};


export const createService = async (data: ServiceData) => {
    try {

        const response = await axiosInstanceDoctor.post("/api/doctor/create-service", data)
        return response.data

    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
}


export const getServices = async (doctorId: string) => {
    try {

        console.log(".......", doctorId);

        const response = await axiosInstanceDoctor.get("/api/doctor/get-services", {
            params: { doctorId }
        });

        console.log(response);

        return response.data


    } catch (error) {
        console.error("Error while featching services")
        throw error
    }
}



export const updateService = async (updatedData: ServiceData) => {

    try {
        console.log("--->", updatedData);

        const response = await axiosInstanceDoctor.put("/api/doctor/update-service", updatedData)
        return response.data

    } catch (error) {
        console.error("Error while Updating service");
        throw error

    }
}