import {io,Socket} from 'socket.io-client'
import { API_BASE_URL } from './axiosInstance';


let socket: Socket | null = null;


export const connectSocket = (userId:string,
    onNotification?: (data: any) => void
) =>{
    if(!socket){
        socket = io(API_BASE_URL,{
            transports:["websocket"],
            withCredentials:true
        })

        socket.on("connect",()=>{
            console.log("✅ Connected to socket:", socket?.id);
            console.log("🔁 Sending user-online:", userId);
             // Emit user-online

             socket?.emit("user-online",{userId})
        })

        socket.on("disconnect",()=>{
            console.log("❌ Disconnected from socket:", socket?.id);
            
        })

        // Notification Event
        socket.on("receive-notification",(notification)=>{
            console.log("🔔 New Notification Received:", notification);
            if (onNotification) onNotification(notification);

        })
    }
}

export const getSocket = ():Socket | null => socket