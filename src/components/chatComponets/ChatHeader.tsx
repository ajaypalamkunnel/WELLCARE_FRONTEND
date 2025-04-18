"use client"
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { ChatTheme } from "./chatTheme"; // Adjust path as needed
import { ChatUser } from "@/types/chat";



interface ChatHeaderProps {
  selectedUser: ChatUser | null;
  isMobile: boolean;
  onBackClick: () => void;
  theme: ChatTheme;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  isMobile,
  onBackClick,
  theme,
}) => {
  if (!selectedUser) return null;

  console.log("🏵️vanna user==>",selectedUser)

  return (
    <div className="bg-white border-b p-3 flex items-center shadow-sm">
      {isMobile && (
        <button onClick={onBackClick} className="mr-2">
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="relative mr-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {selectedUser.profileImage ? (
            <img
              src={selectedUser.profileImage}
              alt={selectedUser.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500 font-medium">
              {selectedUser.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          )}
        </div>
        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
          style={{
            backgroundColor: selectedUser.isOnline
              ? theme.primary
              : "#9CA3AF", // gray-400
          }}
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{selectedUser.fullName}</h3>
        <p className="text-xs text-gray-500">
          {selectedUser.isOnline ? "Online" : "Offline"}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Phone size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Video size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
