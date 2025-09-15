import React, { useState, useEffect, useCallback } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";
import { useAuthStore } from "../../stores/authStore";
import { SearchBar } from "./SearchBar";
import { NotificationDropdown } from "../notifications/NotificationDropdown";
import { UserMenu } from "./UserMenu";

export const Header: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Your event was approved",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 2,
      text: "New attendee registered",
      time: "1 hour ago",
      read: false,
    },
    { id: 3, text: "Event starting soon", time: "2 hours ago", read: true },
  ]);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

  const { currentUser, logout } = useAuthStore();
  const { darkMode, setSidebarMobile, toggleDarkMode, sidebar } = useUIStore();

  const hasUnreadNotifications = notifications.some(notification => !notification.read);

  const markAsRead = useCallback((id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, [notifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  }, [notifications]);

  const handleSearch = useCallback((query: string) => {
    console.log("Search query:", query);
  }, []);

  const handleSearchFocusChange = useCallback((isFocused: boolean) => {
    setIsMobileSearchExpanded(isFocused);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sticky top-0 z-50 lg:z-40">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarMobile(!sidebar.mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Search */}
          <div className="hidden md:block w-60 lg:w-80 transition-all duration-300">
            <SearchBar 
              placeholder="Search events, attendees..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Mobile search - separate from other right-side icons */}
          <div className="md:hidden">
            <SearchBar 
              placeholder="Search..."
              onSearch={handleSearch}
              onFocusChange={handleSearchFocusChange}
            />
          </div>

          {/* Other icons - hidden when mobile search is expanded */}
          <div className={`flex items-center space-x-3 transition-all duration-300 ${
            isMobileSearchExpanded ? 'opacity-0 pointer-events-none w-0 overflow-hidden' : 'opacity-100 w-auto'
          }`}>
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <NotificationDropdown
              notifications={notifications}
              hasUnread={hasUnreadNotifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              isMobileSearchExpanded={isMobileSearchExpanded}
            />

            {/* User menu */}
            <UserMenu
              user={{
                name: currentUser?.name || "User",
                email: currentUser?.email || "",
                role: currentUser?.role
              }}
              isOpen={userMenuOpen}
              onToggle={() => setUserMenuOpen(!userMenuOpen)}
              onLogout={logout}
            />
          </div>
        </div>
      </div>
    </header>
  );
};