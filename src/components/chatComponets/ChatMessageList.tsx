"use client";

import React, { useEffect, useRef } from "react";
import { ChatTheme } from "./chatTheme"; // Adjust the path if needed

interface Message {
  fromSelf: boolean;
  text: string;
  time: string;
}

interface ChatMessageListProps {
  messages: Message[];
  theme: ChatTheme;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, theme }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 flex ${message.fromSelf ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
              message.fromSelf
                ? "rounded-br-none text-white"
                : "rounded-bl-none text-gray-800 shadow"
            }`}
            style={{
              backgroundColor: message.fromSelf ? theme.primary : "#ffffff",
            }}
          >
            <p>{message.text}</p>
            <p
              className="text-xs mt-1"
              style={{ color: message.fromSelf ? theme.primaryLight : "#6B7280" }} // Tailwind gray-500
            >
              {message.time}
            </p>
          </div>
        </div>
      ))}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;




0
