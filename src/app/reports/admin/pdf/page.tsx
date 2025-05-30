'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { 
  Menu, 
  Download, 
  FileText, 
  Filter, 
  Calendar, 
  BarChart4, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  FileUp,
  Settings,
  Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const PdfReportPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>("last30days");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sample data for different reports
  const reportTypes = [
    { 
      id: 'tickets', 
      name: 'Tickets Report', 
      description: 'All ticket data including status, priority, and resolution times',
      icon: <AlertCircle className="h-5 w-5" />,
      count: 156,
      lastGenerated: '2 days ago'
    },
    { 
      id: 'users', 
      name: 'Users Activity', 
      description: 'User login activity, ticket creation, and response metrics',
      icon: <Users className="h-5 w-5" />,
      count: 42,
      lastGenerated: '1 week ago'
    },
    { 
      id: 'performance', 
      name: 'Performance Metrics', 
      description: 'Response times, resolution rates, and SLA compliance',
      icon: <BarChart4 className="h-5 w-5" />,
      count: 87,
      lastGenerated: 'Yesterday'
    }
  ];

  const ticketsData = [
    { ticketId: '#12345', status: 'Resolved', priority: 'High', created: '2025-04-01', resolved: '2025-04-02', agent: 'John Doe', category: 'Technical' },
    { ticketId: '#12346', status: 'Open', priority: 'Medium', created: '2025-04-02', resolved: '', agent: 'Jane Smith', category: 'Billing' },
    { ticketId: '#12347', status: 'Resolved', priority: 'Low', created: '2025-04-03', resolved: '2025-04-04', agent: 'Mike Johnson', category: 'Account' },
    { ticketId: '#12348', status: 'In Progress', priority: 'High', created: '2025-04-04', resolved: '', agent: 'Sarah Williams', category: 'Technical' },
    { ticketId: '#12349', status: 'Closed', priority: 'Medium', created: '2025-04-05', resolved: '2025-04-07', agent: 'John Doe', category: 'Network' },
  ];

  const filterOptions = [
    { id: 'status', name: 'Status' },
    { id: 'priority', name: 'Priority' },
    { id: 'category', name: 'Category' },
    { id: 'agent', name: 'Agent' }
  ];

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Add header with logo and title
      doc.setFillColor(41, 98, 255);
      doc.rect(0, 0, 210, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Helpdesk Management System', 105, 12, { align: 'center' });
      
      // Add report title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(20);
      doc.text(selectedReport ? `${reportTypes.find(r => r.id === selectedReport)?.name}` : 'Tickets Report', 105, 30, { align: 'center' });
      
      // Add date range
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Date Range: ${dateRange === 'last30days' ? 'Last 30 Days' : dateRange}`, 105, 38, { align: 'center' });
      
      // Add generated date
      const today = new Date();
      doc.text(`Generated on: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`, 105, 43, { align: 'center' });
      
      // Add table header
      doc.setFillColor(240, 240, 240);
      doc.rect(15, 50, 180, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('Ticket ID', 20, 56);
      doc.text('Status', 55, 56);
      doc.text('Priority', 85, 56);
      doc.text('Created', 115, 56);
      doc.text('Resolved', 145, 56);
      doc.text('Agent', 175, 56);
      
      // Add table data
      let yPosition = 65;
      doc.setFont('helvetica', 'normal');
      
      ticketsData.forEach((ticket, index) => {
        // Add alternating row background
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, yPosition - 5, 180, 10, 'F');
        }
        
        doc.text(ticket.ticketId, 20, yPosition);
        
        // Status with color
        if (ticket.status === 'Resolved') {
          doc.setTextColor(0, 128, 0); // Green
        } else if (ticket.status === 'Open') {
          doc.setTextColor(0, 0, 255); // Blue
        } else if (ticket.status === 'In Progress') {
          doc.setTextColor(255, 165, 0); // Orange
        } else {
          doc.setTextColor(100, 100, 100); // Gray
        }
        doc.text(ticket.status, 55, yPosition);
        doc.setTextColor(0, 0, 0); // Reset color
        
        // Priority with color
        if (ticket.priority === 'High') {
          doc.setTextColor(255, 0, 0); // Red
        } else if (ticket.priority === 'Medium') {
          doc.setTextColor(255, 165, 0); // Orange
        } else {
          doc.setTextColor(0, 128, 0); // Green
        }
        doc.text(ticket.priority, 85, yPosition);
        doc.setTextColor(0, 0, 0); // Reset color
        
        doc.text(ticket.created, 115, yPosition);
        doc.text(ticket.resolved || 'Not resolved', 145, yPosition);
        doc.text(ticket.agent, 175, yPosition);
        
        yPosition += 10;
      });
      
      // Add footer
      // Using type assertion to fix TypeScript error with getNumberOfPages
      const pageCount = (doc.internal as any).getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount} - Confidential Document - Helpdesk Management System`, 105, 290, { align: 'center' });
      }
      
      doc.save(`${selectedReport || 'tickets'}-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      setIsGenerating(false);
    }, 1500);
  };

  const toggleFilter = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      setSelectedFilters(selectedFilters.filter(id => id !== filterId));
    } else {
      setSelectedFilters([...selectedFilters, filterId]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 overflow-auto ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="md:hidden text-white hover:bg-indigo-700/50"
              >
                <Menu />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">PDF Reports</h1>
                <p className="text-indigo-100 mt-1 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate professional PDF reports for analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          <Tabs defaultValue="generate" className="mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Reports
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Report History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Report Selection */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Select Report Type</CardTitle>
                    <CardDescription>Choose the type of report to generate</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {reportTypes.map((report) => (
                        <div
                          key={report.id}
                          onClick={() => setSelectedReport(report.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors flex items-start gap-3 ${
                            selectedReport === report.id 
                              ? 'bg-indigo-50 border-indigo-200 border' 
                              : 'bg-white border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                          }`}
                        >
                          <div className={`p-2 rounded-full ${
                            selectedReport === report.id 
                              ? 'bg-indigo-100 text-indigo-600' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {report.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="font-medium">{report.name}</p>
                              {selectedReport === report.id && (
                                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                {report.count} records
                              </Badge>
                              <span className="text-xs text-gray-500">Last generated: {report.lastGenerated}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Report Configuration */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Configure Report</CardTitle>
                    <CardDescription>
                      Customize the {selectedReport 
                        ? reportTypes.find(r => r.id === selectedReport)?.name.toLowerCase() 
                        : "report"} with filters and date ranges
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Date Range Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="date-range">Date Range</Label>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <Select
                            value={dateRange}
                            onValueChange={setDateRange}
                          >
                            <SelectTrigger id="date-range" className="w-full">
                              <SelectValue placeholder="Select date range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="yesterday">Yesterday</SelectItem>
                              <SelectItem value="last7days">Last 7 days</SelectItem>
                              <SelectItem value="last30days">Last 30 days</SelectItem>
                              <SelectItem value="thisMonth">This month</SelectItem>
                              <SelectItem value="lastMonth">Last month</SelectItem>
                              <SelectItem value="custom">Custom range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {dateRange === 'custom' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input type="date" id="start-date" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end-date">End Date</Label>
                            <Input type="date" id="end-date" />
                          </div>
                        </div>
                      )}

                      {/* Filters */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Apply Filters
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {filterOptions.map(filter => (
                            <Badge 
                              key={filter.id}
                              variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                              className={`cursor-pointer ${
                                selectedFilters.includes(filter.id) 
                                  ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' 
                                  : 'hover:bg-slate-100'
                              }`}
                              onClick={() => toggleFilter(filter.id)}
                            >
                              {filter.name}
                              {selectedFilters.includes(filter.id) && (
                                <span className="ml-1">×</span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Selected Filters */}
                      {selectedFilters.length > 0 && (
                        <div className="space-y-4 pt-2">
                          {selectedFilters.includes('status') && (
                            <div className="space-y-2">
                              <Label htmlFor="status-filter">Status</Label>
                              <Select defaultValue="all">
                                <SelectTrigger id="status-filter">
                                  <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All statuses</SelectItem>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {selectedFilters.includes('priority') && (
                            <div className="space-y-2">
                              <Label htmlFor="priority-filter">Priority</Label>
                              <Select defaultValue="all">
                                <SelectTrigger id="priority-filter">
                                  <SelectValue placeholder="All priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All priorities</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {selectedFilters.includes('category') && (
                            <div className="space-y-2">
                              <Label htmlFor="category-filter">Category</Label>
                              <Select defaultValue="all">
                                <SelectTrigger id="category-filter">
                                  <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All categories</SelectItem>
                                  <SelectItem value="technical">Technical</SelectItem>
                                  <SelectItem value="billing">Billing</SelectItem>
                                  <SelectItem value="account">Account</SelectItem>
                                  <SelectItem value="network">Network</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {selectedFilters.includes('agent') && (
                            <div className="space-y-2">
                              <Label htmlFor="agent-filter">Agent</Label>
                              <Select defaultValue="all">
                                <SelectTrigger id="agent-filter">
                                  <SelectValue placeholder="All agents" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All agents</SelectItem>
                                  <SelectItem value="john-doe">John Doe</SelectItem>
                                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                                  <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      )}

                      {/* PDF Options */}
                      <div className="space-y-2 pt-2 border-t border-gray-200">
                        <Label className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          PDF Options
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div className="space-y-2">
                            <Label htmlFor="orientation">Page Orientation</Label>
                            <Select defaultValue="portrait">
                              <SelectTrigger id="orientation">
                                <SelectValue placeholder="Select orientation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="portrait">Portrait</SelectItem>
                                <SelectItem value="landscape">Landscape</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paper-size">Paper Size</Label>
                            <Select defaultValue="a4">
                              <SelectTrigger id="paper-size">
                                <SelectValue placeholder="Select paper size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="a4">A4</SelectItem>
                                <SelectItem value="letter">Letter</SelectItem>
                                <SelectItem value="legal">Legal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Preview Button */}
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          <Eye className="h-4 w-4" />
                          {showPreview ? "Hide Preview" : "Show Preview"}
                        </Button>
                      </div>

                      {/* Preview */}
                      {showPreview && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-indigo-600 text-white p-4 text-center">
                            <h3 className="font-bold">Helpdesk Management System</h3>
                          </div>
                          <div className="p-4 text-center">
                            <h2 className="text-xl font-bold">
                              {selectedReport 
                                ? reportTypes.find(r => r.id === selectedReport)?.name 
                                : "Tickets Report"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                              Date Range: {dateRange === 'last30days' ? 'Last 30 Days' : dateRange}
                            </p>
                            <p className="text-sm text-gray-500">
                              Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="p-4">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="p-2 text-left">Ticket ID</th>
                                  <th className="p-2 text-left">Status</th>
                                  <th className="p-2 text-left">Priority</th>
                                  <th className="p-2 text-left">Created</th>
                                  <th className="p-2 text-left">Resolved</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ticketsData.slice(0, 3).map((ticket, index) => (
                                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                    <td className="p-2">{ticket.ticketId}</td>
                                    <td className="p-2">
                                      <span className={
                                        ticket.status === 'Resolved' 
                                          ? 'text-green-600' 
                                          : ticket.status === 'Open'
                                            ? 'text-blue-600'
                                            : ticket.status === 'In Progress'
                                              ? 'text-amber-600'
                                              : 'text-gray-600'
                                      }>
                                        {ticket.status}
                                      </span>
                                    </td>
                                    <td className="p-2">
                                      <span className={
                                        ticket.priority === 'High' 
                                          ? 'text-red-600' 
                                          : ticket.priority === 'Medium'
                                            ? 'text-amber-600'
                                            : 'text-green-600'
                                      }>
                                        {ticket.priority}
                                      </span>
                                    </td>
                                    <td className="p-2">{ticket.created}</td>
                                    <td className="p-2">{ticket.resolved || 'Not resolved'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {ticketsData.length > 3 && (
                              <p className="text-xs text-center text-gray-500 mt-2">
                                Preview showing 3 of {ticketsData.length} records
                              </p>
                            )}
                          </div>
                          <div className="border-t border-gray-200 p-2 text-center">
                            <p className="text-xs text-gray-500">
                              Page 1 of 1 - Confidential Document - Helpdesk Management System
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3 border-t pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedReport(null);
                        setDateRange("last30days");
                        setSelectedFilters([]);
                        setShowPreview(false);
                      }}
                      disabled={!selectedReport}
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={handleDownloadPdf}
                      disabled={!selectedReport || isGenerating}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF Report
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>Previously generated reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Report Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Generated On</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Generated By</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Records</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportTypes.map((report, index) => (
                          <tr key={index} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-600">
                                  {report.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{report.name}</p>
                                  <p className="text-xs text-gray-500">Date range: Last 30 days</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </td>
                            <td className="py-3 px-4 text-gray-600">Admin User</td>
                            <td className="py-3 px-4 text-gray-600">{report.count}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                >
                                  <Download className="h-3.5 w-3.5 mr-1" />
                                  Download
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-indigo-600"
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" />
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PdfReportPage;
