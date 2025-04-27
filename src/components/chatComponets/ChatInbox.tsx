"use client";
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
  console.log("🚀==>", users);
  return (
    <div className="flex flex-col h-full border-r bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-3">Conversations</h2>
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none transition-all duration-200 text-sm`}
            style={{ boxShadow: `0 0 0 2px ${theme.primary}22` }}
          />
          <Search 
            size={18} 
            className="absolute left-3 top-3.5 text-gray-400" 
            style={{ color: theme.primary }}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center">
            <div className="text-5xl mb-2">🔍</div>
            <p>No conversations found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)}
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-100 ${
                selectedUserId === user._id
                ? `bg-gray-100 border-l-4`
                : "border-l-4 border-transparent"
              }`}
              style={{
                borderLeftColor: selectedUserId === user._id ? theme.primary : "transparent",
              }}
            >
              <div className="flex items-center">
                {/* Profile Picture */}
                <div className="relative mr-3">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: `${theme.primary}dd` }}
                      >
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                  </div>

                  {/* Online Indicator */}
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
                    style={{
                      backgroundColor: user.isOnline ? theme.primary : "#9CA3AF",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}
                  />
                </div>

                {/* Name & Last Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-semibold truncate ${selectedUserId === user._id ? "text-gray-900" : "text-gray-700"}`}>
                      {user.fullName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(user.lastMessageTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${user.unreadCount > 0 ? "font-medium" : "text-gray-500"}`}>
                    {user.lastMessage}
                  </p>
                </div>

                {/* Unread count */}
                {user.unreadCount > 0 && (
                  <div
                    className="ml-2 text-white text-xs rounded-full min-w-6 h-6 flex items-center justify-center px-1.5"
                    style={{ 
                      backgroundColor: theme.primary,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)" 
                    }}
                  >
                    {user.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatInbox;