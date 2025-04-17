
// Types
export interface ChatUser {
    _id: string;
    fullName: string;
    isOnline: boolean;
    profileImage: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
  }
  
 export interface Message {
    fromSelf: boolean;
    text: string;
    time: string;
  }
  
// constants/roles.ts
export const Roles = {
    USER: "User",
    DOCTOR: "Doctor",
    ADMIN: "Admin",
  } as const;
  
  export type RoleType = typeof Roles[keyof typeof Roles];
  

  export interface ChatInboxItemDTO {
    _id: string;
    fullName: string;
    profileUrl: string;
    isOnline: boolean;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
  }
  