import { set } from "react-hook-form";
import {IUser} from "../../types/userTypes"
import {create} from 'zustand'
import { persist, devtools } from "zustand/middleware";


interface AuthStateDoctor{
  emailDoctor:string|null;
    accessTokenDoctor:string|null;
    user:IUser|null
    setEmailDoctor:(email:string)=>void
    setAuthDoctor:(email:string,accessToken:string,user:IUser)=>void
    logout:()=>void
}


export const useAuthStoreDoctor = create<AuthStateDoctor>()(
    devtools(
        persist(
          (set) => ({
            emailDoctor: null,
            accessTokenDoctor: null,
            user: null,
            setEmailDoctor:(emailDoctor) => set({emailDoctor}),
            setAuthDoctor: (emailDoctor, accessTokenDoctor, user) =>
              set({ emailDoctor, accessTokenDoctor, user }, false, "setAuth"), 
            logout: () => set({ emailDoctor: null, accessTokenDoctor: null, user: null }, false, "logout"),
          }),
          { name: "doctorAuthStore" } 
        ),
        { name: "Doctor AuthStore wellcare" }
      )
)