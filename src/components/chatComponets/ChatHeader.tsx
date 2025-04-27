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

  console.log("🏵️vanna user==>", selectedUser);

  return (
    <div className="bg-white border-b border-gray-50 p-4 flex items-center shadow-sm sticky top-0 z-10">
      {isMobile && (
        <button 
          onClick={onBackClick} 
          className="mr-3 p-2 rounded-full hover:bg-gray-50 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
      )}
      
      <div className="relative mr-4">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
          {selectedUser.profileImage ? (
            <img
              src={selectedUser.profileImage}
              alt={selectedUser.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500 font-semibold text-lg">
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
              : "#D1D5DB", // Lighter gray
          }}
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-700">{selectedUser.fullName}</h3>
        <p className="text-xs font-normal text-gray-400">
          {selectedUser.isOnline ? (
            <span className="flex items-center">
              <span className="flex h-2 w-2 mr-1.5 rounded-full bg-green-300"></span>
              Online
            </span>
          ) : (
            <span className="flex items-center">
              <span className="flex h-2 w-2 mr-1.5 rounded-full bg-gray-300"></span>
              Last seen recently
            </span>
          )}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {/* <button className="p-2.5 rounded-full hover:bg-gray-50 transition-colors" aria-label="Call">
          <Phone size={20} className="text-gray-400" />
        </button>
        <button className="p-2.5 rounded-full hover:bg-gray-50 transition-colors" aria-label="Video call">
          <Video size={20} className="text-gray-400" />
        </button>
        <button className="p-2.5 rounded-full hover:bg-gray-50 transition-colors" aria-label="More options">
          <MoreVertical size={20} className="text-gray-400" />
        </button> */}
      </div>
    </div>
  );
};

export default ChatHeader;