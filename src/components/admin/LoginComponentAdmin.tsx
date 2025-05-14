"use client";
import Image from "next/image";
import { LockKeyhole, Mail } from "lucide-react";
import { useAdminStore } from "@/store/admin/adminStore";
import { Label } from "@/components/ui/label";
import { login } from "@/services/admin/authServices";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IAdmin } from "@/types/userTypes";
import { getErrorMessage } from "@/utils/handleError";


interface loginFormData {
  email: string;
  password: string;
}

const LoginComponentAdmin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {setAuth,accessToken} = useAdminStore()
  const router = useRouter();
 

  useEffect(()=>{
    if(accessToken){
      router.replace("/admin/dashboard")
    }
  })


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>();

  const onSubmit = async (data: loginFormData) => {
    
    setIsLoading(true)

    console.log(data);
    try{
    const {accessTokenAdmin,admin}:{accessTokenAdmin:string;admin:IAdmin}=
      await login(data.email,data.password)
      setAuth(admin.email,accessTokenAdmin,admin)

      toast.success("Login successfull!!")
      router.replace("/admin/dashboard")

      
    }catch(error:unknown){
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    }finally{
      setIsLoading(false)
    }
    
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#191c25] to-[#1f232e] flex flex-col items-center px-4 py-6 text-white">
    <div className="w-full max-w-[1200px] shadow-lg rounded-lg flex flex-col lg:flex-row items-center justify-between gap-8 p-5 lg:p-12 bg-[#222632]">
      {/* Left Side - Login Form */}
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col justify-center content-around">
          <div className="mb-4 flex justify-center">
            <img src="/images/logo.png" alt="WellCare Logo" className="h-20 mx-auto lg:mx-0" />
          </div>
          <h1 className="text-gray-300 text-xl mb-6 text-center lg:text-left">
            Access the Admin Panel by signing in
          </h1>
        </div>
  
        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-400">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
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
                className="w-full px-10 py-2 border border-gray-600 bg-[#2a2f3a] text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
  
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-400">Password</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <input
                {...register("password", {
                  required: "Password is required",
                })}
                id="password"
                type="password"
                placeholder="Password"
                className="w-full px-10 py-2 border border-gray-600 bg-[#2a2f3a] text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
  
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-2 rounded-lg ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
  
      {/* Right Side - Illustration */}
      <div className="hidden lg:flex w-full lg:w-[50%] justify-center lg:justify-end">
        <Image
          src="/images/adminLogin.png"
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

export default LoginComponentAdmin;
