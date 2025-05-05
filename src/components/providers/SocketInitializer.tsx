"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/user/authStore";
import { connectSocket } from "@/utils/socket";

const SocketInitializer = () => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      console.log("🔌 Connecting socket for user:", userId);
      connectSocket(userId);
    }
  }, [userId]);

  return null;
};

export default SocketInitializer;
