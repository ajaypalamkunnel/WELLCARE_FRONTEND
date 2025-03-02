import { create } from "zustand";
import {IAdmin} from "../../types/userTypes"
import { devtools, persist } from "zustand/middleware";
interface IAdminState{
    email:string|null;
    accessToken:string|null;
    admin:IAdmin|null
    setEmail:(email:string)=>void
    setAuth:(email:string,accessToken:string,admin:IAdmin)=>void
    logout:()=>void
}


export const useAdminStore = create<IAdminState>()(
    devtools(
        persist(
            (set)=>({
               email:null,
               accessToken:null,
               admin:null,
               setEmail:(email)=>set({email}) ,
               setAuth:(email,accessToken,admin)=>
                set({email,accessToken,admin},false,"setAuth"),
               logout:()=>set({email:null,accessToken:null,admin:null},false,"logout")
            }),
            {name:"adminStore"}
        ),
        {name:"Wellcare AdminStore"}
    )
)