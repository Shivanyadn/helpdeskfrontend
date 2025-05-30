'use client';

import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ManagerSidebar from '@/app/sidebar/ManagerSidebar';
import { FileText, Download, Filter, Printer, Calendar, Clock, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const initialData = [
  { ticketId: '12345', sla: '24 hours', resolutionTime: '20 hours', status: 'Resolved', priority: 'High', category: 'Technical', date: '2023-05-15' },
  { ticketId: '12346', sla: '24 hours', resolutionTime: '30 hours', status: 'Overdue', priority: 'Medium', category: 'Billing', date: '2023-05-16' },
  { ticketId: '12347', sla: '24 hours', resolutionTime: '18 hours', status: 'Resolved', priority: 'Low', category: 'Account', date: '2023-05-17' },
  { ticketId: '12348', sla: '48 hours', resolutionTime: '36 hours', status: 'Resolved', priority: 'Medium', category: 'Technical', date: '2023-05-18' },
  { ticketId: '12349', sla: '12 hours', resolutionTime: '15 hours', status: 'Overdue', priority: 'High', category: 'Security', date: '2023-05-19' },
  { ticketId: '12350', sla: '24 hours', resolutionTime: '22 hours', status: 'Resolved', priority: 'Low', category: 'General', date: '2023-05-20' },
];

const ManagerSlaMetricsPage = () => {
  const [data, setData] = useState(initialData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('last7days');
  const [activeTab, setActiveTab] = useState('table');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Calculate metrics
  const totalTickets = data.length;
  const resolvedTickets = data.filter(item => item.status === 'Resolved').length;
  const overdueTickets = data.filter(item => item.status === 'Overdue').length;
  const complianceRate = Math.round((resolvedTickets / totalTickets) * 100);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SLA Metrics');
    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelFile]), 'sla_metrics_report.xlsx');
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'sla_metrics_report.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('SLA Metrics Report', 14, 16);
    
    // Add header row
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Ticket ID', 14, 25);
    doc.text('SLA', 50, 25);
    doc.text('Resolution Time', 80, 25);
    doc.text('Status', 130, 25);
    doc.text('Priority', 160, 25);
    
    // Add data rows
    doc.setFont('helvetica', 'normal');
    filteredData.forEach((item, index) => {
      const y = 35 + index * 10;
      doc.text(item.ticketId, 14, y);
      doc.text(item.sla, 50, y);
      doc.text(item.resolutionTime, 80, y);
      doc.text(item.status, 130, y);
      doc.text(item.priority, 160, y);
    });
    
    doc.save('sla_metrics_report.pdf');
  };

  const filteredData = data.filter(item => {
    const matchesStatus = filterStatus ? item.status.toLowerCase() === filterStatus.toLowerCase() : true;
    const matchesPriority = filterPriority ? item.priority.toLowerCase() === filterPriority.toLowerCase() : true;
    const matchesCategory = filterCategory ? item.category.toLowerCase() === filterCategory.toLowerCase() : true;
    const matchesSearch = searchQuery ? 
      item.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

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
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SLA Metrics Report</h1>
                <p className="text-gray-600">Monitor service level agreement compliance</p>
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
                    <h3 className="text-2xl font-bold text-gray-800">{resolvedTickets}</h3>
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
                    <h3 className="text-2xl font-bold text-gray-800">{overdueTickets}</h3>
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
                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="">All Statuses</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                      
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="">All Categories</option>
                        <option value="Technical">Technical</option>
                        <option value="Billing">Billing</option>
                        <option value="Account">Account</option>
                        <option value="Security">Security</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Table */}
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full border-collapse text-left">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">SLA</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Time</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredData.length > 0 ? (
                          filteredData.map((item, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.ticketId}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.sla}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.resolutionTime}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.status === 'Resolved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.priority === 'High' 
                                    ? 'bg-red-100 text-red-800' 
                                    : item.priority === 'Medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {item.priority}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                              No matching records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">SLA Compliance Summary</h3>
                    <p className="text-blue-700 mb-2">
                      Out of {totalTickets} tickets, {resolvedTickets} were resolved within SLA ({complianceRate}% compliance rate).
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
                      <h3 className="font-medium text-gray-800 mb-3">Resolution by Priority</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">High Priority</span>
                            <span className="text-sm font-medium text-gray-700">
                              {data.filter(item => item.priority === 'High' && item.status === 'Resolved').length} / 
                              {data.filter(item => item.priority === 'High').length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ 
                                width: `${(data.filter(item => item.priority === 'High' && item.status === 'Resolved').length / 
                                  Math.max(1, data.filter(item => item.priority === 'High').length)) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Medium Priority</span>
                            <span className="text-sm font-medium text-gray-700">
                              {data.filter(item => item.priority === 'Medium' && item.status === 'Resolved').length} / 
                              {data.filter(item => item.priority === 'Medium').length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{ 
                                width: `${(data.filter(item => item.priority === 'Medium' && item.status === 'Resolved').length / 
                                  Math.max(1, data.filter(item => item.priority === 'Medium').length)) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Low Priority</span>
                            <span className="text-sm font-medium text-gray-700">
                              {data.filter(item => item.priority === 'Low' && item.status === 'Resolved').length} / 
                              {data.filter(item => item.priority === 'Low').length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ 
                                width: `${(data.filter(item => item.priority === 'Low' && item.status === 'Resolved').length / 
                                  Math.max(1, data.filter(item => item.priority === 'Low').length)) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h3 className="font-medium text-gray-800 mb-3">Resolution by Category</h3>
                      <div className="space-y-3">
                        {['Technical', 'Billing', 'Account', 'Security', 'General'].map(category => {
                          const categoryTotal = data.filter(item => item.category === category).length;
                          if (categoryTotal === 0) return null;
                          
                          const resolvedCount = data.filter(item => 
                            item.category === category && item.status === 'Resolved'
                          ).length;
                          const percentage = (resolvedCount / categoryTotal) * 100;
                          
                          return (
                            <div key={category}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{category}</span>
                                <span className="text-sm font-medium text-gray-700">
                                  {resolvedCount} / {categoryTotal}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
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

export default ManagerSlaMetricsPage;
