"use client";

import { Loader2, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { ChatTheme } from "./chatTheme";
import { uploadToCloudinary } from "@/utils/cloudinaryToClodinary";
import toast from "react-hot-toast";

interface ChatInputProps {
  onSendMessage: (text: string, mediaUrl?: string, mediaType?: string) => void;
  theme: ChatTheme;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, theme }) => {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("1)", message);

      onSendMessage(message);
      setMessage("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSendMedia = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const { secure_url, resource_type } = await uploadToCloudinary(
        selectedFile
      );
      setUploading(false);
      onSendMessage("", secure_url, resource_type); // Send media
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload media. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelMedia = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      {previewUrl && (
        <div className="p-3 border-t border-b bg-gray-100 flex flex-col items-center">
          <div className="relative w-full max-w-xs md:max-w-sm">
            {/* Preview Image or Video */}
            {selectedFile?.type.startsWith("image/") && (
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-lg w-full object-cover max-h-64"
              />
            )}
            {selectedFile?.type.startsWith("video/") && (
              <video
                src={previewUrl}
                controls
                className="rounded-lg w-full max-h-64"
              />
            )}

            {selectedFile?.type === "application/pdf" && (
              <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center justify-center max-w-xs">
                <p className="text-gray-800 font-semibold mb-2">
                  {selectedFile.name}
                </p>
                <a
                  href={previewUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View PDF
                </a>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mt-2">
            <button
              type="button"
              onClick={handleSendMedia}
              disabled={uploading}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
            >
              {uploading ? <Loader2 size={20} className="animate-spin"/> : "Send"}
            </button>
            <button
              type="button"
              onClick={handleCancelMedia}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border-t p-3 flex items-center"
      >
        {/*  Attachment button (not functional yet) */}
        <label
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          title="Attach file"
        >
          <Paperclip size={20} className="text-gray-600" />
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*,application/pdf"
            onChange={handleFileChange}
          />
        </label>

        {/*  Message input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
          style={{ boxShadow: `0 0 0 2px ${theme.primary}22` }}
        />

        {/*  Send button */}
        <button
          type="submit"
          className="ml-2 p-2 text-white rounded-full transition-colors"
          style={{ backgroundColor: theme.primary }}
          title="Send message"
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </>
  );
};

export default ChatInput;
