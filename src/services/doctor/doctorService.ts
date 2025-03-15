import { DoctorProfileUpdateForm } from "@/components/doctorComponents/forms/modals/EditProfileModal";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import axiosInstanceDoctor from "@/utils/axiosInstanceDoctor";

export const featchAllDepartments = async ()=>{
    try {
        const response = await axiosInstanceDoctor.get("/api/admin/getalldepartments")

        return response.data
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
}

export const doctorRegistration = async (doctorProfileData:IDoctorProfileDataType)=>{

    try {

        console.log("doctorRegistration service ===>",doctorProfileData);
        
        const response = await axiosInstanceDoctor.post("/api/doctor/doctorregistration",doctorProfileData)
        return response.data
    } catch (error) {

        console.error("Error doctor registration:", error);
        throw error;
        
    }

}


export const updateDoctorProfile = async (doctorId:string,data:DoctorProfileUpdateForm)=>{

    try {

        const response = await axiosInstanceDoctor.put("/api/doctor/doctor-profile-update",{doctorId,updateData:data})
        return response
        
    } catch (error) {
        console.error("Error doctor registration:", error);
        throw error;
        
    }

}



export const changePassword = async (doctorId:string,oldPassword:string,newPassword:string)=>{

    try {

        const response = await axiosInstanceDoctor.put("/api/doctor/change-password",{doctorId,oldPassword,newPassword})

        return response
        
    } catch (error) {
        console.error("Error doctor change-password:", error);
        throw error;
    }



}