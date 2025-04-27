"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChatTheme } from "./chatTheme"; // Adjust the path if needed

interface Message {
  fromSelf: boolean;
  text: string;
  time: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "file";
}

interface ChatMessageListProps {
  messages: Message[];
  theme: ChatTheme;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  theme,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date for better organization
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";
    
    messages.forEach((message) => {
      const messageDate = message.time.split(' ')[0]; // Extract date part
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: currentDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });
    
    return groups;
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-lg">No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
        </div>
      ) : (
        messages.map((message, index) => {
          const isConsecutive = index > 0 && 
            messages[index - 1].fromSelf === message.fromSelf;
          
          return (
            <div
              key={index}
              className={`mb-2 flex ${
                message.fromSelf ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
                  message.fromSelf
                    ? "rounded-br-sm text-white"
                    : "rounded-bl-sm bg-white text-gray-800"
                } ${!isConsecutive ? "mt-3" : ""}`}
                style={{
                  backgroundColor: message.fromSelf ? theme.primary : "#ffffff",
                  boxShadow: message.fromSelf 
                    ? `0 2px 5px ${theme.primary}33` 
                    : "0 2px 5px rgba(0,0,0,0.05)",
                }}
              >
                {/* Media content */}
                {message.mediaUrl && message.mediaType === "image" && (
                  <ImageWithLoader src={message.mediaUrl} />
                )}

                {message.mediaUrl && message.mediaType === "video" && (
                  <VideoWithLoader src={message.mediaUrl} />
                )}

                {message.mediaUrl && message.mediaType === "file" && (
                  <div className="p-4 bg-gray-100 rounded-xl mb-2 flex items-center space-x-3 border border-gray-200">
                    <div className="p-2 rounded-full bg-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">Document</div>
                      <a
                        href={message.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline truncate block"
                        style={{ color: theme.primary }}
                      >
                        View / Download
                      </a>
                    </div>
                  </div>
                )}

                {/* Message text */}
                {message.text && (
                  <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                )}

                {/* Message time */}
                <p
                  className="text-xs opacity-80 mt-1 text-right"
                  style={{
                    color: message.fromSelf ? "rgba(255,255,255,0.8)" : "#6B7280",
                  }}
                >
                  {message.time}
                </p>
                
                {/* Message tail */}
                <div 
                  className={`absolute bottom-0 w-4 h-4 ${
                    message.fromSelf ? "-right-2" : "-left-2"
                  }`}
                  style={{
                    backgroundColor: message.fromSelf ? theme.primary : "#ffffff",
                    clipPath: message.fromSelf 
                      ? "polygon(0 0, 0% 100%, 100% 100%)" 
                      : "polygon(100% 0, 0% 100%, 100% 100%)",
                    display: isConsecutive ? "none" : "block"
                  }}
                />
              </div>
            </div>
          );
        })
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

// Enhanced ImageWithLoader Component
const ImageWithLoader: React.FC<{ src: string }> = ({ src }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative mb-3 rounded-xl overflow-hidden">
      {!loaded && !error && (
        <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      )}
      
      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-100 rounded-xl text-center">
          <p className="text-red-500 text-sm">Unable to load image</p>
        </div>
      )}
      
      <img
        src={src}
        alt="Media content"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`rounded-xl object-cover w-full max-h-64 transition-all duration-300 ${
          loaded && !error ? "opacity-100" : "opacity-0 h-0"
        }`}
      />
    </div>
  );
};

// Enhanced VideoWithLoader Component
const VideoWithLoader: React.FC<{ src: string }> = ({ src }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative mb-3 rounded-xl overflow-hidden">
      {!loaded && !error && (
        <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </div>
      )}
      
      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-100 rounded-xl text-center">
          <p className="text-red-500 text-sm">Unable to load video</p>
        </div>
      )}
      
      <video
        src={src}
        controls
        onLoadedData={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`rounded-xl w-full max-h-64 transition-all duration-300 ${
          loaded && !error ? "opacity-100" : "opacity-0 h-0"
        }`}
      />
    </div>
  );
};

export default ChatMessageList;