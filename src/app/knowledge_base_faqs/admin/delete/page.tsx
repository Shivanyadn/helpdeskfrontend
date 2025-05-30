// src/admin/knowledge-base-faqs/DeleteFAQ.tsx

'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/app/sidebar/AdminSidebar';
import { Menu, AlertTriangle, ArrowLeft, Trash2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

const DeleteFAQ = ({ faqId }: { faqId: number }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleDeleteFAQ = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle deleting the FAQ (e.g., send request to API)
      console.log('Deleting FAQ', faqId);
      
      // Show confirmation
      setShowConfirmation(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/knowledge_base_faqs/admin');
      }, 2000);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 overflow-auto ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="md:hidden text-white hover:bg-red-700/50"
              >
                <Menu />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Delete FAQ</h1>
                <p className="text-red-100 mt-1">Remove knowledge base article</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to FAQs
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 max-w-4xl mx-auto">
          {showConfirmation ? (
            <Card className="border-green-200 shadow-md bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-green-800">FAQ Deleted Successfully</h2>
                      <p className="text-green-600">You will be redirected to the FAQ management page.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-red-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
                    <p className="text-gray-600 mt-2">
                      You are about to delete FAQ #{faqId}. This action cannot be undone and will permanently remove this knowledge base article.
                    </p>
                    
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                      <h3 className="font-medium text-red-800 flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Important Information
                      </h3>
                      <ul className="mt-2 text-red-700 list-disc list-inside space-y-1">
                        <li>All associated data will be permanently deleted</li>
                        <li>Users will no longer be able to access this FAQ</li>
                        <li>This action cannot be reversed</li>
                      </ul>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="destructive"
                        onClick={handleDeleteFAQ}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Permanently Delete FAQ
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isDeleting}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteFAQ;
