"use client";

import { useCallStore } from "@/store/call/callStore";
import { getSocket } from "@/utils/socket";
import React, { useEffect, useState } from "react";

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

      setInitialized(true);

      return () => {
        socket?.off("call-request");
      };
    };

    waitForSocket();
  }, []);

  return null;
};

export default GlobalSocketListener;
