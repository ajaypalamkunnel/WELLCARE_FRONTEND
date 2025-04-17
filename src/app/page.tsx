"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/user/authStore";
import HomeCom from "./Home/page";
export default function Home() {
  const { accessToken } = useAuthStore();
  const router = useRouter();

  // useEffect(() => {
  //   // if (!accessToken) {
  //   //   router.replace("/login");
  //   // }

  //   const handleBackButton = () => {
  //     history.pushState(null, "", location.href);
  //   };

  //   history.pushState(null, "", location.href);
  //   window.addEventListener("popstate", handleBackButton);

  //   return () => {
  //     window.removeEventListener("popstate", handleBackButton);
  //   };
  // }, [accessToken, router]);

  

  return (
    <HomeCom/>
  );
}
