"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/user/authStore";
import { IUser } from "@/types/userTypes";
import toast from "react-hot-toast";

const AuthSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const role: string | null = searchParams.get("role");
        const user = searchParams.get("user");
        const accessToken: string | null = searchParams.get("accesstoken");

        if (!user || !accessToken) {
          toast.error("Missing authentication data.");
          router.replace("/login");
          return;
        }

        const userData = JSON.parse(decodeURIComponent(user));
        const userDataToStore: IUser = {
          id: userData?._id,
          email: userData?.email,
          fullName: userData?.fullName,
        };

        console.log("logger :",userDataToStore);
        

        // Store access token in global state
        setAuth(
          userData?.email,
          accessToken,
          userData?.isVerified,
          userDataToStore
        );

        toast.success("Login successful!");

        if (role === "doctor") {
          router.replace("/doctordashboard/home");
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Auth success error:", error);
        toast.error("Failed to process login.");
        router.replace("/login?error=FetchTokensFailed");
      }
    };

    fetchTokens();
  }, [router, searchParams]);

  return <p>Processing login...</p>;
};

export default AuthSuccess;
