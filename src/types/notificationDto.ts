export interface NotificationDTO {
    _id: string;
    title: string;
    message: string;
    type: "appointment" | "system" | "message";
    createdAt: string;
  }




export interface NotificationPayload {
  _id: string;
  userId: string;
  userRole: "user" | "admin" | "doctor"; // adjust based on your roles
  title: string;
  message: string;
  link: string;
  type: "appointment" | "reminder" | "message" | string; // extend if needed
  isRead: boolean;
  createdAt: string; // or `Date` if you parse it
  updatedAt: string;
  __v?: number;
}
