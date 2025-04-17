// "use client";

import DoctorChatWrapper from "@/components/chatComponets/DoctorChatWrapper"

// import ChatHeader from "@/components/chatComponets/ChatHeader";
// import ChatInbox from "@/components/chatComponets/ChatInbox";
// import ChatInput from "@/components/chatComponets/ChatInput";
// import ChatMessageList from "@/components/chatComponets/ChatMessageList";
// import { doctorChatTheme } from "@/components/chatComponets/chatTheme";
// import { getChatInboxDoctor, getMessagesWithUserDoctor } from "@/services/doctor/chatServiceDoctor";
// import { useAuthStoreDoctor } from "@/store/doctor/authStore";
// import { Roles } from "@/types/chat";
// import { getSocket } from "@/utils/socket";
// import React, { useEffect, useState } from "react";


// // Types
// export interface ChatUser {
//   _id: string;
//   fullName: string;
//   isOnline: boolean;
//   profileUrl: string;
//   lastMessage: string;
//   lastMessageTime: string;
//   unreadCount: number;
// }

// export interface Message {
//   fromSelf: boolean;
//   text: string;
//   time: string;
// }
// export const formatTime = (date: Date) =>
//     date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  

// const ChatPage = () => {
//   const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [showInbox, setShowInbox] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const doctor = useAuthStoreDoctor();
//   const doctorId = doctor.user?.id;
//   const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(()=>{

//     const fetchInbox = async () => {
//         try {
//           const data = await getChatInboxDoctor();
//           setChatUsers(data);
//         } catch (err) {
//           console.error("Failed to fetch doctor chat inbox", err);
//         }
//     }
//     fetchInbox()

//   },[])

//   useEffect(()=>{
//     const fetchMessages = async () =>{
//         if(!selectedUser)return;

//         try {
//             const data = await getMessagesWithUserDoctor(selectedUser._id);
//             setMessages(data);
//           } catch (err) {
//             console.error("Failed to fetch messages with patient", err);
//           }
//     }

//     fetchMessages()
//   },[selectedUser])




//   useEffect(() => {
//     const socket = getSocket();

//     if (!socket) return;

//     const handleReceive = (message: any) => {
//       console.log("📥 Doctor received message:", message);

//       if (selectedUser && message.senderId === selectedUser._id) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             fromSelf: false,
//             text: message.text,
//             time: new Date().toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//           },
//         ]);
//       }
//     };

//     socket.on("receive-message", (message)=>{

//         const { senderId, text } = message;

//         if(selectedUser && senderId === selectedUser._id){

//             setMessages((prev) => [...prev, {
//                 fromSelf: false,
//                 text,
//                 time: formatTime(new Date()),

//               }]);
//         }else{
//             setChatUsers((prevUsers) =>
//                 prevUsers.map((user) =>
//                   user._id === senderId
//                     ? { ...user, unreadCount: user.unreadCount + 1 }
//                     : user
//                 )
//               );
//         }

//     });

//     socket.on("receive-message", handleReceive);

//     return () => {
//       socket.off("receive-message", handleReceive);
//     };
//   }, [selectedUser]);

//   const handleSendMessage = (text: string) => {
//     const socket = getSocket();
//     if (!selectedUser || !socket || !doctorId) return;

//     const payload = {
//       senderId: doctorId,
//       receiverId: selectedUser._id,
//       text,
//        fromRole: Roles.DOCTOR,
//         toRole: Roles.USER
//     };

//     console.log("==>",payload);
    

//     setMessages(prev => [
//         ...prev,
//         {
//           fromSelf: true,
//           text,
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         }
//       ]);

//     socket.emit("send-message", payload)
//   };


//   const handleSelectUser = (user: ChatUser) => {
//     setSelectedUser(user);
  
//     setChatUsers((prev) =>
//       prev.map((u) =>
//         u._id === user._id ? { ...u, unreadCount: 0 } : u
//       )
//     );
  
//     if (isMobile) setShowInbox(false);
//   };
  


//   return (
//     <div className="flex h-screen bg-white">
//       {/* Left Sidebar: Chat Inbox */}
//       {(!isMobile || showInbox) && (
//         <div className={`${isMobile ? "w-full" : "w-1/3"} h-full`}>
//           <ChatInbox
//             users={chatUsers}
//             selectedUserId={selectedUser?._id || null}
//             onSelectUser={setSelectedUser}
//             theme={doctorChatTheme}
//           />
//         </div>
//       )}

//       {/* Chat View */}
//       {(!isMobile || !showInbox) && selectedUser && (
//         <div
//           className={`${isMobile ? "w-full" : "w-2/3"} h-full flex flex-col`}
//         >
//           <ChatHeader
//             selectedUser={selectedUser}
//             isMobile={isMobile}
//             onBackClick={() => setShowInbox(true)}
//             theme={doctorChatTheme}
//           />
//           <ChatMessageList messages={messages} theme={doctorChatTheme} />
//           <ChatInput
//             onSendMessage={handleSendMessage}
//             theme={doctorChatTheme}
//           />
//         </div>
//       )}

//       {/* Empty View */}
//       {(!isMobile || !showInbox) && !selectedUser && (
//         <div className="w-2/3 h-full flex items-center justify-center bg-gray-50">
//           <div className="text-center text-gray-500">
//             <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
//             <p>Choose a chat from the list to start messaging</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// export default ChatPage;


const DoctorChat = () =>{
  return <DoctorChatWrapper/>
}


export default DoctorChat
















