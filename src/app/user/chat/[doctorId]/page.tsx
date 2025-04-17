"use client";
import ChatWrapper from "@/components/chatComponets/ChatWrapper";
import Header from "@/components/doctorComponents/Header";
import { useParams } from "next/navigation";

const ChatWithDoctor = () => {
  const params = useParams();
  const doctorId = params?.doctorId as string;

  return (
    <>
      <Header />
      <ChatWrapper doctorId={doctorId} />
    </>
  );
};

export default ChatWithDoctor;
