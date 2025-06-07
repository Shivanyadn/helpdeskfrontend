"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Ticket,
  Book,
  Laptop,
  BarChart,
  ChevronDown,
  X,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

interface EmployeeSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [showTicketsSubMenu, setShowTicketsSubMenu] = useState(false);
  const [showKnowledgeBaseSubMenu, setShowKnowledgeBaseSubMenu] = useState(false);
  const [showAssetRequestSubMenu, setShowAssetRequestSubMenu] = useState(false);
  const [showReportsSubMenu, setShowReportsSubMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setTheme(savedDarkMode === 'true' ? 'dark' : 'light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('darkMode', newTheme === 'dark' ? 'true' : 'false');
  };

  // Add this function to check if the current path starts with a specific prefix
  const isPath = (prefix: string) => pathname.startsWith(prefix);

  useEffect(() => {
    if (pathname.startsWith("/tickets/employee")) {
      setShowTicketsSubMenu(true);
    } else if (pathname.startsWith("/knowledge_base_faqs/employee")) {
      setShowKnowledgeBaseSubMenu(true);
    } else if (pathname.startsWith("/asset/employee")) {
      setShowAssetRequestSubMenu(true);
    } else if (pathname.startsWith("/reports/employee") || pathname.startsWith("/analytics/employee")) {
      setShowReportsSubMenu(true);
    }

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [pathname]);

  const ticketSubLinks = [
    { label: "Create Ticket", href: "/tickets/employee/create-ticket" },
    { label: "Track Ticket", href: "/tickets/employee/track-ticket" },
    { label: "View Tickets", href: "/tickets/employee/view-ticket" },
  ];

  const knowledgeBaseSubLinks = [
    { label: "FAQs", href: "/knowledge_base_faqs/employee/faqs" },
    { label: "AI-Powered Search", href: "/knowledge_base_faqs/employee/ai-powered-search" },
  ];

  const assetRequestSubLinks = [
    { label: "Request Form", href: "/asset/employee/request_form" },
    { label: "Request Status", href: "/asset/employee/request_status" },
  ];

  const reportsSubLinks = [
    { label: "Ticket Status", href: "/analytics/employee/graph" },
    { label: "Reports", href: "/reports/employee/ticket_status" },
  ];

  // Animation variants with improved transitions
  const sidebarVariants = {
    open: { 
      x: 0, 
      width: 250, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3 
      } 
    },
    closed: { 
      x: 0, 
      width: 80, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3 
      } 
    },
  };

  const subMenuVariants = {
    open: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    },
    closed: { 
      height: 0, 
      opacity: 0,
      transition: { 
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    open: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      } 
    },
    closed: { 
      opacity: 0, 
      y: -5, 
      transition: { 
        duration: 0.1 
      } 
    }
  };
  
  return (
    <motion.aside
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-xl z-50 overflow-hidden transition-all duration-300 ${
        !isOpen && "hover:w-[250px]"
      }`}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold">HD</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Employee Portal</h2>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold">HD</span>
            </div>
          )}
          
          {isOpen && (
            <button 
              onClick={toggleSidebar} 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Theme Toggle Button */}
        <div className="px-4 pt-4">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            {isOpen && (
              <span className="ml-3 text-sm font-medium">
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          <Link
            href="/dashboard/employee"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/dashboard/employee"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            } hover:scale-[1.02]`}
          >
            <div>
              <Home size={20} />
            </div>
            {isOpen && <span className="ml-3 text-sm font-medium">Dashboard</span>}
          </Link>
  
          {/* Expandable Menus with improved styling to match dashboard */}
          {[
            {
              label: "My Tickets",
              icon: <Ticket size={20} />,
              subLinks: ticketSubLinks,
              isOpen: showTicketsSubMenu,
              toggle: () => setShowTicketsSubMenu((prev) => !prev),
              isActive: isPath("/tickets/employee"),
            },
            {
              label: "Knowledge Base",
              icon: <Book size={20} />,
              subLinks: knowledgeBaseSubLinks,
              isOpen: showKnowledgeBaseSubMenu,
              toggle: () => setShowKnowledgeBaseSubMenu((prev) => !prev),
              isActive: isPath("/knowledge_base_faqs/employee"),
            },
            {
              label: "Asset Requests",
              icon: <Laptop size={20} />,
              subLinks: assetRequestSubLinks,
              isOpen: showAssetRequestSubMenu,
              toggle: () => setShowAssetRequestSubMenu((prev) => !prev),
              isActive: isPath("/asset/employee"),
            },
            {
              label: "Analytics",
              icon: <BarChart size={20} />,
              subLinks: reportsSubLinks,
              isOpen: showReportsSubMenu,
              toggle: () => setShowReportsSubMenu((prev) => !prev),
              isActive: isPath("/reports/employee") || isPath("/analytics/employee"),
            },
          ].map(({ label, icon, subLinks, isOpen: menuOpen, toggle, isActive }) => (
            <div key={label} className="space-y-1">
              <button
                onClick={toggle}
                className={`w-full flex items-center ${
                  isOpen ? "justify-between px-4" : "justify-center"
                } py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                } hover:scale-[1.02]`}
              >
                <div className="flex items-center">
                  <div className={`${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}>
                    {icon}
                  </div>
                  {isOpen && <span className="ml-3 text-sm font-medium">{label}</span>}
                </div>
                {isOpen && (
                  <motion.div
                    animate={{ rotate: menuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                )}
              </button>
              
              <AnimatePresence>
                {(menuOpen || (isActive && !isOpen)) && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={subMenuVariants}
                    className="overflow-hidden"
                  >
                    <div className={`pl-${isOpen ? "10" : "0"} space-y-1`}>
                      {subLinks.map((link) => (
                        <motion.div key={link.href} variants={itemVariants}>
                          <Link
                            href={link.href}
                            className={`flex items-center ${
                              isOpen ? "pl-4 pr-4" : "justify-center"
                            } py-2 rounded-lg ${
                              pathname === link.href
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            } transition-colors text-sm`}
                          >
                            {!isOpen && (
                              <div className="w-6 h-6 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              </div>
                            )}
                            {isOpen && <span>{link.label}</span>}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
        
        {/* Settings Link at bottom */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            href="/settings/employee/settings"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/settings/employee/settings"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div>
              <Settings size={20} />
            </div>
            {isOpen && <span className="ml-3 text-sm font-medium">Settings</span>}
          </Link>
        </div>

        {/* Responsive Layout Indicator */}
        <div className={`sidebar-content ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
          {/* Render different layouts or styles based on `isMobile` */}
          {isMobile ? (
            <p className="text-sm text-gray-500">Mobile view enabled</p>
          ) : (
            <p className="text-sm text-gray-500">Desktop view enabled</p>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default EmployeeSidebar;
