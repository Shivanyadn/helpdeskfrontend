'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from "@/app/sidebar/AdminSidebar";
import { Menu, ArrowUpCircle, Filter, Search, AlertTriangle, Clock, RefreshCw, Calendar, BarChart4 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define Avatar component locally
const Avatar = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return <div className={`inline-flex items-center justify-center rounded-full ${className}`}>{children}</div>;
};

const AvatarFallback = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-full w-full items-center justify-center">{children}</div>;
};

// Define Progress component locally
const Progress = ({ 
  value, 
  className, 
  indicatorClassName 
}: { 
  value: number, 
  className?: string, 
  indicatorClassName?: string 
}) => {
  return (
    <div className={`w-full overflow-hidden rounded-full ${className || 'bg-slate-200'}`}>
      <div 
        className={`h-full ${indicatorClassName || 'bg-blue-500'}`} 
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

interface Ticket {
  id: string;
  subject: string;
  createdBy: string;
  status: string;
  priority?: string;
  escalated?: boolean;
  department?: string;
  createdAt?: string;
  sla?: string;
}

const AdminEscalationPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  // Add missing state variables for success message
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // Add state for client-side rendering
  const [isClient, setIsClient] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    fetchTickets();
  }, []);

  // Add the missing getSlaStatus function
  const getSlaStatus = (sla?: string) => {
    if (!sla) return { progress: 0, status: 'unknown' };
    
    // This is a simplified example - in a real app, you'd calculate based on actual time remaining
    if (sla.includes('1 hour')) return { progress: 85, status: 'critical' };
    if (sla.includes('4 hours')) return { progress: 60, status: 'warning' };
    if (sla.includes('24 hours')) return { progress: 30, status: 'normal' };
    return { progress: 10, status: 'good' };
  };

  const fetchTickets = () => {
    setIsLoading(true);
    // Replace with real API call
    setTimeout(() => {
      const mockTickets: Ticket[] = [
        { 
          id: 'ADM3001', 
          subject: 'Internet down in marketing department', 
          createdBy: 'user6', 
          status: 'Open', 
          priority: 'High',
          department: 'IT Support',
          createdAt: '2023-11-15T10:30:00',
          sla: '4 hours'
        },
        { 
          id: 'ADM3002', 
          subject: 'Security access issue for new employees', 
          createdBy: 'user7', 
          status: 'Pending', 
          priority: 'Medium',
          department: 'Security',
          createdAt: '2023-11-14T14:45:00',
          sla: '24 hours'
        },
        { 
          id: 'ADM3003', 
          subject: 'Email server not responding', 
          createdBy: 'user8', 
          status: 'Open', 
          priority: 'Critical',
          department: 'IT Infrastructure',
          createdAt: '2023-11-15T08:15:00',
          sla: '1 hour'
        },
        { 
          id: 'ADM3004', 
          subject: 'Printer configuration issue', 
          createdBy: 'user9', 
          status: 'In Progress', 
          priority: 'Low',
          department: 'Hardware Support',
          createdAt: '2023-11-13T11:20:00',
          sla: '48 hours'
        },
      ];
      setTickets(mockTickets);
      setIsLoading(false);
    }, 800);
  };

  const handleEscalate = (ticketId: string) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: 'Escalated', escalated: true }
          : ticket
      )
    );

    // Show success message instead of alert
    setSuccessMessage(`Ticket ${ticketId} has been escalated successfully.`);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const refreshData = () => {
    fetchTickets();
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || ticket.priority?.toLowerCase() === filterPriority.toLowerCase();
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority?: string) => {
    switch(priority?.toLowerCase()) {
      case 'critical':
        return <Badge className="bg-red-500">{priority}</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">{priority}</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">{priority}</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">{priority}</Badge>;
      default:
        return <Badge className="bg-gray-500">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string, escalated?: boolean) => {
    if (escalated) return <Badge className="bg-purple-600">Escalated</Badge>;
    
    switch(status.toLowerCase()) {
      case 'open':
        return <Badge className="bg-green-500">Open</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'in progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 overflow-auto ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="p-6">
          {/* Header with gradient background */}
          <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 mb-6 p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button onClick={toggleSidebar} className="md:hidden text-white hover:bg-blue-700/50">
                  <Menu />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Escalation Management</h1>
                  <p className="text-blue-100 mt-1">Monitor and manage ticket escalations</p>
                </div>
              </div>
              <Button 
                onClick={refreshData} 
                className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border-white/20"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Success message */}
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded animate-fade-in-out flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
              <button onClick={() => setShowSuccess(false)} className="text-green-700 hover:text-green-900">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Stats cards with improved design */}
          {isClient && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <BarChart4 className="w-4 h-4 text-blue-500" />
                    Total Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{tickets.length}</div>
                  <p className="text-sm text-gray-500 mt-1">Across all departments</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Pending Escalation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{tickets.filter(t => !t.escalated).length}</div>
                  <p className="text-sm text-gray-500 mt-1">Tickets requiring attention</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    Critical Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">
                    {tickets.filter(t => t.priority?.toLowerCase() === 'critical').length}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Highest priority tickets</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="all" className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList className="bg-slate-100 p-1 rounded-lg">
                <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">All Tickets</TabsTrigger>
                <TabsTrigger value="escalated" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Escalated</TabsTrigger>
                <TabsTrigger value="pending" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-9 w-full md:w-64 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-full md:w-40 border-slate-200">
                      <SelectValue placeholder="Filter Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead className="bg-slate-100 text-left">
                        <tr>
                          <th className="px-4 py-3 font-medium text-slate-600">Ticket ID</th>
                          <th className="px-4 py-3 font-medium text-slate-600">Subject</th>
                          <th className="px-4 py-3 font-medium text-slate-600">Department</th>
                          <th className="px-4 py-3 font-medium text-slate-600">Priority</th>
                          <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                          <th className="px-4 py-3 font-medium text-slate-600">SLA</th>
                          <th className="px-4 py-3 font-medium text-slate-600">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12">
                              <div className="flex flex-col justify-center items-center gap-2">
                                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                                <span className="text-slate-500 mt-2">Loading tickets...</span>
                              </div>
                            </td>
                          </tr>
                        ) : isClient && filteredTickets.length > 0 ? (
                          filteredTickets.map(ticket => (
                            <tr key={ticket.id} className="border-t hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-4 font-medium text-blue-600">{ticket.id}</td>
                              <td className="px-4 py-4">
                                <div className="font-medium">{ticket.subject}</div>
                                <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                  <Avatar className="w-6 h-6 bg-blue-100 text-blue-600">
                                    <AvatarFallback>{getInitials(ticket.createdBy)}</AvatarFallback>
                                  </Avatar>
                                  <span>{ticket.createdBy}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(ticket.createdAt || '').toLocaleDateString()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4">{ticket.department}</td>
                              <td className="px-4 py-4">{getPriorityBadge(ticket.priority)}</td>
                              <td className="px-4 py-4">{getStatusBadge(ticket.status, ticket.escalated)}</td>
                              <td className="px-4 py-4">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="w-32">
                                        <div className="flex items-center gap-1 mb-1">
                                          <Clock className="w-4 h-4 text-slate-500" />
                                          <span>{ticket.sla}</span>
                                        </div>
                                        <Progress 
                                          value={getSlaStatus(ticket.sla).progress} 
                                          className={`h-2 ${
                                            getSlaStatus(ticket.sla).status === 'critical' ? 'bg-slate-200' : 
                                            getSlaStatus(ticket.sla).status === 'warning' ? 'bg-slate-200' : 'bg-slate-200'
                                          }`}
                                          indicatorClassName={`${
                                            getSlaStatus(ticket.sla).status === 'critical' ? 'bg-red-500' : 
                                            getSlaStatus(ticket.sla).status === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                                          }`}
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>SLA: {ticket.sla}</p>
                                      <p className="text-xs">
                                        {getSlaStatus(ticket.sla).status === 'critical' ? 'Urgent attention needed' : 
                                         getSlaStatus(ticket.sla).status === 'warning' ? 'Monitor closely' : 'On track'}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </td>
                              <td className="px-4 py-4">
                                {ticket.escalated ? (
                                  <span className="text-purple-600 font-medium flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    Escalated
                                  </span>
                                ) : (
                                  <Button
                                    onClick={() => handleEscalate(ticket.id)}
                                    className="flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                                  >
                                    <ArrowUpCircle className="w-4 h-4" />
                                    Escalate
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center py-12">
                              <div className="flex flex-col items-center justify-center text-slate-400">
                                <Search className="w-8 h-8 mb-2" />
                                <p>No tickets match your search criteria.</p>
                                <Button 
                                  onClick={() => {
                                    setSearchQuery('');
                                    setFilterPriority('all');
                                  }}
                                  className="mt-2"
                                >
                                  Clear filters
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Apply similar changes to other TabsContent sections */}
            <TabsContent value="escalated" className="m-0">
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-0">
                  <table className="w-full table-auto">
                    <thead className="bg-slate-100 text-left">
                      <tr>
                        <th className="px-4 py-3 font-medium text-slate-600">Ticket ID</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Subject</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Department</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Priority</th>
                        <th className="px-4 py-3 font-medium text-slate-600">SLA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.filter(t => t.escalated).length > 0 ? (
                        filteredTickets.filter(t => t.escalated).map(ticket => (
                          <tr key={ticket.id} className="border-t hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-4 font-medium text-blue-600">{ticket.id}</td>
                            <td className="px-4 py-4">
                              <div className="font-medium">{ticket.subject}</div>
                              <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                <Avatar className="w-6 h-6 bg-blue-100 text-blue-600">
                                  <AvatarFallback>{getInitials(ticket.createdBy)}</AvatarFallback>
                                </Avatar>
                                <span>{ticket.createdBy}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(ticket.createdAt || '').toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">{ticket.department}</td>
                            <td className="px-4 py-4">{getPriorityBadge(ticket.priority)}</td>
                            <td className="px-4 py-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="w-32">
                                      <div className="flex items-center gap-1 mb-1">
                                        <Clock className="w-4 h-4 text-slate-500" />
                                        <span>{ticket.sla}</span>
                                      </div>
                                      <Progress 
                                        value={getSlaStatus(ticket.sla).progress} 
                                        className="h-2 bg-slate-200"
                                        indicatorClassName={`${
                                          getSlaStatus(ticket.sla).status === 'critical' ? 'bg-red-500' : 
                                          getSlaStatus(ticket.sla).status === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                                        }`}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>SLA: {ticket.sla}</p>
                                    <p className="text-xs">
                                      {getSlaStatus(ticket.sla).status === 'critical' ? 'Urgent attention needed' : 
                                       getSlaStatus(ticket.sla).status === 'warning' ? 'Monitor closely' : 'On track'}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <AlertTriangle className="w-8 h-8 mb-2" />
                              <p>No escalated tickets found.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="m-0">
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-0">
                  <table className="w-full table-auto">
                    <thead className="bg-slate-100 text-left">
                      <tr>
                        <th className="px-4 py-3 font-medium text-slate-600">Ticket ID</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Subject</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Department</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Priority</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.filter(t => !t.escalated).length > 0 ? (
                        filteredTickets.filter(t => !t.escalated).map(ticket => (
                          <tr key={ticket.id} className="border-t hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-4 font-medium text-blue-600">{ticket.id}</td>
                            <td className="px-4 py-4">
                              <div className="font-medium">{ticket.subject}</div>
                              <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                <Avatar className="w-6 h-6 bg-blue-100 text-blue-600">
                                  <AvatarFallback>{getInitials(ticket.createdBy)}</AvatarFallback>
                                </Avatar>
                                <span>{ticket.createdBy}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(ticket.createdAt || '').toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">{ticket.department}</td>
                            <td className="px-4 py-4">{getPriorityBadge(ticket.priority)}</td>
                            <td className="px-4 py-4">{getStatusBadge(ticket.status)}</td>
                            <td className="px-4 py-4">
                              <Button
                                onClick={() => handleEscalate(ticket.id)}
                                className="flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                              >
                                <ArrowUpCircle className="w-4 h-4" />
                                Escalate
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <Clock className="w-8 h-8 mb-2" />
                              <p>No pending tickets found.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminEscalationPage;
