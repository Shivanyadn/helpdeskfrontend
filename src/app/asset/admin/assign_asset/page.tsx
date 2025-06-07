// src/admin/asset-management/AssignAsset.tsx

'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { 
  Menu, 
  Search, 
  Plus, 
  Laptop, 
  Package, 
  FileText, 
  Calendar, 
  Filter, 
  Download, 
  Trash2, 
  CheckCircle2,
  Edit // Add missing Edit icon import
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Let's create the Avatar components directly since the import is missing
const Avatar = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return <div className={`relative inline-block ${className}`}>{children}</div>;
};

const AvatarFallback = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return <div className={`flex items-center justify-center rounded-full w-full h-full ${className}`}>{children}</div>;
};

interface Employee {
  id: number;
  name: string;
  department?: string;
  email?: string;
  avatar?: string;
}

interface Asset {
  id: number;
  name: string;
  type: string;
  status?: string;
  serialNumber?: string;
  purchaseDate?: string;
}

interface AssignedAsset {
  id?: number;
  employeeId: number;
  assetId: number;
  assignedAt: string;
  notes?: string;
  status?: 'active' | 'returned' | 'damaged';
}

const AssignAsset = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assignedAssets, setAssignedAssets] = useState<AssignedAsset[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [assignedAt, setAssignedAt] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Placeholder for fetching employees and assets (link API later)
  useEffect(() => {
    setEmployees([
      { id: 1, name: 'John Doe', department: 'Engineering', email: 'john.doe@company.com', avatar: '/avatars/john.png' },
      { id: 2, name: 'Jane Smith', department: 'Marketing', email: 'jane.smith@company.com', avatar: '/avatars/jane.png' },
      { id: 3, name: 'Robert Johnson', department: 'Finance', email: 'robert.johnson@company.com', avatar: '/avatars/robert.png' },
      { id: 4, name: 'Emily Davis', department: 'HR', email: 'emily.davis@company.com', avatar: '/avatars/emily.png' },
      { id: 5, name: 'Michael Wilson', department: 'IT', email: 'michael.wilson@company.com', avatar: '/avatars/michael.png' },
    ]);

    setAssets([
      { id: 1, name: 'MacBook Pro', type: 'Hardware', status: 'Available', serialNumber: 'MBP2023001', purchaseDate: '2023-01-15' },
      { id: 2, name: 'VPN Access', type: 'Software', status: 'Available', serialNumber: 'VPN2023045', purchaseDate: '2023-02-10' },
      { id: 3, name: 'Dell Monitor', type: 'Hardware', status: 'Available', serialNumber: 'DM2023078', purchaseDate: '2023-03-05' },
      { id: 4, name: 'Office Suite', type: 'Software', status: 'Available', serialNumber: 'OS2023112', purchaseDate: '2023-01-20' },
      { id: 5, name: 'iPhone 13', type: 'Hardware', status: 'Available', serialNumber: 'IP2023089', purchaseDate: '2023-04-12' },
    ]);

    // Sample assigned assets
    setAssignedAssets([
      { 
        id: 1,
        employeeId: 1, 
        assetId: 1, 
        assignedAt: '2023-05-10', 
        notes: 'New hire equipment', 
        status: 'active' 
      },
      { 
        id: 2,
        employeeId: 2, 
        assetId: 4, 
        assignedAt: '2023-04-15', 
        notes: 'Annual license renewal', 
        status: 'active' 
      },
    ]);
  }, []);

  // Handle assigning asset to employee
  const handleAssignAsset = () => {
    if (selectedEmployee !== null && selectedAsset !== null) {
      setIsAssigning(true);
      
      // Simulate API call
      setTimeout(() => {
        const newAssignment: AssignedAsset = {
          id: assignedAssets.length + 1,
          employeeId: selectedEmployee,
          assetId: selectedAsset,
          assignedAt: assignedAt || new Date().toISOString().split('T')[0],
          notes: notes,
          status: 'active'
        };
        
        setAssignedAssets([...assignedAssets, newAssignment]);
        
        // Update asset status
        setAssets(assets.map(asset => 
          asset.id === selectedAsset 
            ? { ...asset, status: 'Assigned' } 
            : asset
        ));
        
        // Reset form
        setSelectedEmployee(null);
        setSelectedAsset(null);
        setAssignedAt('');
        setNotes('');
        setIsAssigning(false);
      }, 800);
    }
  };

  // Filter assets by type
  const filteredAssets = assets.filter(asset => {
    if (filterType === 'all') return true;
    return asset.type.toLowerCase() === filterType.toLowerCase();
  });

  // Search functionality
  const filteredAssignments = assignedAssets.filter(assignment => {
    const employee = employees.find(emp => emp.id === assignment.employeeId);
    const asset = assets.find(a => a.id === assignment.assetId);
    
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      employee?.name.toLowerCase().includes(searchLower) ||
      asset?.name.toLowerCase().includes(searchLower) ||
      asset?.serialNumber?.toLowerCase().includes(searchLower)
    );
  });

  // Get asset icon based on type
  const getAssetIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'hardware':
        return <Laptop className="h-5 w-5" />;
      case 'software':
        return <FileText className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 overflow-auto ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
                onClick={toggleSidebar}
              >
                <Menu />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Asset Assignment</h1>
                <p className="text-blue-100 mt-1">Manage and track your organization&apos;s assets</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="bg-white/10 text-white hover:bg-white/20 border-white/20 px-4 py-2 rounded-md"
                onClick={() => {
                  alert('Export functionality will be implemented here');
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          <Tabs defaultValue="assign" className="mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="assign" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Assign Assets
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Manage Assignments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assign">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Employee Selection */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Select Employee</CardTitle>
                    <CardDescription>Choose an employee to assign assets to</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Search employees..."
                        className="pl-8"
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {employees.map((employee) => (
                        <div
                          key={employee.id}
                          onClick={() => setSelectedEmployee(employee.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
                            selectedEmployee === employee.id 
                              ? 'bg-blue-50 border-blue-200 border' 
                              : 'bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                          }`}
                        >
                          <Avatar className="h-10 w-10">
    
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-gray-500">{employee.department}</p>
                          </div>
                          {selectedEmployee === employee.id && (
                            <CheckCircle2 className="h-5 w-5 text-blue-600 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Asset Selection and Assignment Form */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Assign Asset</CardTitle>
                    <CardDescription>
                      Select an asset and assign it to {selectedEmployee 
                        ? employees.find(e => e.id === selectedEmployee)?.name 
                        : "the selected employee"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Asset Type Filter */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Filter by type:</Label>
                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            variant={filterType === 'all' ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => setFilterType('all')}
                          >
                            All
                          </Badge>
                          <Badge 
                            variant={filterType === 'hardware' ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => setFilterType('hardware')}
                          >
                            <Laptop className="h-3 w-3 mr-1" />
                            Hardware
                          </Badge>
                          <Badge 
                            variant={filterType === 'software' ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => setFilterType('software')}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Software
                          </Badge>
                        </div>
                      </div>

                      {/* Asset Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="asset">Select Asset</Label>
                        <Select
                          value={selectedAsset?.toString() || ''}
                          onValueChange={(value) => setSelectedAsset(Number(value))}
                          disabled={!selectedEmployee}
                        >
                          <SelectTrigger id="asset" className="w-full">
                            <SelectValue placeholder="--Select Asset--" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredAssets
                              .filter(asset => asset.status === 'Available')
                              .map((asset) => (
                                <SelectItem key={asset.id} value={asset.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    {getAssetIcon(asset.type)}
                                    <span>{asset.name}</span>
                                    <span className="text-xs text-gray-500 ml-1">({asset.serialNumber})</span>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Asset Details (if selected) */}
                      {selectedAsset && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h3 className="font-medium mb-2">Asset Details</h3>
                          {(() => {
                            const asset = assets.find(a => a.id === selectedAsset);
                            return asset ? (
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Name</p>
                                  <p className="font-medium">{asset.name}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Type</p>
                                  <p className="font-medium">{asset.type}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Serial Number</p>
                                  <p className="font-medium">{asset.serialNumber}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Purchase Date</p>
                                  <p className="font-medium">{asset.purchaseDate}</p>
                                </div>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}

                      {/* Assignment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="assignedAt">Assignment Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="date"
                              id="assignedAt"
                              value={assignedAt}
                              onChange={(e) => setAssignedAt(e.target.value)}
                              className="pl-8"
                              disabled={!selectedEmployee || !selectedAsset}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any additional information about this assignment..."
                          className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={!selectedEmployee || !selectedAsset}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3 border-t pt-4">
                    <Button
                      className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
                      onClick={() => {
                        setSelectedEmployee(null);
                        setSelectedAsset(null);
                        setAssignedAt('');
                        setNotes('');
                      }}
                      disabled={!selectedEmployee && !selectedAsset}
                    >
                      Clear
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                      onClick={handleAssignAsset}
                      disabled={!selectedEmployee || !selectedAsset || isAssigning}
                    >
                      {isAssigning ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Assigning...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Assign Asset
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Assigned Assets</CardTitle>
                      <CardDescription>View and manage all asset assignments</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="text"
                          placeholder="Search assignments..."
                          className="pl-8 w-[250px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button
                        className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-blue-600"
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredAssignments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Employee</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Asset</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Serial Number</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Assigned Date</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAssignments.map((assignment) => {
                            const employee = employees.find((emp) => emp.id === assignment.employeeId);
                            const asset = assets.find((a) => a.id === assignment.assetId);
                            return (
                              <tr key={assignment.id} className="border-b hover:bg-slate-50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      
                                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                        {employee?.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{employee?.name}</p>
                                      <p className="text-xs text-gray-500">{employee?.department}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-1 rounded-full text-blue-600">
                                      {getAssetIcon(asset?.type || '')}
                                    </div>
                                    <span>{asset?.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600">{asset?.serialNumber}</td>
                                <td className="py-3 px-4 text-gray-600">
                                  {new Date(assignment.assignedAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      assignment.status === 'active' 
                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                        : assignment.status === 'returned'
                                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                                          : 'bg-red-50 text-red-700 border-red-200'
                                    }
                                  >
                                    {assignment.status === 'active' ? 'Active' : 
                                     assignment.status === 'returned' ? 'Returned' : 'Damaged'}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No assets assigned</h3>
                      <p className="text-gray-500">
                        {searchTerm 
                          ? "No assignments match your search criteria" 
                          : "Start by assigning assets to employees"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AssignAsset;
