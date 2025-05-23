import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {

    if (req.nextUrl.pathname === "/__nextjs_original-stack-frames") {
        return new NextResponse(null, { status: 204 });
      }

    


    const { cookies, nextUrl } = req;

    const patientToken = cookies.get("auth_token")?.value || null
    const doctorToken = cookies.get("doctorAccessToken")?.value || null
    const accessTokenAdmin = cookies.get("accessTokenAdmin")?.value || null
    const isAuthenticated = patientToken || doctorToken || accessTokenAdmin;
    
    
    const protectedRoutes = ["/user/profile", "/admin/dashboard", "/doctordashboard/home", "/doctordashboard/registration", "/doctordashboard/profile","/doctordashboard/subscriptionsuccess"]


    if (protectedRoutes.some((route) => nextUrl.pathname.startsWith(route)) && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next()

}

export const config = {
    matcher: ["/user/profile", "/admin/dashboard", "/doctordashboard/home", "/doctordashboard/registration", "/doctordashboard/profile","/doctordashboard/subscriptionsuccess","/__nextjs_original-stack-frames",]
}
