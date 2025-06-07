"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Ticket,
  Book,
  BarChart,
  Settings,
  ChevronDown,
  X,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

interface AgentSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [showTicketsSubMenu, setShowTicketsSubMenu] = useState(true);
  const [showKnowledgeSubMenu, setShowKnowledgeSubMenu] = useState(false);
  const [showPerformanceSubMenu, setShowPerformanceSubMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if the current path starts with a specific prefix
  const isPath = (prefix: string) => pathname.startsWith(prefix);

  useEffect(() => {
    if (pathname.startsWith("/tickets/agent")) {
      setShowTicketsSubMenu(true);
    } else if (pathname.startsWith("/knowledge-base")) {
      setShowKnowledgeSubMenu(true);
    } else if (pathname.startsWith("/performance")) {
      setShowPerformanceSubMenu(true);
    }

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [pathname]);

  const ticketSubLinks = [
    { label: "View Tickets", href: "/tickets/agent/view-ticket" },
    { label: "Update Tickets", href: "/tickets/agent/update-ticket" },
    { label: "Prioritize Tickets", href: "/tickets/agent/assign-priority" },
  ];

  const knowledgeSubLinks = [
    { label: "Tag Articles", href: "/knowledge_base_faqs/agent/tag_articles" },
    { label: "Suggest FAQs", href: "/knowledge_base_faqs/agent/suggest_faqs" },
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
        {/* Header with improved styling to match dashboard */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold">HD</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Agent Portal</h2>
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
  
        {/* User Section with improved styling to match dashboard */}
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
              <h3 className="text-sm font-medium text-gray-800">Pooja</h3>
              <p className="text-xs text-gray-500">Support Team</p>
            </div>
          )}
        </div>
  
        {/* Menu Items with improved styling to match dashboard */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {/* Dashboard Link */}
          <Link
            href="/dashboard/agent"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/dashboard/agent"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
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
              label: "All Tickets",
              icon: <Ticket size={20} />,
              subLinks: ticketSubLinks,
              isOpen: showTicketsSubMenu,
              toggle: () => setShowTicketsSubMenu((prev) => !prev),
              isActive: isPath("/tickets/agent"),
            },
            {
              label: "Knowledge Base",
              icon: <Book size={20} />,
              subLinks: knowledgeSubLinks,
              isOpen: showKnowledgeSubMenu,
              toggle: () => setShowKnowledgeSubMenu((prev) => !prev),
              isActive: isPath("/knowledge-base"),
            },
            {
              label: "Analytics",
              icon: <BarChart size={20} />,
              subLinks: performanceSubLinks,
              isOpen: showPerformanceSubMenu,
              toggle: () => setShowPerformanceSubMenu((prev) => !prev),
              isActive: isPath("/performance"),
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

          {/* Remove the standalone Performance Reports Link that was here */}
        </nav>
        
        {/* Settings Link at bottom */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/settings/agent/settings"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/settings/agent/settings"
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

      {/* Sidebar content with responsive layout */}
      <div className={`sidebar-content ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
        {/* Render different layouts or styles based on `isMobile` */}
        {isMobile ? (
          <p className="text-sm text-gray-500">Mobile view enabled</p>
        ) : (
          <p className="text-sm text-gray-500">Desktop view enabled</p>
        )}
      </div>
    </motion.aside>
  );
};

export default AgentSidebar;

const performanceSubLinks = [
  { label: "Ticket Analytics", href: "/analytics/agent/graph" },
  { label: "Performance Analytics", href: "/reports/agent/performance_reports" },
];
