"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  AlertTriangle,
  FileText,
  BarChart,
  Settings,
  ChevronDown,
  X,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

interface ManagerSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const ManagerSidebar: React.FC<ManagerSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [showTeamTicketsSubMenu, setShowTeamTicketsSubMenu] = useState(false);
  const [showSLAManagementSubMenu, setShowSLAManagementSubMenu] = useState(false);
  const [showArticleManagementSubMenu, setShowArticleManagementSubMenu] = useState(false);
  const [showAnalyticsSubMenu, setShowAnalyticsSubMenu] = useState(false);
  const [showReportsSubMenu, setShowReportsSubMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if the current path starts with a specific prefix
  const isPath = (prefix: string) => pathname.startsWith(prefix);

  useEffect(() => {
    if (pathname.startsWith("/tickets/manager")) {
      setShowTeamTicketsSubMenu(true);
    } else if (pathname.startsWith("/sla/manager")) {
      setShowSLAManagementSubMenu(true);
    } else if (pathname.startsWith("/articles/manager")) {
      setShowArticleManagementSubMenu(true);
    } else if (pathname.startsWith("/analytics/manager")) {
      setShowAnalyticsSubMenu(true);
    } else if (pathname.startsWith("/reports/manager")) {
      setShowReportsSubMenu(true);
    }

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [pathname]);

  const teamTicketsSubLinks = [
    { label: "Monitor Tickets", href: "/tickets/manager/monitor-ticket" },
    { label: "Track Escalated Cases", href: "/tickets/manager/track-escalated" },
  ];

  const slaManagementSubLinks = [
    { label: "Escalations", href: "/sla_management/manager/escalations" },
    { label: "Breach Alerts", href: "/sla_management/manager/breach_alerts" },
  ];

  const articleManagementSubLinks = [
    { label: "Feedback", href: "/article_mangement/manager/feedback" },
    { label: "AI Learning", href:"/article_mangement/manager/ai_learning" },
  ];

  const analyticsSubLinks = [
    { label: "Trends", href: "/analytics/manager/trends" },
    { label: "SLA Metrics", href: "/analytics/manager/sla_metrics" },
  ];

  const reportsSubLinks = [
    { label: "SLA Reports", href: "/reports/manager/sla_metrics" },
    { label: "Trends Report", href: "/reports/manager/trends_report" },
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
      className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 overflow-hidden transition-all duration-300 ${
        !isOpen && "hover:w-[250px]"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header with improved styling */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold">HD</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Manager Portal</h2>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold">HD</span>
            </div>
          )}
          
          {isOpen && (
            <button 
              onClick={toggleSidebar} 
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
  
        {/* User Section */}
        <div
          className={`p-5 border-b border-gray-100 ${
            isOpen ? "flex items-center space-x-3" : "flex flex-col items-center"
          }`}
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
            <User size={20} className="text-blue-600" />
          </div>
          {isOpen && (
            <div>
              <h3 className="text-sm font-medium text-gray-800">Manager Name</h3>
              <p className="text-xs text-gray-500">Support Team Lead</p>
            </div>
          )}
        </div>
  
        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {/* Dashboard Link */}
          <Link
            href="/dashboard/manager"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/dashboard/manager"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            } hover:scale-[1.02]`}
          >
            <div>
              <Home size={20} />
            </div>
            {isOpen && <span className="ml-3 text-sm font-medium">Dashboard</span>}
          </Link>
  
          {/* Expandable Menus */}
          {[
            {
              label: "Team Tickets",
              icon: <Users size={20} />,
              subLinks: teamTicketsSubLinks,
              isOpen: showTeamTicketsSubMenu,
              toggle: () => setShowTeamTicketsSubMenu((prev) => !prev),
              isActive: isPath("/tickets/manager"),
            },
            {
              label: "SLA Management",
              icon: <AlertTriangle size={20} />,
              subLinks: slaManagementSubLinks,
              isOpen: showSLAManagementSubMenu,
              toggle: () => setShowSLAManagementSubMenu((prev) => !prev),
              isActive: isPath("/sla/manager"),
            },
            {
              label: "Article Management",
              icon: <FileText size={20} />,
              subLinks: articleManagementSubLinks,
              isOpen: showArticleManagementSubMenu,
              toggle: () => setShowArticleManagementSubMenu((prev) => !prev),
              isActive: isPath("/articles/manager"),
            },
            {
              label: "Analytics",
              icon: <BarChart size={20} />,
              subLinks: analyticsSubLinks,
              isOpen: showAnalyticsSubMenu,
              toggle: () => setShowAnalyticsSubMenu((prev) => !prev),
              isActive: isPath("/analytics/manager"),
            },
            {
              label: "Reports",
              icon: <FileText size={20} />,
              subLinks: reportsSubLinks,
              isOpen: showReportsSubMenu,
              toggle: () => setShowReportsSubMenu((prev) => !prev),
              isActive: isPath("/reports/manager"),
            },
          ].map(({ label, icon, subLinks, isOpen: menuOpen, toggle, isActive }) => (
            <div key={label} className="space-y-1">
              <button
                onClick={toggle}
                className={`w-full flex items-center ${
                  isOpen ? "justify-between px-4" : "justify-center"
                } py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                } hover:scale-[1.02]`}
              >
                <div className="flex items-center">
                  <div className={`${isActive ? "text-blue-600" : ""}`}>
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
                                : "text-gray-600 hover:bg-gray-100"
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
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/profile/manager"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/profile/manager"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div>
              <Settings size={20} />
            </div>
            {isOpen && <span className="ml-3 text-sm font-medium">Settings</span>}
          </Link>
        </div>
      </div>

      {/* Example usage of `isMobile` */}
      <div className={`sidebar-content ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
        {/* Render different layouts or styles based on `isMobile` */}
      </div>
    </motion.aside>
  );
};

export default ManagerSidebar;
