"use client";

import React, { useState, useEffect } from "react";
import NotificationCard from "./NotificationCard";

interface Notification {
  id: string;
  title: string;
  message: string;
  type?: "success" | "info" | "error";
}

let globalNotify: (notif: Omit<Notification, "id">) => void;

const NotificationContainer = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    globalNotify = (notif) => {
      setNotifs((prev) => [
        ...prev,
        { ...notif, id: Math.random().toString() },
      ]);
    };
  }, []);

  const removeNotif = (id: string) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifs.map((notif) => (
        <NotificationCard
          key={notif.id}
          title={notif.title}
          message={notif.message}
          type={notif.type}
          onClose={() => removeNotif(notif.id)}
        />
      ))}
    </div>
  );
};


export const notify = (notif: Omit<Notification, "id">) => {
  if (globalNotify) globalNotify(notif);
};

export default NotificationContainer;
