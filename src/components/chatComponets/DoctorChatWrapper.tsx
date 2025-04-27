"use client";

import ChatHeader from "@/components/chatComponets/ChatHeader";
import ChatInbox from "@/components/chatComponets/ChatInbox";
import ChatInput from "@/components/chatComponets/ChatInput";
import ChatMessageList from "@/components/chatComponets/ChatMessageList";
import { doctorChatTheme } from "@/components/chatComponets/chatTheme";
import {
  getChatInboxDoctor,
  getMessagesWithUserDoctor,
} from "@/services/doctor/chatServiceDoctor";
import { markMessagesAsReadDoctor } from "@/services/doctor/doctorService";
import { getUserBasicInfo } from "@/services/user/auth/authService"; // ✨ NEW

import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { Roles } from "@/types/chat";
import { ChatUser, Message } from "@/types/chat";
import { getSocket } from "@/utils/socket";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DoctorChatWrapperProps {
  userId?: string; // NEW
}

export const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const DoctorChatWrapper: React.FC<DoctorChatWrapperProps> = ({ userId }) => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInbox, setShowInbox] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  const doctor = useAuthStoreDoctor();
  const doctorId = doctor.user?.id;

  console.log(".....DoctorChatWrapper");

  //----------------- Handle resize -----------------
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //------------------------ Fetch inbox for doctor-----------------
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        //services/doctor/chatService.ts
        const data = await getChatInboxDoctor();
        console.log("inbox api ", data);

        const sorted = data.sort(
          (a, b) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
        );

        setChatUsers(sorted);
      } catch (err) {
        console.error("Failed to fetch doctor chat inbox", err);
      }
    };
    fetchInbox();
  }, []);

  // -------------------------- Load user by ID if not in inbox ------------------------------
  useEffect(() => {
    const fetchIfUserMissing = async () => {
      console.log(">>>>>", userId);

      if (!userId) return;
      console.log("Load user by ID if not in inbox");

      const alreadyExists = chatUsers.some((u) => u._id === userId);
      if (alreadyExists) {
        setSelectedUser(chatUsers.find((u) => u._id === userId)!);
        setShowInbox(false);
      } else {
        try {
          const user = await getUserBasicInfo(userId); //NEW
          setChatUsers((prev) => {
            const exists = prev.some((u) => u._id === user._id);
            return exists ? prev : [...prev, user];
          });
          setSelectedUser(user);
          setShowInbox(false);
        } catch (error) {
          console.error("Failed to load user by ID", error);
        }
      }
    };

    fetchIfUserMissing();
  }, [userId, chatUsers]);

  //---------------------------- fetch messages-----------------------

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !doctorId) return;
      try {
        //services/doctor/chatService.ts
        const data = await getMessagesWithUserDoctor(selectedUser._id);

        const formattedMessages: Message[] = data.map((msg: any) => ({
          fromSelf: msg.senderId.toString() === doctorId,
          text: msg.content,
          time: formatTime(new Date(msg.createdAt)),
          mediaUrl: msg.mediaUrl,
          mediaType: msg.mediaType,
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Failed to fetch messages with patient", err);
      }
    };

    fetchMessages();
  }, [selectedUser?._id]);

  //-------------------- mark messages as read ------------------------

  useEffect(() => {
    const markAsRead = async () => {
      if (!selectedUser || !doctorId) return;

      try {
        await markMessagesAsReadDoctor(selectedUser._id);

        setChatUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? { ...user, unreadCount: 0 } : user
          )
        );
        console.log(" Messages marked as read");
      } catch (error) {
        console.error("Failed to mark messages as read", error);
      }
    };

    markAsRead();
  }, [selectedUser?._id]);

  //------------------ Handle receive message ---------------------------------
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceive = (message: any) => {
      console.log(" Doctor received message:", message);

      const formattedMessage = {
        fromSelf: false,
        text: message.content, //  map correctly
        time: formatTime(new Date(message.createdAt)), //  use server time
        mediaUrl: message.mediaUrl,
        mediaType: message.mediaType,
      };

      if (selectedUser && message.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, formattedMessage]);
      } else {
        setChatUsers((prevUsers) => {
          const updated = prevUsers.map((user) =>
            user._id === message.senderId
              ? {
                  ...user,
                  lastMessage: message.content,
                  lastMessageTime: message.createdAt,
                  unreadCount:
                    selectedUser && user._id === selectedUser._id
                      ? 0
                      : user.unreadCount + 1,
                }
              : user
          );

          //  Sort the inbox by most recent message
          return updated.sort(
            (a, b) =>
              new Date(b.lastMessageTime).getTime() -
              new Date(a.lastMessageTime).getTime()
          );
        });
      }
    };

    socket.on("receive-message", handleReceive);
    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [selectedUser]);

  //------------------ Handle sent message ---------------------------------

  const handleSendMessage = (
    text: string,
    mediaUrl?: string,
    mediaType?: string
  ) => {
    const socket = getSocket();
    if (!selectedUser || !socket || !doctorId) return;

    if (!text.trim() && !mediaUrl) {
      toast.error("Cannot send empty message without media");
      console.warn("Cannot send empty message without media");
      return;
    }

    console.log("===>", mediaUrl);

    const isMedia = Boolean(mediaUrl);

    const MessagePayload = {
      from: doctorId,
      to: selectedUser._id,
      message: text,
      type: isMedia ? mediaType : "text",
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaType || undefined,
      fromRole: Roles.DOCTOR,
      toRole: Roles.USER,
    };

    const newMessage = {
      fromSelf: true,
      text: text || (mediaType ? `[${mediaType}]` : ""),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mediaUrl: mediaUrl,
      mediaType: mediaType as "image" | "video" | "file" | undefined,
    };

    setMessages((prev) => [...prev, newMessage]);

    //  Update and sort inbox list after sending
    setChatUsers((prevUsers) => {
      const updated = prevUsers.map((user) =>
        user._id === selectedUser._id
          ? {
              ...user,
              lastMessage: text,
              lastMessageTime: new Date().toISOString(), // For sorting
            }
          : user
      );

      return updated.sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      );
    });

    socket.emit("send-message", MessagePayload);
  };

  const handleSelectUser = (user: ChatUser) => {
    setSelectedUser(user);
    setChatUsers((prev) =>
      prev.map((u) => (u._id === user._id ? { ...u, unreadCount: 0 } : u))
    );
    if (isMobile) setShowInbox(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      {(!isMobile || showInbox) && (
        <div className={`${isMobile ? "w-full" : "w-1/3"} h-full`}>
          <ChatInbox
            users={chatUsers}
            selectedUserId={selectedUser?._id || null}
            onSelectUser={handleSelectUser}
            theme={doctorChatTheme}
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
            theme={doctorChatTheme}
          />
          <ChatMessageList messages={messages} theme={doctorChatTheme} />
          <ChatInput
            onSendMessage={handleSendMessage}
            theme={doctorChatTheme}
          />
        </div>
      )}

      {/* Empty state */}
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

export default DoctorChatWrapper;
