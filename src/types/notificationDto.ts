export interface NotificationDTO {
    _id: string;
    title: string;
    message: string;
    type: "appointment" | "system" | "message";
    createdAt: string;
  }