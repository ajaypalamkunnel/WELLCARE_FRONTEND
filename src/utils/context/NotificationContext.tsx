import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket } from "../socket";

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    if (userId) {
      connectSocket(userId, (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });
    }
  }, [userId]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext)