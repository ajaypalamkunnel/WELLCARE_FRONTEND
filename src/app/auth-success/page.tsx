"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/user/authStore";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import axios from "axios";

const AuthSuccess = () => {

    const router = useRouter()
    const {setAuth} = useAuthStore()
    const {setAuthDoctor} = useAuthStoreDoctor()


    useEffect(()=>{

        const fetchTokens = async () =>{
            try {

                // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/auth/tokens`, {
                //     withCredentials: true,
                // });

                // console.log(response);
                

                // const {accessToken,role} = response.data

                // if (role === "doctor") {
                //     setAuthDoctor("", accessToken, {}); 
                // } else {
                //     setAuth("", accessToken, {}); 
                // }
                router.replace('/')
            
            } catch (error) {
                console.error(error);
                
                router.replace("/login?error=FetchTokensFailed");
            }
        }

        fetchTokens()
        

    },[])
    


  return<p>Processing login...</p>;
}

export default AuthSuccess