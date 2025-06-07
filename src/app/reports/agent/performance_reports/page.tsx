// src/agent/reports/PerformanceReports.tsx

'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import AgentSidebar from '@/app/sidebar/AgentSidebar';

const PerformanceReports = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  useEffect(() => {
    const fetchResolvedTickets = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        const response = await axios.get('http://localhost:5000/api/tickets/analytics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const performance = response.data.performance[0] || {};
          console.log('Performance Data:', performance); // Example usage
          // Use the performance data in your component logic
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        alert('Failed to fetch analytics data. Please try again later.');
      }
    };

    fetchResolvedTickets();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6 max-w-7xl mx-auto">
          <p className="text-blue-700 text-sm">
            Your resolution time has improved by 5 minutes compared to last month, and your customer satisfaction rating has increased. Keep up the good work!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReports;
