import {IUser} from "../../types/userTypes"
import {create} from 'zustand'
import { persist, devtools } from "zustand/middleware";
 import toast from "react-hot-toast";

interface AuthStateDoctor{
  emailDoctor:string|null;
    accessTokenDoctor:string|null;
    user:IUser|null
    isVerified?:boolean|null;
    isSubscribed: boolean | null;  // New field for subscription status
    subscriptionExpiryDate: string | null;
    status?:number|null
    setVerification:(isVerified?:boolean)=>void
    setEmailDoctor:(email:string)=>void,
    setSubscription:(isSubscribed:boolean)=>void,
    setAuthDoctor:(email:string,accessToken:string,user:IUser,isSubscribed: boolean,isVerified:boolean, subscriptionExpiryDate: string,status?:number)=>void
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
            isSubscribed: null,  //  Default value is `null`
            subscriptionExpiryDate: null,
            status:null,
            setVerification:(isVerified)=>set({isVerified}),
            setEmailDoctor:(emailDoctor) => set({emailDoctor}),
            setSubscription(isSubscribed) {
                set({isSubscribed})
            },
            setAuthDoctor: (emailDoctor, accessTokenDoctor, user, isSubscribed,isVerified, subscriptionExpiryDate,status) =>
              set({ emailDoctor, accessTokenDoctor, user, isSubscribed,isVerified, subscriptionExpiryDate,status }, false, "setAuth"), 
            logout: () => set({ emailDoctor: null, accessTokenDoctor: null, user: null,isSubscribed: null, subscriptionExpiryDate: null,status:null }, false, "logout"),
            adminLogout: () => {
              console.warn("Doctor logged out (blocked or manually)");
              set({ emailDoctor: null, accessTokenDoctor: null, user: null,isSubscribed: null, subscriptionExpiryDate: null,status:null }, false, "logout");
              toast.error("Your access is restricted by admin",{
                duration:3000
              })
              setTimeout(()=>{
                window.location.href = "/login"; //  Redirect after logout
              },2000)
          }
          }),
          { name: "doctorAuthStore" } 
        ),
        { name: "Doctor AuthStore wellcare" }
      )
)