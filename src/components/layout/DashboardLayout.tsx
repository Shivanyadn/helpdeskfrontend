// src/components/layout/DashboardLayout.tsx
"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} overflow-auto p-6`}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
