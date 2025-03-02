import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req:NextRequest){

    console.log("hoiiiii middleware");
    

    const { cookies, nextUrl } = req;

    const patientToken = cookies.get("auth_token")?.value || null
    const doctorToken = cookies.get("doctorAccessToken")?.value||null

    const isAuthenticated = patientToken || doctorToken;

    const protectedRoutes = ["/user/profile","/forgot-password","/otppage","/doctor/otppage","/doctor/home"]


    if(protectedRoutes.includes(nextUrl.pathname) && !isAuthenticated){
        return NextResponse.redirect(new URL("/login",req.url))
    }

    return NextResponse.next()

}

export const config = {
    matcher:["/user/profile","/forgot-password","/otppage","/doctor/otppage","/doctor/home"]
}

//, "/doctor/home"