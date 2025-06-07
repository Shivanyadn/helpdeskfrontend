'use client';

import React, { useState, useEffect } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Package, Filter, Search, RefreshCw, Laptop, Monitor, Key, Headphones } from 'lucide-react';
import Link from 'next/link';
// Remove the import for getAuthToken since it's not exported
// import { getAuthToken } from '@/api/asset';

// Define the structure of an attachment
interface Attachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

// Define interface for asset request data
interface AssetRequest {
  _id: {
    $oid: string;
  };
  userId: {
    $oid: string;
  } | null;
  requestType: string;
  justification: string;
  costCenter: string;
  timeline: string;
  attachments: Attachment[]; // Replace `any[]` with `Attachment[]`
  status: string;
  createdAt: {
    $date: string;
  };
  __v: number;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: AssetRequest[];
}

export default function RequestStatusPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to fetch asset requests from API
  const fetchAssetRequests = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      console.log('Auth Token:', authToken); // Debugging line
      console.log('Fetching from URL:', 'https://help.zenapi.co.in/asset_service_requests/api/servicerequest/requests'); // Debugging line
      
      const response = await fetch('https://help.zenapi.co.in/asset_service_requests/api/servicerequest/requests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      console.log('Response Status:', response.status); // Debugging line
      console.log('Response Headers:', response.headers); // Debugging line
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response Text:', errorText); // Debugging line
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setAssetRequests(data.data);
      } else {
        throw new Error('Failed to fetch asset requests');
      }
    } catch (error) {
      console.error('Error fetching asset requests:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch asset requests on component mount
  useEffect(() => {
    fetchAssetRequests();
  }, []);

  const refreshData = () => {
    fetchAssetRequests();
  };

  // Map API asset type to UI asset type
  const mapRequestTypeToAssetType = (requestType: string, justification: string): string => {
    // This is a simple mapping - in a real app, you might want to extract this from the justification
    // or have a more detailed mapping in the API response
    if (requestType === 'New Asset') {
      if (justification.toLowerCase().includes('laptop')) {
        return 'Laptop';
      } else if (justification.toLowerCase().includes('monitor')) {
        return 'Monitor';
      } else {
        return 'Other';
      }
    } else if (requestType === 'Access') {
      return 'VPN';
    } else {
      return 'Other';
    }
  };

  // Get asset type icon
  const getAssetIcon = (type: string) => {
    switch(type) {
      case 'Laptop':
        return <Laptop size={18} className="text-blue-500" />;
      case 'Monitor':
        return <Monitor size={18} className="text-purple-500" />;
      case 'VPN':
        return <Key size={18} className="text-green-500" />;
      case 'Other':
        return <Headphones size={18} className="text-orange-500" />;
      default:
        return <Package size={18} className="text-gray-500" />;
    }
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter requests based on status, type and search query
  const filteredRequests = assetRequests
    .filter(request => statusFilter === 'All' || request.status === statusFilter)
    .filter(request => {
      if (typeFilter === 'All') return true;
      const assetType = mapRequestTypeToAssetType(request.requestType, request.justification);
      return assetType === typeFilter;
    })
    .filter(request => 
      searchQuery === '' || 
      request._id.$oid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.justification.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle size={12} className="mr-1" />
            {status}
          </span>
        );
    }
  };

  // Get priority based on timeline
  const getPriority = (timeline: string): string => {
    if (timeline === 'ASAP') return 'High';
    if (timeline === '1-2 weeks') return 'Medium';
    return 'Low';
  };

  // Get estimated delivery based on status and priority
  const getEstimatedDelivery = (status: string, timeline: string): string => {
    if (status === 'Rejected') return 'N/A';
    if (status === 'Pending') return 'TBD';
    
    // For approved requests, calculate based on timeline
    const priority = getPriority(timeline);
    const today = new Date();
    let deliveryDays = 5; // Default
    
    if (priority === 'High') deliveryDays = 3;
    else if (priority === 'Medium') deliveryDays = 5;
    else deliveryDays = 7;
    
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);
    
    return formatDate(deliveryDate.toISOString());
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} overflow-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Asset Request Status</h1>
              <div className="flex items-center gap-2">
                <Link 
                  href="/dashboard/employee"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Dashboard</span>
                </Link>
                <span className="text-gray-400">|</span>
                <p className="text-gray-600">Track the status of your asset requests</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link 
                href="/asset/employee/request_form"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Package size={16} />
                <span>New Asset Request</span>
              </Link>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="px-4 py-3 flex items-center">
                  <Search size={16} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search by ID, asset type, or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-0 focus:ring-0 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="px-3 py-2 flex items-center">
                  <Filter size={14} className="text-gray-400 mr-1" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-sm border-0 focus:ring-0 py-1 rounded-md"
                  >
                    <option value="All">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="px-3 py-2 flex items-center">
                  <Package size={14} className="text-gray-400 mr-1" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full text-sm border-0 focus:ring-0 py-1 rounded-md"
                  >
                    <option value="All">All Types</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="VPN">VPN</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={refreshData}
                className="bg-white rounded-lg shadow-sm border border-gray-100 px-3 flex items-center justify-center hover:bg-gray-50"
                title="Refresh data"
              >
                <RefreshCw size={16} className={`text-gray-500 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  title="Grid view"
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  </div>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  title="List view"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="w-4 h-1 bg-current rounded-sm"></div>
                    <div className="w-4 h-1 bg-current rounded-sm"></div>
                    <div className="w-4 h-1 bg-current rounded-sm"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading requests...</span>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertCircle size={20} className="text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-red-800 font-medium">Error loading requests</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  <button 
                    onClick={refreshData}
                    className="mt-2 text-sm text-red-800 font-medium flex items-center"
                  >
                    <RefreshCw size={14} className="mr-1" /> Try again
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* No results */}
          {!isLoading && !error && filteredRequests.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No asset requests found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'All' || typeFilter !== 'All' 
                  ? "Try adjusting your filters or search query"
                  : "You haven't made any asset requests yet"}
              </p>
              <Link 
                href="/asset/employee/request_form"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Package size={16} />
                <span>Create New Request</span>
              </Link>
            </div>
          )}
          
          {/* Grid View */}
          {!isLoading && !error && filteredRequests.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => {
                const assetType = mapRequestTypeToAssetType(request.requestType, request.justification);
                const priority = getPriority(request.timeline);
                const estimatedDelivery = getEstimatedDelivery(request.status, request.timeline);
                
                return (
                  <div key={request._id.$oid} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-50 mr-3">
                          {getAssetIcon(assetType)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{assetType}</h3>
                          <p className="text-xs text-gray-500">ID: {request._id.$oid.substring(0, 8)}...</p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Request Date</p>
                        <p className="text-sm font-medium">{formatDate(request.createdAt.$date)}</p>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Justification</p>
                        <p className="text-sm">{request.justification}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Priority</p>
                          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            priority === 'High' ? 'bg-red-100 text-red-800' : 
                            priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {priority}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Est. Delivery</p>
                          <p className="text-sm font-medium">{estimatedDelivery}</p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* List View */}
          {!isLoading && !error && filteredRequests.length > 0 && viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Est. Delivery
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => {
                      const assetType = mapRequestTypeToAssetType(request.requestType, request.justification);
                      const priority = getPriority(request.timeline);
                      const estimatedDelivery = getEstimatedDelivery(request.status, request.timeline);
                      
                      return (
                        <tr key={request._id.$oid} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-1.5 rounded-full bg-blue-50 mr-2">
                                {getAssetIcon(assetType)}
                              </div>
                              <span className="font-medium text-gray-800">{assetType}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request._id.$oid.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(request.createdAt.$date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(request.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              priority === 'High' ? 'bg-red-100 text-red-800' : 
                              priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {priority}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {estimatedDelivery}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              href={`/asset/employee/request_detail/${request._id.$oid}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}