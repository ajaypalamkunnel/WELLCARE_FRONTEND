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
        return response
    } catch (error) {

        console.error("Error doctor registration:", error);
        throw error;
        
    }

}
