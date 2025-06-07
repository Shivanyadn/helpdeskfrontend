'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { Menu, Phone, MessageSquare, Send, Plus, Trash2, Save, Settings, PhoneCall, User, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Enhanced IVR options with more details
const ivrOptions = [
  { 
    id: 1, 
    text: 'Speak to Support', 
    description: 'Connect to a customer support representative',
    icon: <PhoneCall className="w-5 h-5" />,
    responseTime: '< 2 min'
  },
  { 
    id: 2, 
    text: 'Account Management', 
    description: 'Manage your account settings and preferences',
    icon: <User className="w-5 h-5" />,
    responseTime: '< 5 min'
  },
  { 
    id: 3, 
    text: 'Technical Support', 
    description: 'Get help with technical issues and troubleshooting',
    icon: <Settings className="w-5 h-5" />,
    responseTime: '< 10 min'
  },
];

// Define the Message type
interface Message {
  id: number;
  text: string;
  sender: 'admin' | 'support';
  timestamp: string;
}

const AdminIVRPage = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [editingIVR, setEditingIVR] = useState(false);
  const [customIVROptions, setCustomIVROptions] = useState(ivrOptions);
  const [newOption, setNewOption] = useState({ text: '', description: '', responseTime: '< 5 min' });
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsClient(true);
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Define response messages with a number as key
  const responseMessages: { [key: number]: string } = {
    1: 'You are connected to support. How can I assist you today?',
    2: 'You are now in Account Management. What would you like to manage in your account?',
    3: 'You are connected to Technical Support. Please describe the technical issue you are experiencing.',
  };

  const handleOptionSelect = (option: number) => {
    setSelectedOption(option);
    const response = responseMessages[option]; // Access using option as key

    setMessages((prevMessages) => [
      ...prevMessages,
      { 
        id: prevMessages.length + 1, 
        text: response, 
        sender: 'support', // Explicitly set to 'support'
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
    ]);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1, 
        text: message, 
        sender: 'admin', // Explicitly set to 'admin'
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      
      // Simulate response after a delay
      setTimeout(() => {
        const autoResponse: Message = {
          id: messages.length + 2,
          text: "Thank you for your message. Our team will get back to you shortly.",
          sender: 'support', // Explicitly set to 'support'
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, autoResponse]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleAddOption = () => {
    if (newOption.text.trim()) {
      const newId = customIVROptions.length + 1;
      setCustomIVROptions([
        ...customIVROptions,
        {
          id: newId,
          text: newOption.text,
          description: newOption.description || 'No description provided',
          icon: <MessageSquare className="w-5 h-5" />,
          responseTime: newOption.responseTime
        }
      ]);
      
      // Add to response messages
      responseMessages[newId] = `You are connected to ${newOption.text}.`;
      
      // Reset form
      setNewOption({ text: '', description: '', responseTime: '< 5 min' });
    }
  };

  const handleRemoveOption = (id: number) => {
    setCustomIVROptions(customIVROptions.filter(option => option.id !== id));
    // Remove from response messages
    delete responseMessages[id];
  };

  const handleSaveIVRConfig = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setEditingIVR(false);
      setIsSaving(false);
    }, 1000);
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
                onClick={toggleSidebar}
                className="md:hidden text-white hover:bg-indigo-700/50 p-2 rounded-full"
              >
                <Menu />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">IVR & Live Chat</h1>
                <p className="text-indigo-100 mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Manage interactive voice response and chat
                </p>
              </div>
            </div>
            <div>
              <Button
                onClick={() => setEditingIVR(!editingIVR)}
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                {editingIVR ? 'View IVR' : 'Configure IVR'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          <Tabs defaultValue="ivr" className="mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="ivr" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                IVR System
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Live Chat
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ivr">
              {editingIVR ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Configure IVR Options</CardTitle>
                    <CardDescription>
                      Customize the IVR menu options that callers will hear when they contact your support line.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Current IVR Options */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Current IVR Menu Options</h3>
                        <div className="space-y-3">
                          {customIVROptions.map((option) => (
                            <div key={option.id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                                  {option.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{option.text}</p>
                                  <p className="text-sm text-gray-500">{option.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                  {option.responseTime}
                                </Badge>
                                <Button
                                  onClick={() => handleRemoveOption(option.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add New IVR Option */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Add New IVR Option</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="option-name">Option Name</Label>
                              <Input 
                                id="option-name" 
                                placeholder="e.g., Billing Support" 
                                value={newOption.text}
                                onChange={(e) => setNewOption({...newOption, text: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="response-time">Expected Response Time</Label>
                              <Select 
                                value={newOption.responseTime} 
                                onValueChange={(value) => setNewOption({...newOption, responseTime: value})}
                              >
                                <SelectTrigger id="response-time">
                                  <SelectValue placeholder="Select response time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="< 2 min">Less than 2 minutes</SelectItem>
                                  <SelectItem value="< 5 min">Less than 5 minutes</SelectItem>
                                  <SelectItem value="< 10 min">Less than 10 minutes</SelectItem>
                                  <SelectItem value="< 30 min">Less than 30 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="option-description">Description</Label>
                            <Textarea 
                              id="option-description" 
                              placeholder="Describe what this option is for..." 
                              value={newOption.description}
                              onChange={(e) => setNewOption({...newOption, description: e.target.value})}
                              className="resize-none"
                              rows={3}
                            />
                          </div>
                          <Button
                            onClick={handleAddOption}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={!newOption.text.trim()}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add IVR Option
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button
  onClick={() => setEditingIVR(false)}
  className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg"
>
  Cancel
</Button>
                    <Button
                      onClick={handleSaveIVRConfig}
                      disabled={isSaving}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save IVR Configuration
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* IVR Preview */}
                  <div className="md:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>IVR Preview</CardTitle>
                        <CardDescription>
                          Test how your IVR system will work for callers
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
                          <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Phone className="w-8 h-8 text-indigo-600" />
                            </div>
                          </div>
                          <p className="text-center text-indigo-700 font-medium">
                            {selectedOption 
                              ? `Connected to: ${customIVROptions.find(o => o.id === selectedOption)?.text}`
                              : "Welcome to our support system. Please select an option:"}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          {customIVROptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => handleOptionSelect(option.id)}
                              className={`p-3 w-full rounded-lg flex items-center gap-3 transition-colors ${
                                selectedOption === option.id 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                              }`}
                            >
                              <div className={`p-2 rounded-full ${
                                selectedOption === option.id 
                                  ? 'bg-indigo-500 text-white' 
                                  : 'bg-indigo-100 text-indigo-600'
                              }`}>
                                {option.icon}
                              </div>
                              <div className="text-left">
                                <p className="font-medium">{option.text}</p>
                                <p className={`text-xs ${
                                  selectedOption === option.id 
                                    ? 'text-indigo-100' 
                                    : 'text-gray-500'
                                }`}>
                                  {option.description}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* IVR Analytics */}
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>IVR Analytics</CardTitle>
                        <CardDescription>
                          Monitor usage and performance of your IVR system
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <p className="text-sm text-gray-500 mb-1">Total Calls Today</p>
                            <p className="text-2xl font-bold">24</p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                              </svg>
                              12% from yesterday
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <p className="text-sm text-gray-500 mb-1">Avg. Response Time</p>
                            <p className="text-2xl font-bold">3.2 min</p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                              </svg>
                              8% improvement
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <p className="text-sm text-gray-500 mb-1">Call Resolution</p>
                            <p className="text-2xl font-bold">87%</p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                              </svg>
                              5% from last week
                            </p>
                          </div>
                        </div>

                        <h3 className="font-medium mb-3">Option Usage</h3>
                        <div className="space-y-3">
                          {customIVROptions.map((option) => (
                            <div key={option.id} className="bg-white p-3 rounded-lg border border-slate-200">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-600">
                                    {option.icon}
                                  </div>
                                  <span className="font-medium">{option.text}</span>
                                </div>
                                <Badge variant="outline" className="bg-slate-50">
                                  {Math.floor(Math.random() * 10) + 1} calls today
                                </Badge>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full" 
                                  style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="chat">
              {isClient && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Chat Settings */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>Chat Settings</CardTitle>
                      <CardDescription>
                        Configure your live chat preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-response">Auto Response</Label>
                          <p className="text-sm text-slate-500">Send automatic greeting messages</p>
                        </div>
                        <Switch id="auto-response" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="chat-notifications">Notifications</Label>
                          <p className="text-sm text-slate-500">Get notified of new messages</p>
                        </div>
                        <Switch id="chat-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="offline-mode">Offline Mode</Label>
                          <p className="text-sm text-slate-500">Collect messages when offline</p>
                        </div>
                        <Switch id="offline-mode" />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="font-medium mb-3">Chat Hours</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="start-time">Start Time</Label>
                            <Input id="start-time" type="time" defaultValue="09:00" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end-time">End Time</Label>
                            <Input id="end-time" type="time" defaultValue="17:00" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Chat */}
                  <Card className="md:col-span-2 flex flex-col">
                    <CardHeader className="pb-3 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle>Live Chat Simulator</CardTitle>
                            <p className="text-sm text-indigo-600">Customer: John Doe</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Online
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col">
                      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 min-h-[400px]">
                        <div className="space-y-4">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.sender === 'admin' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white border border-slate-200 rounded-bl-none'
                                }`}
                              >
                                <p>{msg.text}</p>
                                <div className={`text-xs mt-1 text-right ${
                                  msg.sender === 'admin' ? 'text-indigo-200' : 'text-slate-400'
                                }`}>
                                  {msg.timestamp}
                                </div>
                              </div>
                            </div>
                          ))}
                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="bg-white border border-slate-200 rounded-lg rounded-bl-none p-3">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                      <div className="p-3 border-t bg-white">
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={message}
                            onChange={handleTyping}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="border-slate-200"
                          />
                          <Button 
                            onClick={handleSendMessage}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminIVRPage;
