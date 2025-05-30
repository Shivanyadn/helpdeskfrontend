'use client';

import React, { useState } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { ArrowLeft, FileText, Download, Calendar, Filter, Search, RefreshCw, ChevronDown, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Sample report data
const reports = [
  {
    id: 'REP001',
    title: 'Monthly Ticket Summary',
    description: 'Summary of all tickets created and resolved in the current month',
    date: '2025-06-01',
    type: 'Monthly',
    status: 'Available',
    metrics: {
      totalTickets: 45,
      resolvedTickets: 38,
      avgResolutionTime: '1.8 days'
    }
  },
  {
    id: 'REP002',
    title: 'Quarterly Performance Report',
    description: 'Detailed analysis of ticket resolution times and satisfaction ratings',
    date: '2025-04-01',
    type: 'Quarterly',
    status: 'Available',
    metrics: {
      totalTickets: 132,
      resolvedTickets: 120,
      avgResolutionTime: '2.1 days'
    }
  },
  {
    id: 'REP003',
    title: 'Annual IT Asset Usage',
    description: 'Overview of IT assets requested and utilized throughout the year',
    date: '2025-01-15',
    type: 'Annual',
    status: 'Available',
    metrics: {
      totalTickets: 520,
      resolvedTickets: 498,
      avgResolutionTime: '2.5 days'
    }
  },
  {
    id: 'REP004',
    title: 'Weekly Ticket Trends',
    description: 'Analysis of ticket creation patterns and common issues',
    date: '2025-06-07',
    type: 'Weekly',
    status: 'Processing',
    metrics: {
      totalTickets: 12,
      resolvedTickets: 8,
      avgResolutionTime: '1.2 days'
    }
  },
];

export default function EmployeeReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportTypeFilter, setReportTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const refreshReports = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const toggleExpandReport = (reportId: string) => {
    if (expandedReport === reportId) {
      setExpandedReport(null);
    } else {
      setExpandedReport(reportId);
    }
  };

  // Filter reports based on type and search query
  const filteredReports = reports
    .filter(report => reportTypeFilter === 'All' || report.type === reportTypeFilter)
    .filter(report => 
      searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} overflow-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Ticket Status Reports</h1>
              <div className="flex items-center gap-2">
                <Link 
                  href="/dashboard/employee"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Dashboard</span>
                </Link>
                <span className="text-gray-400">|</span>
                <p className="text-gray-600">View and analyze your ticket performance</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button 
                onClick={refreshReports}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="border-b border-gray-100 px-6 py-4 flex items-center">
                  <Search size={16} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search reports by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-0 focus:ring-0 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Filter size={14} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Filter by</span>
                  </div>
                  <select
                    value={reportTypeFilter}
                    onChange={(e) => setReportTypeFilter(e.target.value)}
                    className="text-sm border-0 focus:ring-0 py-0 pl-2 pr-7 rounded-md bg-transparent text-gray-700"
                  >
                    <option value="All">All Types</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reports Grid */}
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <div 
                  key={report.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText size={18} className="text-blue-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">{report.title}</h3>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{report.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{report.date}</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.type}
                      </span>
                    </div>
                    
                    {/* Expandable section */}
                    <div 
                      className="border-t border-gray-100 pt-4 mt-4 cursor-pointer"
                      onClick={() => toggleExpandReport(report.id)}
                    >
                      <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                        <span>Report Metrics</span>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${expandedReport === report.id ? 'rotate-180' : ''}`} 
                        />
                      </div>
                      
                      {expandedReport === report.id && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Total Tickets</p>
                            <p className="text-lg font-semibold text-gray-800">{report.metrics.totalTickets}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Resolved</p>
                            <p className="text-lg font-semibold text-green-600">{report.metrics.resolvedTickets}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Avg. Resolution</p>
                            <p className="text-lg font-semibold text-blue-600">{report.metrics.avgResolutionTime}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      {report.status === 'Available' ? (
                        <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-colors shadow-sm">
                          <Download size={16} />
                          <span>Download Report</span>
                        </button>
                      ) : (
                        <button disabled className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
                          <Clock size={16} />
                          <span>Processing...</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchQuery 
                  ? `No reports match your search for "${searchQuery}".` 
                  : reportTypeFilter === 'All' 
                    ? "There are no reports available at this time." 
                    : `There are no ${reportTypeFilter.toLowerCase()} reports available.`}
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setReportTypeFilter('All');
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}