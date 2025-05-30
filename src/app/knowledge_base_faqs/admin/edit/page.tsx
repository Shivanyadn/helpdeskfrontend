// src/admin/knowledge-base-faqs/EditFAQ.tsx

'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { Menu, Save, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const EditFAQ = ({ faqId }: { faqId: number }) => {
  const [faq, setFaq] = useState({ question: '', answer: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Fetch the FAQ based on ID (replace with real API call)
    setFaq({ question: 'Sample Question', answer: 'Sample Answer' });
  }, [faqId]);

  const handleEditFAQ = () => {
    // Handle saving the edited FAQ (e.g., send data to API)
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Editing FAQ', faq);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'} overflow-auto`}>
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Knowledge Base Management</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/knowledge_base_faqs/admin">Knowledge Base</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/knowledge_base_faqs/admin">FAQs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>Edit FAQ</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Edit FAQ</h2>
                <p className="text-sm text-slate-500">Update knowledge base article information</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to FAQs
              </Button>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>FAQ Details</CardTitle>
                <CardDescription>Make changes to the FAQ content below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="question" className="text-sm font-medium text-slate-700">Question</label>
                  <Input
                    id="question"
                    value={faq.question}
                    onChange={(e) => setFaq({ ...faq, question: e.target.value })}
                    placeholder="Enter the question"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="answer" className="text-sm font-medium text-slate-700">Answer</label>
                  <Textarea
                    id="answer"
                    value={faq.answer}
                    onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
                    placeholder="Enter the detailed answer"
                    className="min-h-[250px] resize-y"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Cancel</Button>
                <Button 
                  onClick={handleEditFAQ} 
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditFAQ;
