import { set } from "react-hook-form";
import {IUser} from "../../types/userTypes"
import {create} from 'zustand'
import { persist, devtools } from "zustand/middleware";
import { redirect } from "next/navigation"; 
import toast from "react-hot-toast";

interface AuthStateDoctor{
  emailDoctor:string|null;
    accessTokenDoctor:string|null;
    user:IUser|null
    isVerified?:boolean|null
    setVerification:(isVerified?:boolean)=>void
    setEmailDoctor:(email:string)=>void
    setAuthDoctor:(email:string,accessToken:string,user:IUser)=>void
    logout:()=>void
    adminLogout:()=>void
}


export const useAuthStoreDoctor = create<AuthStateDoctor>()(
    devtools(
        persist(
          (set) => ({
            emailDoctor: null,
            accessTokenDoctor: null,
            user: null,
            isVerified:null,
            setVerification:(isVerified)=>set({isVerified}),
            setEmailDoctor:(emailDoctor) => set({emailDoctor}),
            setAuthDoctor: (emailDoctor, accessTokenDoctor, user) =>
              set({ emailDoctor, accessTokenDoctor, user }, false, "setAuth"), 
            logout: () => set({ emailDoctor: null, accessTokenDoctor: null, user: null }, false, "logout"),
            adminLogout: () => {
              console.warn("Doctor logged out (blocked or manually)");
              set({ emailDoctor: null, accessTokenDoctor: null, user: null }, false, "logout");
              toast.error("Your access is restricted by admin",{
                duration:3000
              })
              setTimeout(()=>{
                window.location.href = "/login"; // ✅ Redirect after logout
              },2000)
          }
          }),
          { name: "doctorAuthStore" } 
        ),
        { name: "Doctor AuthStore wellcare" }
      )
)