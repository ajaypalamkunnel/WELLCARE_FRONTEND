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

        setAuth(user.email, accessToken, user.isVerified!, user,user.profileUrl);

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

        

        const isSubscribed = doctor.isSubscribed ?? false;
        const subscriptionExpiryDate = doctor.subscriptionExpiryDate ?? "";
        const isVerified = doctor.isVerified;
        const status = doctor.status
        console.log("===>status: ",status);
        
        setAuthDoctor(
          doctor.email,
          doctorAccessToken,
          doctor,
          isSubscribed,
          isVerified!,
          subscriptionExpiryDate,
          status
        );
        // console.log("********>",doctor);

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
    googleAuth(role);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-[1200px] bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-12 p-8 lg:p-16 border border-white/20">
        {/* Left Side - Login Form */}
        <div className="w-full max-w-md flex flex-col items-center animate-fade-in-up">
          {/* Logo */}
          <div className="flex flex-col justify-center content-around mb-8">
            <div className="mb-6 flex justify-center">
              <img
                src="/images/logo.png"
                alt="WellCare Logo"
                className="h-24 mx-auto lg:mx-0 transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h1 className="text-slate-800 text-2xl font-semibold mb-8 text-center lg:text-left leading-tight">
              Welcome back to WellCare
            </h1>
            <p className="text-slate-600 text-sm mb-8 text-center lg:text-left">
              Sign in to access your account and continue your healthcare journey
            </p>

            {/* User Type Selector */}
            <Tabs
              defaultValue="patient"
              onValueChange={(value) => setRole(value as "patient" | "doctor")}
              className="w-full max-w-xs mb-8"
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1.5 shadow-inner">
                <TabsTrigger
                  value="patient"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-4 py-2.5 transition-all duration-300 font-medium"
                >
                  Patient
                </TabsTrigger>
                <TabsTrigger
                  value="doctor"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-4 py-2.5 transition-all duration-300 font-medium"
                >
                  Doctor
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                Email address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors duration-300 group-focus-within:text-blue-500" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                Password
              </Label>
              <div className="relative group">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors duration-300 group-focus-within:text-blue-500" />
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
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
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 transform ${
                isLoading
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {role === "patient" && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl p-3.5 hover:bg-slate-50 transition-all duration-300 hover:border-slate-300 hover:shadow-md"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  type="button"
                >
                  <FcGoogle className="h-5 w-5" />
                  <span className="text-slate-700 font-medium">
                    {isLoading ? "Processing..." : "Sign in with Google"}
                  </span>
                </button>
              </>
            )}
          </form>

          {/* Create Account Link */}
          <div className="mt-10 text-center">
            <p className="text-slate-600">
              {`Don't have an account?`}{" "}
              <Link
                href="/selectrole"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex w-full lg:w-[50%] justify-center lg:justify-end animate-slide-in-right">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-3xl blur-3xl"></div>
            <Image
              src="/images/loginpage.png"
              alt="Login Image"
              width={585}
              height={482}
              className="relative w-full max-w-[500px] lg:max-w-none rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginComponent;
