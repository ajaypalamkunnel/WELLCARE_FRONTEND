import toast from "react-hot-toast";
import { IUser } from "../../types/userTypes"
import { create } from 'zustand'
import { persist, devtools } from "zustand/middleware";

interface AuthState {
  email: string | null;
  accessToken: string | null;
  user: IUser | null
  setEmail: (email: string) => void
  setAuth: (email: string, accessToken: string, user: IUser) => void
  logout: () => void
  logoutByAdmin: () => void
}


export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        email: null,
        accessToken: null,
        user: null,
        setEmail: (email) => set({ email }),
        setAuth: (email, accessToken, user) =>
          set({ email, accessToken, user }, false, "setAuth"),
        logout: () => set({ email: null, accessToken: null, user: null }, false, "logout"),
        logoutByAdmin: () => {
          set({ email: null, accessToken: null, user: null }, false, "logout")
          toast.error("Your access is restricted by admin", {
            duration: 3000
          })
          setTimeout(() => {
            window.location.href = "/login"; // ✅ Redirect after logout
          }, 2000)
        }
      }),
      { name: "authStore" }
    ),
    { name: "AuthStore wellcare" }
  )
);






// export const useAuthStore = create<AuthState>((set)=>({
//     email:null,
//     accessToken:null,
//     user:null,
//     setAuth:(email,accessToken,user)=>set({email,accessToken,user}),
//     setEmail:(email) => set({email}),
//     logout:()=> set({email:null,accessToken:null,user:null})

// }))

