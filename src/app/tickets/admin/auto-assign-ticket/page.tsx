'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from "@/app/sidebar/AdminSidebar";
import { Menu, RefreshCw, CheckCircle, AlertCircle, Filter, Download, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface Ticket {
  id: string;
  subject: string;
  createdBy: string;
  status: string;
  assignedTo?: string;
  priority?: 'Low' | 'Medium' | 'High';
  createdAt?: string;
}

const agents = ['Agent A', 'Agent B', 'Agent C']; // Ideally fetched from API

const AdminAutoAssignTicketPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAssigned, setLastAssigned] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const autoAssignTickets = (unassigned: Ticket[]) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let assignedTickets: Ticket[] = [];
      let agentIndex = 0;

      assignedTickets = unassigned.map((ticket) => {
        const assignedAgent = agents[agentIndex];
        agentIndex = (agentIndex + 1) % agents.length;

        // TODO: Backend API call to assign ticket
        console.log(`Auto-assigned Ticket ${ticket.id} to ${assignedAgent}`);

        return {
          ...ticket,
          assignedTo: assignedAgent,
          status: 'Assigned',
          createdAt: new Date().toISOString(),
        };
      });

      setTickets(assignedTickets);
      setLastAssigned(new Date().toLocaleString());
      setIsLoading(false);
    }, 800);
  };

  const handleManualRefresh = () => {
    // Replace with real API call to get unassigned tickets
    const mockUnassignedTickets: Ticket[] = [
      { id: 'ADM2003', subject: 'Printer not working', createdBy: 'user3', status: 'Open', priority: 'Medium' },
      { id: 'ADM2004', subject: 'Email sync issue', createdBy: 'user4', status: 'Open', priority: 'High' },
      { id: 'ADM2005', subject: 'WiFi not working', createdBy: 'user5', status: 'Open', priority: 'Low' },
      { id: 'ADM2006', subject: 'Software installation request', createdBy: 'user6', status: 'Open', priority: 'Medium' },
    ];

    autoAssignTickets(mockUnassignedTickets);
  };

  useEffect(() => {
    // Replace with real API call
    const mockUnassignedTickets: Ticket[] = [
      { id: 'ADM2003', subject: 'Printer not working', createdBy: 'user3', status: 'Open', priority: 'Medium' },
      { id: 'ADM2004', subject: 'Email sync issue', createdBy: 'user4', status: 'Open', priority: 'High' },
      { id: 'ADM2005', subject: 'WiFi not working', createdBy: 'user5', status: 'Open', priority: 'Low' },
    ];

    autoAssignTickets(mockUnassignedTickets);
  }, []);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="p-8 h-full">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar} 
                  className="md:hidden"
                >
                  <Menu />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Auto Assigned Tickets</h1>
                  <p className="text-slate-500 mt-1">Manage and monitor ticket assignments</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {lastAssigned && (
                  <span className="text-sm text-slate-500 whitespace-nowrap">
                    Last assigned: {lastAssigned}
                  </span>
                )}
                <Button 
                  onClick={handleManualRefresh} 
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Assigning...' : 'Refresh & Assign'}
                </Button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Total Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">{tickets.length}</div>
                  <p className="text-xs text-slate-500 mt-1">Across all categories</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Assigned Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">{agents.length}</div>
                  <p className="text-xs text-slate-500 mt-1">Active support staff</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">High Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">
                    {tickets.filter(t => t.priority === 'High').length}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Require immediate attention</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Assignment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                    <span className="text-lg font-medium text-slate-800">
                      {isLoading ? 'In Progress' : 'Complete'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Auto-assignment process</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Tickets Section */}
            <div className="flex-1">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="all">All Tickets</TabsTrigger>
                    <TabsTrigger value="high">High Priority</TabsTrigger>
                    <TabsTrigger value="medium">Medium Priority</TabsTrigger>
                    <TabsTrigger value="low">Low Priority</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Input
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white"
                      />
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Sort by Date</DropdownMenuItem>
                        <DropdownMenuItem>Sort by Priority</DropdownMenuItem>
                        <DropdownMenuItem>Filter by Agent</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  <Card className="border-none shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-100 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              <th className="px-6 py-4">Ticket ID</th>
                              <th className="px-6 py-4">Subject</th>
                              <th className="px-6 py-4">Created By</th>
                              <th className="px-6 py-4">Priority</th>
                              <th className="px-6 py-4">Assigned To</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                              Array(3).fill(0).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                  <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                                  <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-40"></div></td>
                                  <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                  <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                                  <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                  <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                                  <td className="px-6 py-5 text-right"><div className="h-4 bg-slate-200 rounded w-8 ml-auto"></div></td>
                                </tr>
                              ))
                            ) : filteredTickets.length > 0 ? (
                              filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-5 whitespace-nowrap font-medium text-slate-800">{ticket.id}</td>
                                  <td className="px-6 py-5 text-slate-700">{ticket.subject}</td>
                                  <td className="px-6 py-5 text-slate-600">{ticket.createdBy}</td>
                                  <td className="px-6 py-5">
                                    <Badge variant="outline" className={`${getPriorityColor(ticket.priority)}`}>
                                      {ticket.priority || 'Normal'}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-2">
                                        {ticket.assignedTo?.charAt(0) || '?'}
                                      </div>
                                      <span className="text-slate-700">{ticket.assignedTo || 'Unassigned'}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <Badge variant="outline" className={ticket.status === 'Assigned' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100'}>
                                      {ticket.status}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-5 text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Reassign</DropdownMenuItem>
                                        <DropdownMenuItem>Change Priority</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-10 text-slate-500">
                                  {searchQuery ? 'No tickets match your search criteria.' : 'No tickets to auto-assign. Click refresh to check for new tickets.'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="high" className="mt-0">
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-100 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              <th className="px-6 py-4">Ticket ID</th>
                              <th className="px-6 py-4">Subject</th>
                              <th className="px-6 py-4">Created By</th>
                              <th className="px-6 py-4">Assigned To</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {filteredTickets.filter(t => t.priority === 'High').length > 0 ? (
                              filteredTickets.filter(t => t.priority === 'High').map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-5 whitespace-nowrap font-medium text-slate-800">{ticket.id}</td>
                                  <td className="px-6 py-5 text-slate-700">{ticket.subject}</td>
                                  <td className="px-6 py-5 text-slate-600">{ticket.createdBy}</td>
                                  <td className="px-6 py-5">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-2">
                                        {ticket.assignedTo?.charAt(0) || '?'}
                                      </div>
                                      <span className="text-slate-700">{ticket.assignedTo || 'Unassigned'}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <Badge variant="outline" className={ticket.status === 'Assigned' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100'}>
                                      {ticket.status}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-5 text-right">
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-500">
                                  No high priority tickets found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="medium" className="mt-0">
                  {/* Similar structure as high priority tab */}
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-100 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              <th className="px-6 py-4">Ticket ID</th>
                              <th className="px-6 py-4">Subject</th>
                              <th className="px-6 py-4">Created By</th>
                              <th className="px-6 py-4">Assigned To</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {filteredTickets.filter(t => t.priority === 'Medium').length > 0 ? (
                              filteredTickets.filter(t => t.priority === 'Medium').map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-5 whitespace-nowrap font-medium text-slate-800">{ticket.id}</td>
                                  <td className="px-6 py-5 text-slate-700">{ticket.subject}</td>
                                  <td className="px-6 py-5 text-slate-600">{ticket.createdBy}</td>
                                  <td className="px-6 py-5">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-2">
                                        {ticket.assignedTo?.charAt(0) || '?'}
                                      </div>
                                      <span className="text-slate-700">{ticket.assignedTo || 'Unassigned'}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <Badge variant="outline" className={ticket.status === 'Assigned' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100'}>
                                      {ticket.status}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-5 text-right">
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-500">
                                  No medium priority tickets found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="low" className="mt-0">
                  {/* Similar structure as high priority tab */}
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-100 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              <th className="px-6 py-4">Ticket ID</th>
                              <th className="px-6 py-4">Subject</th>
                              <th className="px-6 py-4">Created By</th>
                              <th className="px-6 py-4">Assigned To</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {filteredTickets.filter(t => t.priority === 'Low').length > 0 ? (
                              filteredTickets.filter(t => t.priority === 'Low').map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-5 whitespace-nowrap font-medium text-slate-800">{ticket.id}</td>
                                  <td className="px-6 py-5 text-slate-700">{ticket.subject}</td>
                                  <td className="px-6 py-5 text-slate-600">{ticket.createdBy}</td>
                                  <td className="px-6 py-5">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-2">
                                        {ticket.assignedTo?.charAt(0) || '?'}
                                      </div>
                                      <span className="text-slate-700">{ticket.assignedTo || 'Unassigned'}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <Badge variant="outline" className={ticket.status === 'Assigned' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100'}>
                                      {ticket.status}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-5 text-right">
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-500">
                                  No low priority tickets found.
                                </td>
                              </tr>
                            )}
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
      </div>
    </div>
  );
};

export default AdminAutoAssignTicketPage;
