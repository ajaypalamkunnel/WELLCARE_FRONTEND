"use client";

import { useCallStore } from "@/store/call/callStore";
import { getSocket } from "@/utils/socket";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { notify } from "../commonUIElements/NotificationContainer";

const GlobalSocketListener = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const waitForSocket = async () => {
      let attempts = 0;
      let socket = getSocket();

      // Wait up to 10 attempts (1 second max)
      while (!socket && attempts < 10) {
        await new Promise((res) => setTimeout(res, 100));
        socket = getSocket();
        attempts++;
      }

      if (!socket) {
        console.warn("⚠️ Socket still not initialized after 1 second.");
        return;
      }

      console.log("✅ GlobalSocketListener socket ready:", socket.id);

      socket.on("call-request", ({ callerId, callerName }) => {
        console.log("📞 Incoming call from:", callerId, callerName);
        useCallStore.getState().setIncomingCall(callerId, callerName);
      });

      socket.on("receive-notification", (notification) => {
        console.log("🔔 Notification received:", notification);
        // toast.success(notification.message || "You have a new notification", {
        //   duration: 4000,
        // });
        notify({
          title: "📩 New Notification",
          message: notification.message,
          type: "info",
        });
      });

      setInitialized(true);

      return () => {
        socket?.off("call-request");
        socket?.off("receive-notification");
      };
    };

    waitForSocket();
  }, []);

  return null;
};

export default GlobalSocketListener;
