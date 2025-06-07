'use client';

import React, { useState, useEffect } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { ArrowLeft, FileText, Download, Calendar, Filter, Search, RefreshCw, ChevronDown, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';

type Report = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  status: string;
  metrics?: {
    totalTickets: number;
    resolvedTickets: number;
    avgResolutionTime: string;
  };
  ticketId: string;
  category: string;
  priority: string;
  createdAt: string;
  assignedTo: {
    firstName: string;
    lastName: string;
  };
  resolution?: string;
  attachments?: {
    fileName: string;
    fileType: string;
  }[];
};

export default function EmployeeReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportTypeFilter, setReportTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]); // Fixed type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        const response = await fetch('https://help.zenapi.co.in/api/tickets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching reports: ${response.status}`);
        }
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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

  const downloadReportAsPDF = (report: Report) => {
    const doc = new jsPDF();

    // Add a title and header
    doc.setFontSize(18);
    doc.text('Ticket Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
    doc.line(10, 35, 200, 35); // Horizontal line

    // Ticket Details
    doc.setFontSize(14);
    doc.text('Ticket Details', 10, 45);
    doc.setFontSize(12);
    doc.text(`Ticket ID: ${report.ticketId}`, 10, 55);
    doc.text(`Title: ${report.title}`, 10, 65);
    doc.text(`Description: ${report.description}`, 10, 75);
    doc.text(`Category: ${report.category}`, 10, 85);
    doc.text(`Priority: ${report.priority}`, 10, 95);
    doc.text(`Status: ${report.status}`, 10, 105);
    doc.text(`Created At: ${new Date(report.createdAt).toLocaleString()}`, 10, 115);

    // Assigned To
    doc.setFontSize(14);
    doc.text('Assigned To', 10, 125);
    doc.setFontSize(12);
    doc.text(`${report.assignedTo.firstName} ${report.assignedTo.lastName}`, 10, 135);

    // Resolution
    if (report.status === 'Closed' && report.resolution) {
      doc.setFontSize(14);
      doc.text('Resolution', 10, 145);
      doc.setFontSize(12);
      doc.text(report.resolution, 10, 155);
    }

    // Attachments
    if (report.attachments && report.attachments.length > 0) {
      doc.setFontSize(14);
      doc.text('Attachments', 10, 165);
      doc.setFontSize(12);
      report.attachments.forEach((attachment, index) => {
        doc.text(`- ${attachment.fileName} (${attachment.fileType})`, 10, 175 + index * 10);
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.text(`Page 1 of 1`, 105, 290, { align: 'center' });

    doc.save(`${report.ticketId}.pdf`);
  };

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
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-center justify-center border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading reports...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Error</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button 
                  onClick={refreshReports}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredReports.length > 0 ? (
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
                      
                      {expandedReport === report.id && report.metrics && (
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
                      {report.status === 'Available' || report.status === 'Closed' ? (
                        <button 
                          onClick={() => downloadReportAsPDF(report)}
                          className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-colors shadow-sm"
                        >
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