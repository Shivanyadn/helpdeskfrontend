'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Menu 
} from 'lucide-react';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { Button } from "@/components/ui/button";

const AdminViewTicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const refreshTickets = async () => {
    try {
      // Simulate API call or replace with a real API call
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Tickets refreshed');
    } catch (error) {
      console.error('Error refreshing tickets:', error);
    }
  };

  useEffect(() => {
    refreshTickets();
  }, []);

  return (
    <>
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={toggleSidebar} 
              className="md:hidden"
            >
              <Menu />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ticket Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all support tickets in the system</p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-auto flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {/* Filter Toggle */}
                <Button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </Button>

                {/* Refresh Button */}
                <button 
                  onClick={refreshTickets}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw size={18} />
                </button>

                {/* Export Button */}
                <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminViewTicketsPage;