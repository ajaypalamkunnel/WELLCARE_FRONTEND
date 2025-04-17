// ChatWrapper.tsx
"use client";

import ChatHeader from "@/components/chatComponets/ChatHeader";
import ChatInbox from "@/components/chatComponets/ChatInbox";
import ChatInput from "@/components/chatComponets/ChatInput";
import ChatMessageList from "@/components/chatComponets/ChatMessageList";
import { userChatTheme } from "@/components/chatComponets/chatTheme";
import React, { useEffect, useState, useRef } from "react";
import { getSocket } from "@/utils/socket";
import { useAuthStore } from "@/store/user/authStore";
import { getMessagesWithUser } from "@/services/user/auth/chatServiceUser";
import { getChatInboxUser } from "@/services/user/auth/authService";
import { formatTime } from "../chatComponets/DoctorChatWrapper"; // reusable time formatter
import { Roles } from "@/types/chat";
import { ChatUser, Message } from "@/types/chat"; // move types here
import { getDoctorBasicInfo } from "@/services/doctor/doctorService";

interface ChatWrapperProps {
  doctorId?: string;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({ doctorId }) => {
  console.log("chatt pate", doctorId);

  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInbox, setShowInbox] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  const user = useAuthStore();
  const userId = user.user?.id;

  console.log("doc id", doctorId);
  console.log("user id", userId);

  //-------------- If route has doctorId, auto-select that user
  //  useEffect(() => {
  //   if (doctorId && chatUsers.length) {
  //     const doctorFromList = chatUsers.find((user) => user._id === doctorId);
  //     if (doctorFromList) {
  //       setSelectedUser(doctorFromList);
  //       setShowInbox(false);
  //     }
  //   }
  // }, [doctorId, chatUsers]);

  //--------------------- Handle screen size--------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //---------------------- Fetch inbox users left panel-----------------------
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const data = await getChatInboxUser();
        console.log("chat inbox api response : =>", data);
        setChatUsers((prev) => {
          const uniqueMap = new Map<string, ChatUser>();
          [...prev, ...data].forEach((user) => uniqueMap.set(user._id, user));
          return Array.from(uniqueMap.values());
        });
      } catch (error) {
        console.error(" Failed to fetch inbox", error);
      }
    };
    fetchInbox();
  }, []);

  //-------------------Automatically select doctor even if not in inbox----

  useEffect(() => {
    const loadDoctorIfMissing = async () => {
      console.log("inside loadDoctorIfMissing==>", doctorId);
      if (!doctorId) return;

      const doctorInList = chatUsers.find((user) => user._id === doctorId);

      if (doctorInList) {
        setSelectedUser(doctorInList);
        setShowInbox(false);
        console.log("ondu😌");
      } else {
        console.log("ella😌");
        try {
          if (!doctorId) return;
          const doctor = await getDoctorBasicInfo(doctorId!);
          console.log("vanna data ", doctor);

          setChatUsers((prev) => {
            const exists = prev.some((u) => u._id === doctor._id);
            return exists ? prev : [...prev, doctor];
          });
          setSelectedUser(doctor);
          setShowInbox(false);
        } catch (error) {
          console.error("Failed to fetch doctor info", error);
        }
      }
    };

    if (chatUsers.length === 0) {
      console.log("load ------>");
      loadDoctorIfMissing();
    }
  }, [doctorId, chatUsers]);

  //-------------------- Fetch messages when user selected------------------------
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !userId) return;
      try {
        const data = await getMessagesWithUser(selectedUser._id);
        console.log("get messages api response : =>", data);

        const formattedMessages: Message[] = data.map((msg: any) => ({
          fromSelf: msg.senderId === userId,
          text: msg.content,
          time: formatTime(new Date(msg.createdAt)),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error(" Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  //--------------------- Socket message receive handling----------------------------
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceive = (message:any) => {
      console.log("📥 Received message:", message);

      const formattedMessage = {
        fromSelf: false,
        text: message.content, // map correctly
        time: formatTime(new Date(message.createdAt)), //  use server time
      };

      if (selectedUser && message.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, formattedMessage]);
      } else {
        setChatUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === message.senderId
              ? { ...user, unreadCount: user.unreadCount + 1 }
              : user
          )
        );
      }
    };

    socket.on("receive-message", handleReceive);
    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [selectedUser]);

  //--------------------- Socket message send handling----------------------------
  const handleSendMessage = (text: string) => {
    const socket = getSocket();
    if (!selectedUser || !socket || !userId) return;

    const messagePayload = {
      from: userId,
      to: selectedUser._id,
      message:text,
      type: "text",
      fromRole: Roles.USER,
      toRole: Roles.DOCTOR,
    };

    const newMessage = {
      fromSelf: true,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    console.log("ponathe==",messagePayload);
    
    setMessages((prev) => [...prev, newMessage]);
    socket.emit("send-message", messagePayload);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Inbox Sidebar */}
      {(!isMobile || showInbox) && (
        <div className={`${isMobile ? "w-full" : "w-1/3"} h-full`}>
          <ChatInbox
            users={chatUsers}
            selectedUserId={selectedUser?._id || null}
            onSelectUser={(user) => {
              setSelectedUser(user);
              setChatUsers((prev) =>
                prev.map((u) =>
                  u._id === user._id ? { ...u, unreadCount: 0 } : u
                )
              );
              if (isMobile) setShowInbox(false);
            }}
            theme={userChatTheme}
          />
        </div>
      )}

      {/* Chat View */}
      {(!isMobile || !showInbox) && selectedUser && (
        <div
          className={`${isMobile ? "w-full" : "w-2/3"} h-full flex flex-col`}
        >
          <ChatHeader
            selectedUser={selectedUser}
            isMobile={isMobile}
            onBackClick={() => setShowInbox(true)}
            theme={userChatTheme}
          />
          <ChatMessageList messages={messages} theme={userChatTheme} />
          <ChatInput onSendMessage={handleSendMessage} theme={userChatTheme} />
        </div>
      )}

      {/* Empty State */}
      {(!isMobile || !showInbox) && !selectedUser && (
        <div className="w-2/3 h-full flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
            <p>Choose a chat from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWrapper;
