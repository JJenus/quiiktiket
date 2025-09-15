import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

export interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  hasUnread: boolean;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  isMobileSearchExpanded?: boolean;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  hasUnread,
  onMarkAsRead,
  onMarkAllAsRead,
  isMobileSearchExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when mobile search is expanded
  useEffect(() => {
    if (isMobileSearchExpanded) {
      setIsOpen(false);
    }
  }, [isMobileSearchExpanded]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Calculate dropdown position to center it on mobile
  const getDropdownPosition = () => {
    if (typeof window === 'undefined') return { left: 'auto', right: '0', transform: 'none' };
    
    const isMobile = window.innerWidth < 768;
    if (isMobile && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const dropdownWidth = 320; // Width of the dropdown
      const viewportWidth = window.innerWidth;
      
      // Calculate left position to center the dropdown
      let leftPosition = buttonCenter - dropdownWidth / 2;
      
      // Ensure dropdown doesn't go off screen
      if (leftPosition < 16) leftPosition = 16; // Minimum margin
      if (leftPosition + dropdownWidth > viewportWidth - 16) {
        leftPosition = viewportWidth - dropdownWidth - 16; // Maximum right position
      }
      
      return { 
        left: `${leftPosition}px`, 
        right: 'auto', 
        transform: 'none' 
      };
    }
    
    return { left: 'auto', right: '0', transform: 'none' };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors relative"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
            aria-label="Unread notifications"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed md:absolute mt-2 w-80 max-w-[calc(100vw-32px)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 overflow-hidden z-50"
            style={getDropdownPosition()}
          >
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Notifications
              </h3>
              {hasUnread && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      !notification.read
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {notification.text}
                      </p>
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline ml-2 flex-shrink-0"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No notifications
                  </p>
                </div>
              )}
            </div>
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
              <a
                href="/notifications"
                className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};