'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { 
  Menu, 
  Download, 
  FileSpreadsheet, 
  Filter, 
  Calendar, 
  BarChart4, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const ExcelReportPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>("last30days");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
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
    },
    { 
      id: 'assets', 
      name: 'Asset Inventory', 
      description: 'Complete asset inventory with assignment history',
      icon: <FileSpreadsheet className="h-5 w-5" />,
      count: 213,
      lastGenerated: '3 days ago'
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

  const handleDownload = () => {
    setIsGenerating(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const ws = XLSX.utils.json_to_sheet(ticketsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, selectedReport || 'Report');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, `${selectedReport || 'tickets'}-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      
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
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={toggleSidebar} 
                className="md:hidden text-white hover:bg-emerald-700/50"
              >
                <Menu />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Excel Reports</h1>
                <p className="text-emerald-100 mt-1 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Generate and download data for analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          <Tabs defaultValue="generate" className="mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
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
                              ? 'bg-emerald-50 border-emerald-200 border' 
                              : 'bg-white border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          <div className={`p-2 rounded-full ${
                            selectedReport === report.id 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {report.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="font-medium">{report.name}</p>
                              {selectedReport === report.id && (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
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

                      {/* Preview */}
                      {selectedReport && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">Data Preview</h3>
                            <Badge variant="outline" className="bg-slate-100">
                              {ticketsData.length} records
                            </Badge>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-200">
                                  <th className="text-left py-2 px-2 font-medium text-slate-600">ID</th>
                                  <th className="text-left py-2 px-2 font-medium text-slate-600">Status</th>
                                  <th className="text-left py-2 px-2 font-medium text-slate-600">Priority</th>
                                  <th className="text-left py-2 px-2 font-medium text-slate-600">Created</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ticketsData.slice(0, 3).map((ticket, index) => (
                                  <tr key={index} className="border-b border-slate-200 last:border-0">
                                    <td className="py-2 px-2">{ticket.ticketId}</td>
                                    <td className="py-2 px-2">
                                      <Badge 
                                        variant="outline" 
                                        className={
                                          ticket.status === 'Resolved' 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : ticket.status === 'Open'
                                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                                              : ticket.status === 'In Progress'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-slate-50 text-slate-700 border-slate-200'
                                        }
                                      >
                                        {ticket.status}
                                      </Badge>
                                    </td>
                                    <td className="py-2 px-2">
                                      <Badge 
                                        variant="outline" 
                                        className={
                                          ticket.priority === 'High' 
                                            ? 'bg-red-50 text-red-700 border-red-200' 
                                            : ticket.priority === 'Medium'
                                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                                              : 'bg-green-50 text-green-700 border-green-200'
                                        }
                                      >
                                        {ticket.priority}
                                      </Badge>
                                    </td>
                                    <td className="py-2 px-2">{ticket.created}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {ticketsData.length > 3 && (
                            <p className="text-xs text-center text-slate-500 mt-2">
                              Showing 3 of {ticketsData.length} records
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3 border-t pt-4">
                    <Button 
                      onClick={() => {
                        setSelectedReport(null);
                        setDateRange("last30days");
                        setSelectedFilters([]);
                      }}
                      disabled={!selectedReport}
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={handleDownload}
                      disabled={!selectedReport || isGenerating}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Excel Report
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
                                <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600">
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
                              <Button 
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                              >
                                <Download className="h-3.5 w-3.5 mr-1" />
                                Download
                              </Button>
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

export default ExcelReportPage;
