// "use client";

import ChatWrapper from "@/components/chatComponets/ChatWrapper"

// import ChatHeader from "@/components/chatComponets/ChatHeader";
// import ChatInbox from "@/components/chatComponets/ChatInbox";
// import ChatInput from "@/components/chatComponets/ChatInput";
// import ChatMessageList from "@/components/chatComponets/ChatMessageList";
// import { userChatTheme } from "@/components/chatComponets/chatTheme";
// import React, { useEffect, useState } from "react";
// import { getSocket } from "@/utils/socket";
// import { useAuthStore } from "@/store/user/authStore";
// import { useParams } from "next/navigation";
// import {
  
//   getMessagesWithUser,
// } from "@/services/user/auth/chatServiceUser";
// import { formatTime } from "@/app/doctordashboard/chat/page";
// import { Roles } from "@/types/chat";
// import { getChatInboxUser } from "@/services/user/auth/authService";

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

// const ChatPage = () => {
//   const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [showInbox, setShowInbox] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const user = useAuthStore();
//   const userId = user.user?.id;
//   const params = useParams();
//   const doctorId = params?.doctorId as string;
//   const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (doctorId) {
//       const doctorFromList = chatUsers.find((user) => user._id === doctorId);
//       if (doctorFromList) {
//         setSelectedUser(doctorFromList);
//         setShowInbox(false); // hide inbox if mobile
//       }
//     }
//   }, [doctorId, chatUsers]);

//   useEffect(() => {
//     const fetchInbox = async () => {
//       try {
//         const data = await getChatInboxUser();
//         console.log("chat inbox api response : =>",data);
        
//         setChatUsers(data);
//     } catch (error) {
//         console.error(" Failed to fetch inbox", error);
//     }
// };
// fetchInbox();
// }, []);

// useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedUser) return;
//       try {
//           const data = await getMessagesWithUser(selectedUser._id);
          
//           console.log("get messages api response : =>",data);
        
//         setMessages(data);
//       } catch (error) {
//         console.error(" Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [selectedUser]);

//   useEffect(() => {
//     const socket = getSocket();

//     if (!socket) return;

//     const handleReceive = (message: { senderId: string; text: string }) => {
//       console.log("📥 Received message:", message);

//       if (selectedUser && message.senderId === selectedUser._id) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             fromSelf: false,
//             text: message.text,
//             time: formatTime(new Date()),
//           },
//         ]);
//       } else {
//         setChatUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user._id === message.senderId
//               ? { ...user, unreadCount: user.unreadCount + 1 }
//               : user
//           )
//         );
//       }
//     };

//     socket.on("receive-message", handleReceive);

//     return () => {
//       socket.off("receive-message");
//     };
//   }, [selectedUser]);

//   const handleSendMessage = (text: string) => {
//     const socket = getSocket();

//     if (!selectedUser || !socket || !userId) return;

//     const messagePayload = {
//       senderId: userId,
//       receiverId: selectedUser._id,
//       text,
//       fromRole:Roles.USER,
//       toRole:Roles.DOCTOR
//     };

//     const newMessage = {
//       fromSelf: true,
//       text,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setMessages((prev) => [...prev, newMessage]);

//     socket.emit("send-message", messagePayload);
//   };

//   return (
//     <div className="flex h-screen bg-white">
//       {/* Left Sidebar: Chat Inbox */}
//       {(!isMobile || showInbox) && (
//         <div className={`${isMobile ? "w-full" : "w-1/3"} h-full`}>
//           <ChatInbox
//             users={chatUsers}
//             selectedUserId={selectedUser?._id || null}
//             onSelectUser={(user) => {
//               setSelectedUser(user);
//               setChatUsers((prev) =>
//                 prev.map((u) =>
//                   u._id === user._id ? { ...u, unreadCount: 0 } : u
//                 )
//               );
//               if (isMobile) setShowInbox(false);
//             }}
//             theme={userChatTheme}
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
//             theme={userChatTheme}
//           />
//           <ChatMessageList messages={messages} theme={userChatTheme} />
//           <ChatInput onSendMessage={handleSendMessage} theme={userChatTheme} />
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


const ChatPage = () =>{
    return <ChatWrapper/>
}

export default ChatPage