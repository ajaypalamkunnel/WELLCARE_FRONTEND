// ChatWrapper.tsx
"use client";

import ChatHeader from "@/components/chatComponets/ChatHeader";
import ChatInbox from "@/components/chatComponets/ChatInbox";
import ChatInput from "@/components/chatComponets/ChatInput";
import ChatMessageList from "@/components/chatComponets/ChatMessageList";
import { userChatTheme } from "@/components/chatComponets/chatTheme";
import React, { useEffect, useState } from "react";
import { getSocket } from "@/utils/socket";
import { useAuthStore } from "@/store/user/authStore";
import {
  getMessagesWithUser,
  markMessagesAsReadUser,
} from "@/services/user/auth/chatServiceUser";
import { getChatInboxUser } from "@/services/user/auth/authService";
import { formatTime } from "../chatComponets/DoctorChatWrapper"; // reusable time formatter
import { Roles } from "@/types/chat";
import { ChatUser, Message } from "@/types/chat"; // move types here
import { getDoctorBasicInfo } from "@/services/doctor/doctorService";
import toast from "react-hot-toast";

interface ChatWrapperProps {
  doctorId?: string;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({ doctorId }) => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInbox, setShowInbox] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  const user = useAuthStore();
  const userId = user.user?.id;

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
        //services/user/auth/authService.ts
        const data = await getChatInboxUser();
        console.log("📨 chat inbox api response : =>", data);

        const uniqueMap = new Map<string, ChatUser>();
        [...data].forEach((user) => uniqueMap.set(user._id, user));
        const uniqueUsers = Array.from(uniqueMap.values());

        const sortedUsers = uniqueUsers.sort(
          (a, b) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
        );

        setChatUsers(sortedUsers);
      } catch (error) {
        console.error(" Failed to fetch inbox", error);
      }
    };
    fetchInbox();
  }, []);

  //-------------------Automatically select doctor even if not in inbox----

  useEffect(() => {
    const loadDoctorIfMissing = async () => {
      if (!doctorId) return;

      const doctorInList = chatUsers.some((user) => user._id === doctorId);

      if (doctorInList) {
        setSelectedUser(chatUsers.find((u) => u._id === doctorId)!);
        setShowInbox(false);
      } else {
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

    loadDoctorIfMissing();
  }, [doctorId, chatUsers]);

  //-------------------- Fetch messages when user selected------------------------
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !userId) return;
      try {
        const data = await getMessagesWithUser(selectedUser._id);
        console.log("get messages api response : =>", data);

        const formattedMessages: Message[] = data.map((msg: any) => ({
          _id: msg._id,
          fromSelf: msg.senderId.toString() === userId,
          text: msg.isDeleted ? "🚫 This message was deleted" : msg.content,
          time: formatTime(new Date(msg.createdAt)),
          mediaUrl: msg.isDeleted ? undefined : msg.mediaUrl,
          mediaType: msg.isDeleted ? undefined : msg.mediaType,
          isDeleted: msg.isDeleted,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error(" Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser?._id]);

  //-------------------- mark messages as read ------------------------

  useEffect(() => {
    const markAsRead = async () => {
      if (!selectedUser || !userId) return;

      try {
        await markMessagesAsReadUser(selectedUser._id);

        setChatUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? { ...user, unreadCount: 0 } : user
          )
        );
        console.log(" Messages marked as read");
      } catch (error) {
        console.error(" Failed to mark messages as read", error);
      }
    };
    markAsRead();
  }, [selectedUser?._id]);

  //--------------------- Socket message receive handling----------------------------
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceive = (message: any) => {
      console.log("📥 Received message:", message);

      const formattedMessage = {
        _id: message._id,
        fromSelf: false,
        text: message.isDeleted
          ? "🚫 This message was deleted"
          : message.content, // map correctly
        time: formatTime(new Date(message.createdAt)), //  use server time
        mediaUrl: message.isDeleted ? undefined : message.mediaUrl,
        mediaType: message.isDeleted ? undefined : message.mediaType,
        isDeleted: message.isDeleted,
      };

      if (selectedUser && message.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, formattedMessage]);
      }

      setChatUsers((prevUsers) => {
        const updated = prevUsers.map((user) =>
          user._id === message.senderId
            ? {
                ...user,
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
                unreadCount:
                  selectedUser && user._id === selectedUser._id
                    ? 0 // reset if currently chatting
                    : user.unreadCount + 1,
              }
            : user
        );

        //  Sort latest message on top
        return updated.sort(
          (a, b) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
        );
      });
    };

    //message deleting handler

    const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
      console.log("🗑️ Message deleted:", messageId);

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id === messageId) {
            return {
              ...msg,
              isFadingOut: true,
            };
          }
          return msg;
        })
      );

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg._id === messageId) {
              return {
                ...msg,
                text: "🚫 This message was deleted",
                mediaUrl: undefined,
                mediaType: undefined,
                isDeleted: true,
                isFadingOut: false,
              };
            }
            return msg;
          })
        );
      }, 1000);
    };

    socket.on("receive-message", handleReceive);
    socket.on("message-deleted", handleMessageDeleted);
    return () => {
      socket.off("receive-message", handleReceive);
      socket.off("message-deleted", handleMessageDeleted);
    };
  }, [selectedUser]);

  //--------------------- Socket message send handling----------------------------
  const handleSendMessage = (
    text: string,
    mediaUrl?: string,
    mediaType?: string
  ) => {
    const socket = getSocket();
    console.log(
      ">>>> handleSendMessage",
      text,
      selectedUser,
      "---",
      userId,
      "___",
      socket
    );
    if (!selectedUser || !socket || !userId) return;

    if (!text.trim() && !mediaUrl) {
      toast.error("Cannot send empty message without media");
      console.warn("Cannot send empty message without media");
      return;
    }

    console.log("===>", mediaUrl);

    const isMedia = Boolean(mediaUrl);

    const tempId = Date.now().toString();

    const messagePayload = {
      from: userId,
      to: selectedUser._id,
      message: text,
      type: isMedia ? mediaType : "text",
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaType || undefined,
      fromRole: Roles.USER,
      toRole: Roles.DOCTOR,
    };

    const newMessage = {
      tempId,
      fromSelf: true,
      text: text || (mediaType ? `[${mediaType}]` : ""),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      mediaUrl: mediaUrl,
      mediaType: mediaType as "image" | "video" | "file" | undefined,
    };
    //  Append to message list

    console.log("ponathe==", messagePayload);

    setMessages((prev) => [...prev, newMessage]);

    setChatUsers((prevUsers) => {
      const updated = prevUsers.map((user) =>
        user._id === selectedUser._id
          ? {
              ...user,
              lastMessage: text,
              lastMessageTime: new Date().toISOString(), // ISO for proper sorting
            }
          : user
      );

      return updated.sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      );
    });

    socket.emit("send-message", messagePayload, (response: any) => {
      if (response.success) {
        const savedMessage = response.message;

        // Replace temp message with real saved message
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            (msg as any).tempId === tempId
              ? {
                  ...msg,
                  _id: savedMessage._id,
                  sending: false,
                  time: formatTime(new Date(savedMessage.createdAt)),
                }
              : msg
          )
        );
      } else {
        toast.error("Failed to send message. Please try again.");
        console.error("Message sending failed:", response.message);
      }
    });
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
