import {IUser} from "../../types/userTypes"
import {create} from 'zustand'


interface AuthState{
    email:string|null;
    accessToken:string|null;
    user:IUser|null
    setEmail:(email:string)=>void
    setAuth:(email:string,accessToken:string,user:IUser)=>void
    logout:()=>void
}


export const useAuthStore = create<AuthState>((set)=>({
    email:null,
    accessToken:null,
    user:null,
    setAuth:(email,accessToken,user)=>set({email,accessToken,user}),
    setEmail:(email) => set({email}),
    logout:()=> set({email:null,accessToken:null,user:null})

}))