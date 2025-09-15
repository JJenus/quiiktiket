import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Ticket, 
  BarChart3, 
  Users, 
  Settings,
  ChevronLeft,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Attendees', href: '/attendees', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { sidebar, toggleSidebar, setSidebarMobile } = useUIStore();
  const { currentUser } = useAuthStore();

  const handleNavigation = () => {
    // Close mobile sidebar when navigating
    if (sidebar.mobileOpen) {
      setSidebarMobile(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          "lg:hidden",
          sidebar.mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarMobile(false)}
      />

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebar.mobileOpen ? 0 : -320, // Increased to ensure it's completely off-screen
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden w-80",
          "lg:hidden transform transition-transform duration-300",
          !sidebar.mobileOpen && "translate-x-[-100%]",
          className
        )}
      >
        {/* Mobile sidebar content */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white truncate">
              QuiikTicket
            </span>
          </div>

          <button
            onClick={() => setSidebarMobile(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white">
                {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentUser?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser?.role || "Organizer"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavigation}
              className="flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: sidebar.collapsed ? "80px" : "280px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "hidden lg:flex sticky top-0 z-30 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <motion.div
            animate={{ opacity: sidebar.collapsed ? 0 : 1 }}
            className="flex items-center space-x-2 min-w-0 overflow-hidden my-1"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white truncate whitespace-nowrap">
              QuiikTicket
            </span>
          </motion.div>

          {/* Show app icon when collapsed */}
          {sidebar.collapsed && (
            <div className="w-8 h-8 bg-gradient-to-r mr-2 from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Ticket className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Collapse button at top (hidden when collapsed) */}
          {!sidebar.collapsed && (
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-300" />
            </button>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <motion.div
            animate={{
              justifyContent: sidebar.collapsed ? "center" : "flex-start",
            }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white">
                {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <motion.div
              initial={false}
              animate={{
                opacity: sidebar.collapsed ? 0 : 1,
                display: sidebar.collapsed ? "none" : "block",
              }}
              className="min-w-0 flex-1"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentUser?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser?.role || "Organizer"}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ x: sidebar.collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group rounded-lg transition-all duration-200",
                "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                "dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              )}
            >
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium w-full",
                  sidebar.collapsed && "justify-center"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <motion.span
                  initial={false}
                  animate={{
                    opacity: sidebar.collapsed ? 0 : 1,
                    display: sidebar.collapsed ? "none" : "inline",
                  }}
                  className="ml-3"
                >
                  {item.name}
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Collapse Button at Bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <button
            onClick={toggleSidebar}
            className={cn(
              "flex items-center w-full p-2 text-sm font-medium rounded-lg transition-colors",
              "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
              "dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800",
              sidebar.collapsed && "justify-center"
            )}
          >
            {sidebar.collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
};