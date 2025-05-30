// src/components/AssetRequestForm.tsx

'use client';

import React, { useState } from 'react';
import EmployeeSidebar from '@/app/sidebar/EmployeeSidebar';
import { ArrowLeft, Package, CheckCircle, Laptop, Monitor, Key, HelpCircle, Calendar, Clock, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { submitAssetRequest, getUserId } from '@/api/asset';

// Define possible asset types
type AssetType = 'Laptop' | 'Monitor' | 'VPN' | 'Other';

// Define API request types
type ApiRequestType = 'New Asset' | 'Repair' | 'Access';

// Define priority levels
type PriorityLevel = 'Low' | 'Medium' | 'High';

export default function AssetRequestFormPage() {
  const [assetType, setAssetType] = useState<AssetType>('Laptop'); // Changed default to 'Laptop'
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [reason, setReason] = useState('');
  const [requestStatus, setRequestStatus] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Get user ID from local storage
      const userId = getUserId();
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Map UI asset type to API expected values
      let apiRequestType: ApiRequestType; // Use the ApiRequestType type
      switch(assetType) {
        case 'Laptop':
        case 'Monitor':
        case 'Other':
          apiRequestType = 'New Asset';
          break;
        case 'VPN':
          apiRequestType = 'Access';
          break;
        default:
          apiRequestType = 'New Asset';
      }

      // Prepare request payload
      const requestPayload = {
        userId: userId,
        requestType: apiRequestType,
        justification: reason,
        costCenter: "IT",
        timeline: priority === 'High' ? 'ASAP' : priority === 'Medium' ? '1-2 weeks' : '2-4 weeks',
        attachments: []
      };

      // Submit the request
      const response = await submitAssetRequest(requestPayload);
      
      // Handle successful response
      setRequestId(response.data.requestId);
      setRequestStatus('Your asset request has been submitted successfully!');
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting asset request:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Get icon based on asset type
  const getAssetIcon = (type: AssetType) => {
    switch(type) {
      case 'Laptop': return <Laptop size={20} />;
      case 'Monitor': return <Monitor size={20} />;
      case 'VPN': return <Key size={20} />;
      case 'Other': return <HelpCircle size={20} />;
      default: return <Package size={20} />;
    }
  };

  // Get color based on priority
  const getPriorityColor = (level: PriorityLevel) => {
    switch(level) {
      case 'High': return 'bg-red-50 border-red-200 text-red-700';
      case 'Medium': return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'Low': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} overflow-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Request Asset</h1>
            <div className="flex items-center gap-2">
              <Link 
                href="/dashboard/employee"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Back to Dashboard</span>
              </Link>
              <span className="text-gray-400">|</span>
              <p className="text-gray-600">Submit a request for new equipment or resources</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          {!formSubmitted && (
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <span className="font-medium">1</span>
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">Asset Details</span>
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-200' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <span className="font-medium">2</span>
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">Request Details</span>
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-blue-200' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <span className="font-medium">3</span>
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">Review & Submit</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message display */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <div className="flex items-start">
                <AlertTriangle size={18} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
          
          {formSubmitted ? (
            // Success screen
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center">
                <CheckCircle size={18} className="text-green-600 mr-2" />
                <h2 className="font-semibold text-gray-800">Request Submitted</h2>
              </div>
              
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Request Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Your asset request has been submitted and is now pending approval. You will be notified once it's processed.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto mb-6 border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Request ID:</span>
                    <span className="font-medium text-gray-800">{requestId}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Asset Type:</span>
                    <span className="font-medium text-gray-800">{assetType}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Priority:</span>
                    <span className="font-medium text-gray-800">{priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submission Date:</span>
                    <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/asset/employee/request_status"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Package size={16} />
                    <span>View All Requests</span>
                  </Link>
                  <Link 
                    href="/dashboard/employee"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Package size={18} className="text-blue-600 mr-2" />
                      <h2 className="font-semibold text-gray-800">
                        {currentStep === 1 && "Select Asset Type"}
                        {currentStep === 2 && "Request Details"}
                        {currentStep === 3 && "Review Request"}
                      </h2>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>Est. processing time: 2-3 days</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {currentStep === 1 && (
                        <div className="space-y-5">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 block">
                              Select Asset Type
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {(['Laptop', 'Monitor', 'VPN', 'Other'] as AssetType[]).map((type) => (
                                <div 
                                  key={type}
                                  onClick={() => setAssetType(type)}
                                  className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                                    assetType === type 
                                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                                  }`}
                                >
                                  <div className={`mb-3 p-2 rounded-full ${assetType === type ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    {getAssetIcon(type)}
                                  </div>
                                  <span className="font-medium">{type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 block">
                              Select Priority
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                              {(['Low', 'Medium', 'High'] as PriorityLevel[]).map((level) => (
                                <div 
                                  key={level}
                                  onClick={() => setPriority(level)}
                                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                                    priority === level 
                                      ? `border-${level === 'High' ? 'red' : level === 'Medium' ? 'orange' : 'blue'}-500 ${getPriorityColor(level)} shadow-sm` 
                                      : 'border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <span className="font-medium">{level}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Select priority based on urgency. High priority requests require justification.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {currentStep === 2 && (
                        <div className="space-y-5">
                          <div className="space-y-3">
                            <label htmlFor="reason" className="text-sm font-medium text-gray-700 block">
                              Reason for Request <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="reason"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              placeholder="Please explain why you need this asset"
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
                              required
                            ></textarea>
                          </div>

                          <div className="space-y-3">
                            <label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700 block">
                              Additional Notes (Optional)
                            </label>
                            <textarea
                              id="additionalNotes"
                              value={additionalNotes}
                              onChange={(e) => setAdditionalNotes(e.target.value)}
                              placeholder="Any specific requirements or additional information"
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
                            ></textarea>
                          </div>
                          
                          {priority === 'High' && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                              <AlertTriangle size={18} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-red-700 font-medium">High Priority Request</p>
                                <p className="text-xs text-red-600 mt-1">
                                  High priority requests require manager approval and detailed justification. 
                                  Please ensure you've provided a clear reason for the urgency.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {currentStep === 3 && (
                        <div className="space-y-5">
                          <h3 className="font-medium text-gray-800">Review Your Request</h3>
                          
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Asset Type</p>
                                <div className="flex items-center">
                                  {getAssetIcon(assetType)}
                                  <span className="ml-2 font-medium text-gray-800">{assetType}</span>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Priority</p>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  priority === 'High' ? 'bg-red-100 text-red-800' : 
                                  priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {priority}
                                </div>
                              </div>
                              
                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-500 mb-1">Reason for Request</p>
                                <p className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">
                                  {reason || "No reason provided"}
                                </p>
                              </div>
                              
                              {additionalNotes && (
                                <div className="md:col-span-2">
                                  <p className="text-sm text-gray-500 mb-1">Additional Notes</p>
                                  <p className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">
                                    {additionalNotes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                            <Info size={18} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-700">
                              By submitting this request, you confirm that the information provided is accurate and the asset is required for your work.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-3 flex justify-between">
                        {currentStep > 1 ? (
                          <button
                            type="button"
                            onClick={prevStep}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Back
                          </button>
                        ) : (
                          <div></div>
                        )}
                        
                        {currentStep < 3 ? (
                          <button
                            type="button"
                            onClick={nextStep}
                            disabled={currentStep === 2 && !reason}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            Next
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-70"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <span>Submit Request</span>
                            )}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
              {/* Sidebar with Help */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 sticky top-6">
                  <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="font-semibold text-gray-800">Request Information</h2>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    {currentStep === 1 && (
                      <>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <h3 className="font-medium text-blue-800 mb-2">About Asset Types</h3>
                          <ul className="text-sm text-blue-700 space-y-2">
                            <li className="flex items-start">
                              <Laptop size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                              <span><strong>Laptop:</strong> Standard or specialized laptop for work purposes</span>
                            </li>
                            <li className="flex items-start">
                              <Monitor size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                              <span><strong>Monitor:</strong> Additional display for your workstation</span>
                            </li>
                            <li className="flex items-start">
                              <Key size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                              <span><strong>VPN:</strong> Virtual Private Network access for remote work</span>
                            </li>
                            <li className="flex items-start">
                              <HelpCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                              <span><strong>Other:</strong> Any other equipment not listed above</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">Priority Levels</h3>
                          <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-start">
                              <span className="w-3 h-3 rounded-full bg-red-500 mr-2 mt-1.5 flex-shrink-0"></span>
                              <span><strong>High:</strong> Urgent need, work blocked without it</span>
                            </li>
                            <li className="flex items-start">
                              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2 mt-1.5 flex-shrink-0"></span>
                              <span><strong>Medium:</strong> Important but not blocking work</span>
                            </li>
                            <li className="flex items-start">
                              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2 mt-1.5 flex-shrink-0"></span>
                              <span><strong>Low:</strong> Nice to have, not urgent</span>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                    
                    {currentStep === 2 && (
                      <>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <h3 className="font-medium text-blue-800 mb-2">Tips for Request Details</h3>
                          <ul className="text-sm text-blue-700 space-y-2">
                            <li className="flex items-start">
                              <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                              <span>Be specific about why you need the asset</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                              <span>Mention any specific requirements or specifications</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                              <span>Include any relevant project or department information</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">Processing Timeline</h3>
                          <div className="text-sm text-gray-600 space-y-3">
                            <div className="flex items-start">
                              <Calendar size={16} className="mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                              <div>
                                <p className="font-medium">Review Period</p>
                                <p>1-2 business days</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Clock size={16} className="mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                              <div>
                                <p className="font-medium">Delivery (if approved)</p>
                                <p>3-5 business days after approval</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {currentStep === 3 && (
                      <>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <h3 className="font-medium text-blue-800 mb-2">What Happens Next?</h3>
                          <ol className="text-sm text-blue-700 space-y-2 list-decimal pl-4">
                            <li>Your request will be reviewed by the IT department</li>
                            <li>You'll receive an email notification about approval</li>
                            <li>If approved, the asset will be prepared for delivery</li>
                            <li>You'll be notified when the asset is ready</li>
                          </ol>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">Need Help?</h3>
                          <p className="text-sm text-gray-600">
                            If you have questions about asset requests, please contact the IT support team.
                          </p>
                          <a href="mailto:it-support@company.com" className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block">
                            it-support@company.com
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}