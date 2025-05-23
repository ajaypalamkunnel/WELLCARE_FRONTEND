"use client";
import {useEffect } from "react";
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

        if (user) {
          const userData = JSON.parse(decodeURIComponent(user));
          console.log("Auth succes===>", userData);
          const userDataToStore: IUser = {
            id: userData?._id,
            email: userData?.email,
            fullName: userData?.fullName,
          };
          console.log("data to store: ==>", userDataToStore);

          if (role === "doctor") {
            // setAuthDoctor(userData?.email, accessToken!, userDataToStore);
            toast.success("Login successfull!");
            router.replace("/doctordashboard/home");
          } else {
            setAuth(userData?.email, accessToken!,userData?.isVerified, userDataToStore);
            toast.success("Login successfull!");
            router.replace("/");
          }
        }
      } catch (error) {
        console.error(error);

        router.replace("/login?error=FetchTokensFailed");
      }
    };

    fetchTokens();
  }, [router]);

  return <p>Processing login...</p>;
};

export default AuthSuccess;
