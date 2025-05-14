import {ChatUser, Message } from "@/types/chat";
import axiosInstanceDoctor from "@/utils/axiosInstanceDoctor";


export const getChatInboxDoctor = async (): Promise<ChatUser[]> => {
    try {
        const response = await axiosInstanceDoctor.get("/api/doctor/inbox");
        return response.data.data
        
    } catch (error) {
        throw error
    }
};


//for get message histroy this is used by doctor componennt
export const getMessagesWithUserDoctor = async (patientId: string): Promise<Message[]> => {

    try {
        const response = await axiosInstanceDoctor.get(`/api/chat/history/${patientId}`);

        
        return response.data.data
        
    } catch (error) {
        throw error
    }
  };