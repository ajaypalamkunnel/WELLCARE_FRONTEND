"use client"
import React from "react"
import HeaderWrapper from "@/components/doctorComponents/HeaderWrapper"

export default function DoctorLayout({children}:{children: React.ReactNode}){
    return (
        <div>
            <HeaderWrapper/>
            {children}
        </div>
    )
}