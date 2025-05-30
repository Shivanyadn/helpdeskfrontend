// src/admin/knowledge-base-faqs/CreateFAQ.tsx

'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { Menu, HelpCircle, Save, ArrowLeft, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

const CreateFAQ = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');
  const [visibility, setVisibility] = useState('public');
  const [tags, setTags] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateFAQ = async () => {
    if (!question.trim() || !answer.trim()) {
      alert('Please fill in both question and answer fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle creating the FAQ (e.g., send data to API)
      console.log('Creating FAQ', { 
        question, 
        answer, 
        category,
        visibility,
        tags: tags.split(',').map(tag => tag.trim())
      });
      
      // Reset form
      setQuestion('');
      setAnswer('');
      setCategory('general');
      setVisibility('public');
      setTags('');
      
      // Show success message
      alert('FAQ created successfully!');
    } catch (error) {
      console.error('Error creating FAQ:', error);
      alert('Failed to create FAQ. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Create FAQ</h1>
                <p className="text-sm text-gray-500">Add new knowledge base article</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/knowledge_base_faqs/admin" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to FAQs
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    FAQ Content
                  </CardTitle>
                  <CardDescription>
                    Create a new FAQ entry for the knowledge base
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="write" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="write" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Input
                          id="question"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="E.g., How do I reset my password?"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea
                          id="answer"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Provide a detailed answer..."
                          className="min-h-[300px] w-full"
                        />
                        <p className="text-xs text-gray-500">
                          You can use markdown formatting for rich text.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="preview" className="space-y-4">
                      {question ? (
                        <div className="border rounded-lg p-4 bg-white">
                          <h3 className="text-lg font-semibold mb-2">{question}</h3>
                          <div className="prose max-w-none">
                            {answer ? (
                              <p className="whitespace-pre-wrap">{answer}</p>
                            ) : (
                              <p className="text-gray-400 italic">No answer provided yet</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>Enter a question and answer to see the preview</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" onClick={() => {
                    setQuestion('');
                    setAnswer('');
                  }}>
                    Clear
                  </Button>
                  <Button 
                    onClick={handleCreateFAQ} 
                    disabled={isSubmitting || !question.trim() || !answer.trim()}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create FAQ
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>FAQ Settings</CardTitle>
                  <CardDescription>
                    Configure additional settings for this FAQ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="account">Account Management</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select value={visibility} onValueChange={setVisibility}>
                      <SelectTrigger id="visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="internal">Internal Only</SelectItem>
                        <SelectItem value="restricted">Restricted Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
                      placeholder="E.g., password, reset, account"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Separate tags with commas
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                        <HelpCircle className="h-3 w-3 text-blue-600" />
                      </div>
                      <span>Use clear, concise questions that users might search for</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                        <HelpCircle className="h-3 w-3 text-blue-600" />
                      </div>
                      <span>Provide detailed answers with step-by-step instructions when applicable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                        <HelpCircle className="h-3 w-3 text-blue-600" />
                      </div>
                      <span>Add relevant tags to improve searchability</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFAQ;
