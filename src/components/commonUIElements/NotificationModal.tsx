"use client";

import { NotificationDTO } from "@/types/notificationDto";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fetchNotificationsDoctor } from "@/services/doctor/doctorService";
import { fetchNotifications } from "@/services/user/auth/authService";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDoctor: boolean;
}

const NotificationModal: React.FC<Props> = ({ isOpen, onClose, isDoctor }) => {
  const [allNotifications, setAllNotifications] = useState<NotificationDTO[]>(
    []
  );
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const loadAllNotifications = async () => {
    try {
      setLoading(true);
      if (isDoctor) {
        const data = await fetchNotificationsDoctor(); // Fetch all at once
        setAllNotifications(data);
      } else {
        console.log("--->",isDoctor);
        
        const data = await fetchNotifications();
        setAllNotifications(data);
      }
    } catch (error) {
      console.error("Error loading notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setVisibleCount(10);
      loadAllNotifications();
    }
  }, [isOpen]);
  const visibleNotifications = allNotifications.slice(0, visibleCount);
  const hasMore = visibleNotifications.length < allNotifications.length;

  return isOpen ? (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="w-full sm:w-[400px] h-full bg-white dark:bg-[#1e222d] p-5 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            🔔 Notifications
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-700 dark:text-white" />
          </button>
        </div>

        {visibleNotifications.length === 0 && !loading && (
          <p className="text-gray-500 text-sm text-center mt-10">
            No notifications yet.
          </p>
        )}

        <div className="space-y-4">
          {visibleNotifications.map((notif) => (
            <div
              key={notif._id}
              className="p-3 border dark:border-gray-700 rounded-lg"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">
                {notif.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {notif.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(notif.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="bg-[#1e222d] text-white px-4 py-2 rounded hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
};


export default NotificationModal