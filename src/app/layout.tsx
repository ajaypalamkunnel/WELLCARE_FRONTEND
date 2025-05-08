import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/toastProvider/ToasterProvider";
import IncomingCallModal from "@/components/videoCallComponents/IncomingCallModal";
import GlobalSocketListener from "@/components/providers/GlobalSocketListener";
import SocketInitializer from "@/components/providers/SocketInitializer";
import NotificationContainer from "@/components/commonUIElements/NotificationContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wellcare",
  description: "WellCare Medicare Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToasterProvider/>
        <SocketInitializer /> 
        <GlobalSocketListener/>
        <IncomingCallModal/>
        <NotificationContainer/>
        {children}
      
      </body>
    </html>
  );
}
