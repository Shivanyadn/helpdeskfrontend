'use client';

import { useState } from 'react';
import AdminSidebar from "@/app/sidebar/AdminSidebar";
import { Menu, Plus, Filter, AlertTriangle, Trash2, Edit, ChevronDown, ArrowUp, ArrowDown, Info, MoreHorizontal, Zap, Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion} from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRule, setEditingRule] = useState<Rule | null>(null); // Added this line

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
    setShowForm(true);
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

  // Define filteredRules based on activeTab and searchTerm
  const filteredRules = rules.filter((rule) => {
    if (activeTab === 'active' && !rule.active) return false;
    if (activeTab === 'inactive' && rule.active) return false;
    if (searchTerm && !rule.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'} overflow-auto`}>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={toggleSidebar} 
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Rules &amp; Automation
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                setEditingRule(null);
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
          {/* Rules List */}
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
                  {filteredRules.map((rule: Rule, index) => (
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
                              <Button className="h-8 w-8">
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
                    Rules are processed in order from top to bottom. More specific rules should be placed first to ensure they&apos;re applied before more general rules.
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
                    Create a test ticket to verify your rule works as expected. You can temporarily disable rules that aren&apos;t working correctly while you troubleshoot them.
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
              <Button className="text-sm">
                View Automation Logs
              </Button>
            </CardFooter>
          </Card>

          {/* Rule Form - Shown when creating or editing a rule */}
          {showForm && (
            <div className="mt-8">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">
                    {editingRule ? `Edit Rule: ${editingRule.name}` : 'Create New Rule'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rule Name
                      </label>
                      <input
                        type="text"
                        value={editingRule?.name || ''}
                        onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value } as Rule)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                        placeholder="Enter rule name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition
                      </label>
                      <input
                        type="text"
                        value={editingRule?.condition || ''}
                        onChange={(e) => setEditingRule({ ...editingRule, condition: e.target.value } as Rule)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                        placeholder="Enter condition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Action
                      </label>
                      <input
                        type="text"
                        value={editingRule?.action || ''}
                        onChange={(e) => setEditingRule({ ...editingRule, action: e.target.value } as Rule)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                        placeholder="Enter action"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={editingRule?.active} 
                        onCheckedChange={() => setEditingRule({ ...editingRule, active: !editingRule?.active } as Rule)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <span className="text-sm text-gray-500">
                        {editingRule?.active ? 'Rule is active' : 'Rule is inactive'}
                      </span>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                  <Button 
                    onClick={() => setShowForm(false)} 
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      if (editingRule) {
                        setRules((prev) => 
                          prev.map((rule) => rule.id === editingRule.id ? editingRule : rule)
                        );
                      } else {
                        setRules(prev => [
                          ...prev,
                          {
                            id: Math.max(...prev.map(r => r.id)) + 1,
                            name: 'New Rule',
                            condition: 'Enter condition',
                            action: 'Enter action',
                            active: true,
                            createdAt: new Date().toISOString().split('T')[0],
                          }
                        ]);
                      }
                      setShowForm(false);
                    }} 
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRulesAutomationPage;
