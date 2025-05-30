'use client';

import React, { useState, useMemo } from 'react';
import ManagerSidebar from '@/app/sidebar/ManagerSidebar';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dynamic from 'next/dynamic';
import { FileText, Download, Filter, Printer, Calendar, Clock, AlertTriangle, CheckCircle, Search, BarChart2 } from 'lucide-react';

// Dynamically import CSVLink with SSR disabled to prevent hydration errors
const CSVLink = dynamic(
  () => import('react-csv').then(mod => mod.CSVLink),
  { ssr: false }
);

const trendsData = [
  { date: '2025-04-01', resolved: 10, overdue: 2 },
  { date: '2025-04-02', resolved: 12, overdue: 3 },
  { date: '2025-04-03', resolved: 15, overdue: 4 },
  { date: '2025-04-04', resolved: 18, overdue: 5 },
  { date: '2025-04-05', resolved: 20, overdue: 6 },
  { date: '2025-04-06', resolved: 9, overdue: 1 },
  { date: '2025-04-07', resolved: 13, overdue: 7 },
];

const ITEMS_PER_PAGE = 4;

const ManagerTrendsReportPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('last7days');
  const [activeTab, setActiveTab] = useState('table');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFilters = () => setShowFilters(!showFilters);

  // Filtered & searched trends
  const filteredData = useMemo(() => {
    return trendsData
      .filter((t) => {
        const inDateRange =
          (!dateFrom || t.date >= dateFrom) && (!dateTo || t.date <= dateTo);
        const matchesSearch = t.date.includes(searchQuery);
        return inDateRange && matchesSearch;
      });
  }, [dateFrom, dateTo, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Calculate summary statistics
  const totalResolved = filteredData.reduce((sum, item) => sum + item.resolved, 0);
  const totalOverdue = filteredData.reduce((sum, item) => sum + item.overdue, 0);
  const totalTickets = totalResolved + totalOverdue;
  const slaBreachPercentage = totalOverdue > 0 
    ? Math.round((totalOverdue / totalTickets) * 100) 
    : 0;
  const complianceRate = 100 - slaBreachPercentage;

  // Export functions
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ticket Trends');
    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelFile]), 'ticket_trends_report.xlsx');
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'ticket_trends_report.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Ticket Trends Report', 14, 16);
    
    // Add header row
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 14, 25);
    doc.text('Resolved', 50, 25);
    doc.text('Overdue', 80, 25);
    doc.text('SLA Status', 110, 25);
    
    // Add data rows
    doc.setFont('helvetica', 'normal');
    filteredData.forEach((item, index) => {
      const y = 35 + index * 10;
      doc.text(item.date, 14, y);
      doc.text(item.resolved.toString(), 50, y);
      doc.text(item.overdue.toString(), 80, y);
      doc.text(item.overdue > 4 ? 'Breached' : 'On Track', 110, y);
    });
    
    doc.save('ticket_trends_report.pdf');
  };

  const printReport = () => window.print();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <ManagerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
          {/* Header with title and actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Ticket Trends Report</h1>
                <p className="text-gray-600">Monitor ticket resolution trends over time</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <button 
                onClick={toggleFilters}
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                Filters
              </button>
              
              <button 
                onClick={printReport}
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2 text-gray-600" />
                Print
              </button>
            </div>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Tickets</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-800">{totalTickets}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Resolved Tickets</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-800">{totalResolved}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Overdue Tickets</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-800">{totalOverdue}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">SLA Compliance</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-800">{complianceRate}%</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters */}
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
            <h3 className="font-medium text-gray-800 mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="text-gray-400 h-4 w-4" />
                  From Date
                </label>
                <input 
                  type="date" 
                  value={dateFrom} 
                  onChange={(e) => setDateFrom(e.target.value)} 
                  className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="text-gray-400 h-4 w-4" />
                  To Date
                </label>
                <input 
                  type="date" 
                  value={dateTo} 
                  onChange={(e) => setDateTo(e.target.value)} 
                  className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Search className="text-gray-400 h-4 w-4" />
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('table')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'table'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'summary'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Summary
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'table' && (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full border-collapse text-left">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {paginatedData.length > 0 ? (
                          paginatedData.map((t, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.date}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {t.resolved}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {t.overdue}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {t.overdue > 4 ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Breached
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    On Track
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                              No matching records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {filteredData.length > 0 && (
                    <div className="flex justify-between items-center pt-4 mt-4">
                      <span className="text-sm text-gray-600">
                        Showing {paginatedData.length} of {filteredData.length} entries
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                          Previous
                        </button>
                        <div className="flex items-center">
                          <span className="text-sm px-2 text-gray-600">Page {currentPage} of {totalPages}</span>
                        </div>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">Ticket Resolution Summary</h3>
                    <p className="text-blue-700 mb-2">
                      Out of {totalTickets} tickets, {totalResolved} were resolved within SLA ({complianceRate}% compliance rate).
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${complianceRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h3 className="font-medium text-gray-800 mb-3">Daily Resolution Trend</h3>
                      <div className="space-y-3">
                        {filteredData.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.date}</span>
                              <span className="text-sm font-medium text-gray-700">
                                {item.resolved} resolved / {item.overdue} overdue
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ 
                                  width: `${(item.resolved / (item.resolved + item.overdue)) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h3 className="font-medium text-gray-800 mb-3">SLA Compliance Trend</h3>
                      <div className="space-y-3">
                        {filteredData.map((item, index) => {
                          const isBreached = item.overdue > 4;
                          return (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{item.date}</span>
                                <span className={`text-sm font-medium ${isBreached ? 'text-red-600' : 'text-green-600'}`}>
                                  {isBreached ? 'Breached' : 'On Track'}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${isBreached ? 'bg-red-500' : 'bg-green-500'}`}
                                  style={{ 
                                    width: isBreached ? '100%' : '100%'
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Export Options */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Export Options</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={exportToExcel} 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </button>
              <button 
                onClick={exportToCSV} 
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </button>
              <button 
                onClick={exportToPDF} 
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to PDF
              </button>
              <button 
                onClick={printReport} 
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerTrendsReportPage;
