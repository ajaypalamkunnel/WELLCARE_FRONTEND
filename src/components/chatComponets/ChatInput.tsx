"use client";

import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { ChatTheme } from "./chatTheme";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  theme: ChatTheme;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, theme }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("1)",message);
      
      
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-t p-3 flex items-center"
    >
      {/*  Attachment button (not functional yet) */}
      {/* <button
        type="button"
        className="p-2 rounded-full hover:bg-gray-100 mr-2"
        title="Attach file"
      >
        <Paperclip size={20} className="text-gray-600" />
      </button> */}

      {/*  Message input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
        style={{ boxShadow: `0 0 0 2px ${theme.primary}22` }}
      />

      {/* 🚀 Send button */}
      <button
        type="submit"
        className="ml-2 p-2 text-white rounded-full transition-colors"
        style={{ backgroundColor: theme.primary }}
        title="Send message"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;
