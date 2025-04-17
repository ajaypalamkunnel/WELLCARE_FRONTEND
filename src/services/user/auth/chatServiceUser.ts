import { ChatUser, Message } from "@/types/chat";
import axiosInstancePatient from "@/utils/axiosInstance";





export const getMessagesWithUser = async (receiverId: string): Promise<Message[]> => {

    try {
        const response = await axiosInstancePatient.get(`/api/chat/history/${receiverId}`);
        
        return response.data.data;
    } catch (error) {
        
        throw error
    }
  };


