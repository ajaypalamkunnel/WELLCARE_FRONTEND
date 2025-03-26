"use client";
import Image from "next/image";
import Link from "next/link";
import { LockKeyhole, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/user/authStore";
import { useAuthStoreDoctor } from "../store/doctor/authStore";
import { useRouter } from "next/navigation";
import { IUser } from "../types/userTypes";
import { googleAuth, login } from "@/services/user/auth/authService";
import { getErrorMessage } from "@/utils/handleError";
import { login_doctor } from "@/services/doctor/authService";
interface loginFormProps {
  role: "patient" | "doctor";
}

interface loginFormData {
  email: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const router = useRouter();
  const { setAuth, accessToken } = useAuthStore();
  const { setAuthDoctor, accessTokenDoctor, setVerification } =
    useAuthStoreDoctor();

  useEffect(() => {
    if (accessToken || accessTokenDoctor) {
      router.replace("/");
    }
  }, [accessToken, accessTokenDoctor, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>();

  const onSubmit = async (data: loginFormData) => {
    setIsLoading(true);

    try {
      if (role === "patient") {
        const { accessToken, user }: { accessToken: string; user: IUser } =
          await login(data.email, data.password);

        setAuth(user.email, accessToken,user?.isVerified!, user);

        toast.success("Login successfull!");
        router.replace("/");
      } else {
        const {
          doctorAccessToken,
          doctor,
        }: { doctorAccessToken: string; doctor: IUser } = await login_doctor(
          data.email,
          data.password
        );

        console.log("=====>",doctor);
        

        const isSubscribed = doctor.isSubscribed ?? false;
        const subscriptionExpiryDate = doctor.subscriptionExpiryDate ?? "";

        setAuthDoctor(doctor.email, doctorAccessToken,doctor,isSubscribed,subscriptionExpiryDate);

        setVerification(doctor?.isVerified);
        setTimeout(() => {
          router.replace("/doctordashboard/home");
        }, 100);

        toast.success("Login successful!");
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const response = googleAuth(role);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#27c958]/10 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-[1200px] shadow-lg  rounded-lg flex flex-col lg:flex-row items-center justify-between gap-8 p-5 lg:p-12">
        {/* Left Side - Login Form */}
        <div className="w-full max-w-md flex flex-col items-center ">
          {/* Logo */}
          <div className="flex flex-col justify-center  content-around">
            <div className="mb-4 ml- flex justify-center">
              <img
                src="/images/logo.png"
                alt="WellCare Logo"
                className="h-20 mx-auto lg:mx-0"
              />
            </div>
            <h1 className="text-gray-700 text-xl mb-6 text-center lg:text-left">
              Please sign in to your account
            </h1>

            {/* User Type Selector */}
            <Tabs
              defaultValue="patient"
              onValueChange={(value) => setRole(value as "patient" | "doctor")}
              className="w-full max-w-xs mb-6"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-300 rounded-lg p-1">
                <TabsTrigger
                  value="patient"
                  className="data-[state=active]:bg-[#27c958] data-[state=active]:text-white rounded-md px-3 py-1 transition"
                >
                  Patient
                </TabsTrigger>
                <TabsTrigger
                  value="doctor"
                  className="data-[state=active]:bg-[#27c958] data-[state=active]:text-white rounded-md px-3 py-1 transition"
                >
                  Doctor
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* <h2 className="text-xl text-gray-700 font-bold mb-1 text-center">
                Login as {role === "patient" ? "Patient" : "Doctor"}
              </h2> */}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  id="email"
                  placeholder="Email address"
                  type="email"
                  className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockKeyhole
                  className="absolute m-2 "
                  size={20}
                  color="#9ca3aa"
                />
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent pr-10"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <Link
                href={{
                  pathname: "/forgot-password",
                  query: { ref: role },
                }}
                className="text-[#27c958] hover:text-[#246738] text-sm"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-2 rounded-lg ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
            <div className="mt-6 text-center text-gray-600">
              Or continue with
            </div>
          </form>

          {/* Google Sign In */}
          {role === "patient" ? (
            <button
              className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" />
              <span className="text-gray-700">
                {isLoading ? "Processing..." : "Sign in with Google"}
              </span>
            </button>
          ) : (
            <></>
          )}

          {/* Create Account Link */}
          <p className="mt-8 text-gray-700">
            Don't have an account?{" "}
            <Link
              href="/selectrole"
              className="text-[#27c958] hover:text-[#246738] font-medium"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex w-full lg:w-[50%] justify-center lg:justify-end">
          <Image
            src="/images/loginpage.png"
            alt="Login Image"
            width={585}
            height={482}
            className="w-full max-w-[450px] lg:max-w-none rounded-lg shadow-md"
          />
        </div>
      </div>
    </main>
  );
};

export default LoginComponent;
