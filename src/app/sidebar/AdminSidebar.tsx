'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Ticket,
  Settings,
  Book,
  MessageSquare,
  Monitor,
  BarChart,
  ShieldCheck,
  ChevronDown,
  X,
  User,
  FileText,
  PieChart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [showTicketsSubMenu, setShowTicketsSubMenu] = useState(false);
  const [showAssignmentRulesSubMenu, setShowAssignmentRulesSubMenu] = useState(false);
  const [showKnowledgeBaseSubMenu, setShowKnowledgeBaseSubMenu] = useState(false);
  const [showLiveChatSubMenu, setShowLiveChatSubMenu] = useState(false);
  const [showAssetSubMenu, setShowAssetSubMenu] = useState(false);
  const [showReportsSubMenu, setShowReportsSubMenu] = useState(false);
  const [showAnalyticsSubMenu, setShowAnalyticsSubMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if the current path starts with a specific prefix
  const isPath = (prefix: string) => pathname.startsWith(prefix);

  useEffect(() => {
    if (pathname.startsWith("/tickets/admin")) {
      setShowTicketsSubMenu(true);
    } else if (pathname.startsWith("/tickets/admin")) {
      setShowAssignmentRulesSubMenu(true);
    } else if (pathname.startsWith("/knowledge-base/admin")) {
      setShowKnowledgeBaseSubMenu(true);
    } else if (pathname.startsWith("/live_chat/admin")) {
      setShowLiveChatSubMenu(true);
    } else if (pathname.startsWith("/asset/admin")) {
      setShowAssetSubMenu(true);
    } else if (pathname.startsWith("/reports/admin")) {
      setShowReportsSubMenu(true);
    } else if (pathname.startsWith("/analytics/admin")) {
      setShowAnalyticsSubMenu(true);
    }

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [pathname]);

  const ticketSubLinks = [
    { label: "View Tickets", href: "/tickets/admin/view-ticket" },
    { label: "Assign Tickets", href: "/tickets/admin/assign-ticket" },
    { label: "Rules & Automation", href: "/tickets/admin/rules-and-automation" },
  ];

  const assignmentRulesSubLinks = [
    { label: "Auto-Assign", href: "/tickets/admin/auto-assign-ticket" },
    { label: "Escalation", href: "/sla_management/admin/escalations" },
  ];

  const knowledgeBaseSubLinks = [
    { label: "Create Article", href: "/knowledge_base_faqs/admin/create" },
    { label: "Edit Article", href: "/knowledge_base_faqs/admin/edit" },
    { label: "Delete Article", href: "/knowledge_base_faqs/admin/delete" },
  ];

  const liveChatSubLinks = [
    { label: "Setup WhatsApp", href: "/live_chat/admin/setup_whatsapp" },
    { label: "IVR Configuration", href: "/live_chat/admin/ivr" },
  ];

  const assetSubLinks = [
    { label: "Assign Asset Managers", href: "/asset/admin/assign_asset" },
  ];

  const reportsSubLinks = [
    { label: "Excel Reports", href: "/reports/admin/excel" },
    { label: "PDF Reports", href: "/reports/admin/pdf" },
  ];

  const analyticsSubLinks = [
    { label: "Analytics Metrics", href: "/reports/admin/analytics" },
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
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Admin Portal</h2>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
              <ShieldCheck size={18} className="text-white" />
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
              <h3 className="text-sm font-medium text-gray-800">Admin User</h3>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {/* Dashboard Link */}
          <Link
            href="/dashboard/admin"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/dashboard/admin"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
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
              label: "Tickets",
              icon: <Ticket size={20} />,
              subLinks: ticketSubLinks,
              isOpen: showTicketsSubMenu,
              toggle: () => setShowTicketsSubMenu((prev) => !prev),
              isActive: isPath("/tickets/admin") && !isPath("/tickets/admin"),
            },
            {
              label: "Assignment Rules",
              icon: <Settings size={20} />,
              subLinks: assignmentRulesSubLinks,
              isOpen: showAssignmentRulesSubMenu,
              toggle: () => setShowAssignmentRulesSubMenu((prev) => !prev),
              isActive: isPath("/tickets/admin"),
            },
            {
              label: "Knowledge Base",
              icon: <Book size={20} />,
              subLinks: knowledgeBaseSubLinks,
              isOpen: showKnowledgeBaseSubMenu,
              toggle: () => setShowKnowledgeBaseSubMenu((prev) => !prev),
              isActive: isPath("/knowledge-base/admin"),
            },
            {
              label: "Live Chat Config",
              icon: <MessageSquare size={20} />,
              subLinks: liveChatSubLinks,
              isOpen: showLiveChatSubMenu,
              toggle: () => setShowLiveChatSubMenu((prev) => !prev),
              isActive: isPath("/live_chat/admin"),
            },
            {
              label: "Asset & IT Mgmt",
              icon: <Monitor size={20} />,
              subLinks: assetSubLinks,
              isOpen: showAssetSubMenu,
              toggle: () => setShowAssetSubMenu((prev) => !prev),
              isActive: isPath("/asset/admin"),
            },
            {
              label: "Reports",
              icon: <FileText size={20} />,
              subLinks: reportsSubLinks,
              isOpen: showReportsSubMenu,
              toggle: () => setShowReportsSubMenu((prev) => !prev),
              isActive: isPath("/reports/admin"),
            },
            {
              label: "Analytics",
              icon: <PieChart size={20} />,
              subLinks: analyticsSubLinks,
              isOpen: showAnalyticsSubMenu,
              toggle: () => setShowAnalyticsSubMenu((prev) => !prev),
              isActive: isPath("/analytics/admin"),
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
                                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm"
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
        
        {/* System Settings Link at bottom */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/settings/admin/settings"
            className={`flex items-center ${
              isOpen ? "justify-start px-4" : "justify-center"
            } py-3 rounded-lg transition-all duration-200 ${
              pathname === "/settings/admin/settings"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div>
              <ShieldCheck size={20} />
            </div>
            {isOpen && <span className="ml-3 text-sm font-medium">System Settings</span>}
          </Link>
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;