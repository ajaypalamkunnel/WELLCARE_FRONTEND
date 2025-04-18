"use client";// Move types to common file
import { ChatUser } from "@/types/chat";
import { ChatTheme } from "./chatTheme";
import { Search } from "lucide-react";
import { useState } from "react";

interface ChatInboxProps {
  users: ChatUser[];
  selectedUserId: string | null;
  onSelectUser: (user: ChatUser) => void;
  theme: ChatTheme;
}

const ChatInbox: React.FC<ChatInboxProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  theme,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("🚀==>",users);
  return (
    <div className="flex flex-col h-full border-r">
      {/* 🔍 Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2`}
            style={{ boxShadow: `0 0 0 2px ${theme.primary}33` }}
          />
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400"
          />
        </div>
      </div>

       
      {/* 👥 Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedUserId === user._id ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex items-center">
              {/* Profile Picture */}
              <div className="relative mr-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-medium">
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>

                {/* 🟢 Online Indicator */}
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                  style={{
                    backgroundColor: user.isOnline
                      ? theme.primary
                      : "#9CA3AF", // gray-400
                  }}
                />
              </div>

              {/* Name & Last Message */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium truncate">{user.fullName}</h4>
                  <span className="text-xs text-gray-500">
                    {user.lastMessageTime}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {user.lastMessage}
                </p>
              </div>

              {/* 🔔 Unread count */}
              {user.unreadCount > 0 && (
                <div
                  className="ml-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: theme.primary }}
                >
                  {user.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInbox;
