'use client';

import { useState } from 'react';
import AdminSidebar from "@/app/sidebar/AdminSidebar";
import { Menu, Plus, Filter, AlertTriangle, Trash2, Edit, ChevronDown, Save, X, ArrowUp, ArrowDown, Info, Check, MoreHorizontal, Zap, Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface Rule {
  id: number;
  name: string;
  condition: string;
  action: string;
  active: boolean;
  createdAt?: string;
}

const AdminRulesAutomationPage = () => {
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, name: 'High Priority Routing', condition: 'Priority is High', action: 'Assign to Agent A', active: true, createdAt: '2023-11-15' },
    { id: 2, name: 'VPN Request', condition: 'Subject contains VPN', action: 'Assign to IT Team', active: true, createdAt: '2023-11-20' },
    { id: 3, name: 'Password Reset', condition: 'Subject contains Password Reset', action: 'Auto-reply with reset instructions', active: false, createdAt: '2023-12-01' },
  ]);

  const [newRule, setNewRule] = useState({ name: '', condition: '', action: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [conditionType, setConditionType] = useState('contains');
  const [actionType, setActionType] = useState('assign');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.condition || !newRule.action) return;

    setRules((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newRule,
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewRule({ name: '', condition: '', action: '' });
    setShowForm(false);
  };

  const handleDeleteRule = (id: number) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleActive = (id: number) => {
    setRules((prev) => 
      prev.map((rule) => 
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      condition: rule.condition,
      action: rule.action
    });
    setShowForm(true);
  };

  const handleSaveEdit = () => {
    if (!editingRule) return;
    
    setRules((prev) => 
      prev.map((rule) => 
        rule.id === editingRule.id 
          ? { ...rule, name: newRule.name, condition: newRule.condition, action: newRule.action } 
          : rule
      )
    );
    
    setEditingRule(null);
    setNewRule({ name: '', condition: '', action: '' });
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setNewRule({ name: '', condition: '', action: '' });
    setShowForm(false);
  };

  const moveRuleUp = (id: number) => {
    setRules(prev => {
      const index = prev.findIndex(rule => rule.id === id);
      if (index <= 0) return prev;
      
      const newRules = [...prev];
      const temp = newRules[index];
      newRules[index] = newRules[index - 1];
      newRules[index - 1] = temp;
      
      return newRules;
    });
  };

  const moveRuleDown = (id: number) => {
    setRules(prev => {
      const index = prev.findIndex(rule => rule.id === id);
      if (index >= prev.length - 1) return prev;
      
      const newRules = [...prev];
      const temp = newRules[index];
      newRules[index] = newRules[index + 1];
      newRules[index + 1] = temp;
      
      return newRules;
    });
  };

  const duplicateRule = (rule: Rule) => {
    setRules(prev => [
      ...prev,
      {
        ...rule,
        id: Math.max(...prev.map(r => r.id)) + 1,
        name: `${rule.name} (Copy)`,
        createdAt: new Date().toISOString().split('T')[0],
      }
    ]);
  };

  // New function to handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter rules based on active tab and search term
  const filteredRules = rules
    .filter(rule => {
      if (activeTab === 'active') return rule.active;
      if (activeTab === 'inactive') return !rule.active;
      return true;
    })
    .filter(rule => {
      if (!searchTerm) return true;
      return (
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'} overflow-auto`}>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Rules & Automation
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                setEditingRule(null);
                setNewRule({ name: '', condition: '', action: '' });
                setShowForm(!showForm);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Rule</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Introduction Card - Redesigned with better visual hierarchy */}
          <Card className="mb-8 overflow-hidden border-none shadow-md">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Ticket Automation Rules</h2>
                  <p className="mt-2 text-white/90 max-w-3xl">
                    Create rules to automatically route, assign, and process tickets based on conditions.
                    Rules are processed in order from top to bottom, with higher rules taking precedence.
                  </p>
                </div>
              </div>
            </div>
           </Card> 
           

          {/* Search and Filter Controls */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="all" className="px-4">All Rules</TabsTrigger>
                <TabsTrigger value="active" className="px-4">Active</TabsTrigger>
                <TabsTrigger value="inactive" className="px-4">Disabled</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search rules..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Rule Creation Form - Enhanced with better visual design */}
          <AnimatePresence>
            {showForm && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {editingRule ? (
                      <>
                        <Edit className="h-5 w-5 text-blue-600" />
                        Edit Rule
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 text-blue-600" />
                        Create New Rule
                      </>
                    )}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                    <input
                      placeholder="E.g., High Priority Support Tickets"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        When this condition is met
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 inline text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Define when this rule should be triggered</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <div className="space-y-3">
                        <select 
                          className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={conditionType}
                          onChange={(e) => setConditionType(e.target.value)}
                        >
                          <option value="contains">Subject contains</option>
                          <option value="equals">Subject equals</option>
                          <option value="priority">Priority is</option>
                          <option value="department">Department is</option>
                          <option value="category">Category is</option>
                          <option value="customer">Customer email contains</option>
                        </select>
                        <input
                          placeholder="Condition value"
                          value={newRule.condition}
                          onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                          className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        Perform this action
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 inline text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Define what happens when the condition is met</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <div className="space-y-3">
                        <select 
                          className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={actionType}
                          onChange={(e) => setActionType(e.target.value)}
                        >
                          <option value="assign">Assign to</option>
                          <option value="priority">Set priority to</option>
                          <option value="status">Set status to</option>
                          <option value="reply">Auto-reply with</option>
                          <option value="tag">Add tag</option>
                          <option value="department">Move to department</option>
                        </select>
                        <input
                          placeholder="Action value"
                          value={newRule.action}
                          onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                          className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="border-gray-300 text-gray-700 px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={editingRule ? handleSaveEdit : handleAddRule}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2"
                    disabled={!newRule.name || !newRule.condition || !newRule.action}
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingRule ? 'Save Changes' : 'Create Rule'}</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rules List - Redesigned with better visual hierarchy and information display */}
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
            <CardHeader className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base font-semibold text-gray-700">Automation Rules</CardTitle>
              </div>
              <CardDescription className="text-sm text-gray-500 m-0">
                {filteredRules.length} rule{filteredRules.length !== 1 ? 's' : ''} displayed
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              {filteredRules.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredRules.map((rule, index) => (
                    <motion.li 
                      key={rule.id} 
                      className={`p-5 transition-colors hover:bg-gray-50 ${!rule.active ? 'bg-gray-50/50' : ''}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <Switch 
                              checked={rule.active} 
                              onCheckedChange={() => handleToggleActive(rule.id)}
                              className="data-[state=checked]:bg-green-600"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              {rule.name}
                              {!rule.active && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-600 text-xs">
                                  Disabled
                                </Badge>
                              )}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Created: {rule.createdAt || 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto">
                          <div className="flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => moveRuleUp(rule.id)}
                                    disabled={index === 0}
                                    className="text-gray-500 hover:text-gray-700 h-8 w-8"
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Move up</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => moveRuleDown(rule.id)}
                                    disabled={index === filteredRules.length - 1}
                                    className="text-gray-500 hover:text-gray-700 h-8 w-8"
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Move down</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit rule
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => duplicateRule(rule)}>
                                <Plus className="h-4 w-4 mr-2" /> Duplicate rule
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleActive(rule.id)}>
                                {rule.active ? (
                                  <><EyeOff className="h-4 w-4 mr-2" /> Disable rule</>
                                ) : (
                                  <><Eye className="h-4 w-4 mr-2" /> Enable rule</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteRule(rule.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete rule
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase font-medium mb-1">Condition</span>
                            <div className="flex items-center">
                              <Badge variant="secondary" className="font-normal bg-blue-50 text-blue-700 border-blue-200">
                                {rule.condition}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase font-medium mb-1">Action</span>
                            <div className="flex items-center">
                              <Badge variant="secondary" className="font-normal bg-purple-50 text-purple-700 border-purple-200">
                                {rule.action}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="py-16 text-center flex flex-col items-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">No rules found</p>
                  <p className="text-sm max-w-md mx-auto mt-2 text-gray-500">
                    {activeTab === 'all' 
                      ? searchTerm 
                        ? `No rules match "${searchTerm}". Try a different search term.` 
                        : 'Create your first rule to automate ticket handling.' 
                      : activeTab === 'active' 
                        ? 'No active rules found. Enable a rule or create a new one.' 
                        : 'No disabled rules found.'}
                  </p>
                  {(activeTab !== 'all' || searchTerm) && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setActiveTab('all');
                        setSearchTerm('');
                      }} 
                      className="mt-4"
                    >
                      View all rules
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
            
            {filteredRules.length > 0 && (
              <CardFooter className="bg-gray-50 border-t border-gray-200 p-4 text-sm text-gray-500">
                Rules are processed in order from top to bottom. Use the arrow buttons to change priority.
              </CardFooter>
            )}
          </Card>

          {/* Help Section - Redesigned with better visual hierarchy */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2 border-b border-blue-100/50">
              <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Tips for Creating Effective Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <ChevronDown className="h-4 w-4 text-blue-600" />
                    </div>
                    Rule Priority
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Rules are processed in order from top to bottom. More specific rules should be placed first to ensure they're applied before more general rules.
                  </p>
                </div>
                
                <div className="bg-white/60 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <ChevronDown className="h-4 w-4 text-blue-600" />
                    </div>
                    Specific Conditions
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Use specific conditions to avoid unintended automation. Test your rules with sample tickets before enabling them in production.
                  </p>
                </div>
                
                <div className="bg-white/60 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <ChevronDown className="h-4 w-4 text-blue-600" />
                    </div>
                    Testing Rules
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Create a test ticket to verify your rule works as expected. You can temporarily disable rules that aren't working correctly while you troubleshoot them.
                  </p>
                </div>
                
                <div className="bg-white/60 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <ChevronDown className="h-4 w-4 text-blue-600" />
                    </div>
                    Rule Organization
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Use the reordering buttons to prioritize your most important rules. Consider creating rule groups for different departments or ticket types.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 bg-blue-100/50 p-3 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-700 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  <strong>Important:</strong> Changes to automation rules take effect immediately. Make sure to review your rules carefully before enabling them.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Advanced Settings Card */}
          <Card className="mt-8 border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Advanced Settings
              </CardTitle>
              <CardDescription>
                Configure additional options for the automation system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Pause All Automation</h4>
                    <p className="text-xs text-gray-500">Temporarily disable all rules without changing their individual status</p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Notification on Rule Execution</h4>
                    <p className="text-xs text-gray-500">Receive notifications when rules are triggered</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Rule Execution Logs</h4>
                    <p className="text-xs text-gray-500">Keep detailed logs of all rule executions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button variant="outline" size="sm" className="text-sm">
                View Automation Logs
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminRulesAutomationPage;
