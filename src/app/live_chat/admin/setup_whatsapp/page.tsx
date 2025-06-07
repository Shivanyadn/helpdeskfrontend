'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { Menu, Send, MessageSquare, Phone, Video, Paperclip,Settings, Check, CheckCheck, User, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Sample response from WhatsApp API (Replace with actual API integration)
const sampleMessages = [
  { id: 1, sender: 'user', message: 'Hi, I need help with my account.', timestamp: '09:32 AM', read: true },
  { id: 2, sender: 'admin', message: 'Hello! How can I assist you today?', timestamp: '09:33 AM', read: true },
  { id: 3, sender: 'user', message: 'I forgot my password.', timestamp: '09:34 AM', read: true },
  { id: 4, sender: 'admin', message: 'No problem. I can help you reset it. Could you please verify your email address?', timestamp: '09:35 AM', read: true },
  { id: 5, sender: 'user', message: 'It\'s user@example.com', timestamp: '09:36 AM', read: true },
];

const AdminWhatsAppChatSetup = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'admin',
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      
      // Simulate user response after a delay
      setTimeout(() => {
        const userResponse = {
          id: messages.length + 2,
          sender: 'user',
          message: 'Thanks for the information!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        setMessages(prev => [...prev, userResponse]);
      }, 3000);
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

  const handleWhatsAppSetup = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsConfigured(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 overflow-auto ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={toggleSidebar} 
                className="md:hidden text-white hover:bg-green-700/50"
              >
                <Menu />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">WhatsApp Integration</h1>
                <p className="text-green-100 mt-1 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Setup and manage WhatsApp business chat
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-white/20 text-white border-white/20 px-3 py-1">
              {isConfigured ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          <Tabs defaultValue="chat" className="mb-6" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Live Chat
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat">
              {activeTab === 'chat' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Contact List */}
                  <Card className="md:col-span-1 border border-slate-200">
                    <CardHeader className="pb-2 border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Contacts</CardTitle>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Online</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="py-2 px-4 border-b bg-slate-50">
                        <Input placeholder="Search contacts..." className="border-slate-200" />
                      </div>
                      <div className="divide-y">
                        <div className="p-3 flex items-center gap-3 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors">
                          <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">John Doe</h4>
                              <span className="text-xs text-slate-500">09:36 AM</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-slate-500 truncate w-36">It user@example.com</p>
                              <Badge className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center p-0">1</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Sarah Smith</h4>
                              <span className="text-xs text-slate-500">Yesterday</span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">Thanks for your help!</p>
                          </div>
                        </div>
                        <div className="p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Mike Johnson</h4>
                              <span className="text-xs text-slate-500">Yesterday</span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">When will my order arrive?</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chat Window */}
                  <Card className="md:col-span-2 border border-slate-200 flex flex-col">
                    <CardHeader className="pb-3 border-b flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">John Doe</CardTitle>
                            <p className="text-sm text-green-600">Online</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button className="rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button className="rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Video className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col">
                      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                        <div className="space-y-4">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.sender === 'admin' 
                                    ? 'bg-green-600 text-white rounded-br-none' 
                                    : 'bg-white border border-slate-200 rounded-bl-none'
                                }`}
                              >
                                <p>{msg.message}</p>
                                <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                                  msg.sender === 'admin' ? 'text-green-100' : 'text-slate-400'
                                }`}>
                                  {msg.timestamp}
                                  {msg.sender === 'admin' && (
                                    msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                                  )}
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
                          <Button className="rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Paperclip className="w-5 h-5" />
                          </Button>
                          <Input
                            type="text"
                            value={message}
                            onChange={handleTyping}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="border-slate-200 focus:border-green-500 focus:ring-green-500"
                          />
                          <Button 
                            onClick={handleSendMessage}
                            className="rounded-full bg-green-600 hover:bg-green-700 h-10 w-10 p-0 flex items-center justify-center"
                          >
                            <Send className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              {activeTab === 'settings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-slate-200">
                    <CardHeader>
                      <CardTitle>WhatsApp Business API Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input 
                          id="api-key" 
                          type="password" 
                          placeholder="Enter your WhatsApp Business API key" 
                          className="border-slate-200"
                          disabled={isConfigured}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone-number">Business Phone Number</Label>
                        <Input 
                          id="phone-number" 
                          placeholder="Enter your business phone number" 
                          className="border-slate-200"
                          disabled={isConfigured}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhook">Webhook URL</Label>
                        <div className="flex">
                          <Input 
                            id="webhook" 
                            value="https://your-domain.com/api/whatsapp/webhook" 
                            className="border-slate-200 rounded-r-none"
                            readOnly
                          />
                          <Button 
                            className="rounded-l-none border-slate-200 border-l-0"
                            onClick={() => {
                              navigator.clipboard.writeText("https://your-domain.com/api/whatsapp/webhook");
                              alert("Webhook URL copied to clipboard!");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                      <Button 
                        onClick={handleWhatsAppSetup}
                        className="w-full bg-green-600 hover:bg-green-700 mt-4"
                        disabled={isLoading || isConfigured}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : isConfigured ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Connected
                          </>
                        ) : (
                          'Connect WhatsApp Business API'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-slate-200">
                    <CardHeader>
                      <CardTitle>Chat Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-reply">Auto Reply</Label>
                          <p className="text-sm text-slate-500">Send automatic responses to new messages</p>
                        </div>
                        <Switch id="auto-reply" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notifications">Notifications</Label>
                          <p className="text-sm text-slate-500">Receive email notifications for new messages</p>
                        </div>
                        <Switch id="notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="business-hours">Business Hours Only</Label>
                          <p className="text-sm text-slate-500">Only show as online during business hours</p>
                        </div>
                        <Switch id="business-hours" />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="font-medium mb-3">Business Hours</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="open-time">Opening Time</Label>
                            <Input id="open-time" type="time" defaultValue="09:00" className="border-slate-200" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="close-time">Closing Time</Label>
                            <Input id="close-time" type="time" defaultValue="17:00" className="border-slate-200" />
                          </div>
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

export default AdminWhatsAppChatSetup;
