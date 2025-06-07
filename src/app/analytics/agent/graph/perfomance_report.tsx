'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Download, Filter, RefreshCw, Clock, CheckCircle, 
  AlertTriangle, MessageCircle, Star, Award,
  TrendingUp, BarChart
} from 'lucide-react';

interface ResolutionTime {
  resolutionTimeInHours: string;
}

export default function AgentPerformanceReport() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resolvedTickets, setResolvedTickets] = useState(0); // State for resolved tickets
  const [avgResolutionTime, setAvgResolutionTime] = useState(0); // State for average resolution time

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        // Fetch analytics data
        const analyticsResponse = await axios.get('https://help.zenapi.co.in/api/tickets/analytics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (analyticsResponse.data.success) {
          const performance = analyticsResponse.data.performance[0] || {};
          setResolvedTickets(performance.closed || 0); // Update resolved tickets count
        }

        // Fetch resolution times data
        const resolutionResponse = await axios.get('https://help.zenapi.co.in/api/tickets/resolution-times', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resolutionResponse.data.success) {
          const resolutionTimes: ResolutionTime[] = resolutionResponse.data.resolutionTimes || [];
          const totalResolutionTime = resolutionTimes.reduce(
            (sum, item) => sum + parseFloat(item.resolutionTimeInHours),
            0
          );
          const averageTime =
            resolutionTimes.length > 0
              ? parseFloat((totalResolutionTime / resolutionTimes.length).toFixed(2))
              : 0;
          setAvgResolutionTime(averageTime); // Update average resolution time
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        alert('Failed to fetch analytics data. Please try again later.');
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="h-6 w-6 text-blue-600" />
          Agent Performance Report
        </h1>
        
        <div className="flex flex-wrap gap-2">
          <button onClick={refreshData} className="btn-outline">
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'quarter')}
            className="btn-outline"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          
          <button className="btn-outline">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          
          <button className="btn-blue">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Performance Overview */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title">
            Performance Overview
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tickets Resolved */}
          <div className="flex flex-col p-3 border-l-4 border-green-500 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-500">Tickets Resolved</span>
            <div className="flex items-baseline">
              <span className="text-xl font-bold mr-2 text-gray-800">{resolvedTickets}</span>
            </div>
          </div>

          {/* Average Resolution Time */}
          <div className="flex flex-col p-3 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-500">Average Resolution Time</span>
            <div className="flex items-baseline">
              <span className="text-xl font-bold mr-2 text-gray-800">{avgResolutionTime} hrs</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ticket Resolution Metrics & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Resolution Metrics */}
        <div className="card">
          <h2 className="section-title">
            <Clock className="h-5 w-5 text-blue-600" />
            Ticket Resolution Metrics
          </h2>
          
          <div className="space-y-5 mt-4">
            {[
              { label: 'First Response Time', value: '15 min', target: '30 min', diff: '15 min', color: 'blue', width: '85%', status: 'Exceeding' },
              { label: 'Average Resolution Time', value: '1.8 hrs', target: '4 hrs', diff: '2.2 hrs', color: 'green', width: '75%', status: 'Exceeding' },
              { label: 'SLA Compliance Rate', value: '89.6%', target: '95%', diff: '5.4%', color: 'yellow', width: '89.6%', status: 'Below', textColor: 'red' },
              { label: 'One-Touch Resolution Rate', value: '42%', target: '40%', diff: '2%', color: 'purple', width: '42%', status: 'Exceeding' }
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <span className="text-sm font-medium text-gray-800">{metric.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`bg-${metric.color}-600 h-2.5 rounded-full`} style={{ width: metric.width }}></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Target: {metric.target}</span>
                  <span className={`text-xs text-${metric.textColor || 'green'}-600`}>
                    {metric.status} target by {metric.diff}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Ticket Distribution */}
        <div className="card">
          <h2 className="section-title">
            <BarChart className="h-5 w-5 text-blue-600" />
            Ticket Distribution
          </h2>
          
          <div className="space-y-4 mt-4">
            {[
              { label: 'Open Tickets', value: '12', percent: '25%', color: 'blue' },
              { label: 'In Progress', value: '22', percent: '45%', color: 'yellow' },
              { label: 'Resolved', value: '14', percent: '30%', color: 'green' }
            ].map((status, i) => (
              <div key={i} className={`flex justify-between items-center ${i > 0 ? 'border-t border-gray-100 pt-4' : ''}`}>
                <div>
                  <span className="text-sm font-medium text-gray-700">{status.label}</span>
                  <p className="text-xl font-bold text-gray-800">{status.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-${status.color}-100 flex items-center justify-center shadow-sm`}>
                  <span className={`text-${status.color}-600 font-medium`}>{status.percent}</span>
                </div>
              </div>
            ))}
            
            <div className="border-t border-gray-100 pt-4">
              <span className="text-sm font-medium text-gray-700 mb-2 block">Priority Distribution</span>
              <div className="flex gap-2">
                {[
                  { label: 'High', value: '8', color: 'red' },
                  { label: 'Medium', value: '22', color: 'yellow' },
                  { label: 'Low', value: '18', color: 'green' }
                ].map((priority, i) => (
                  <div key={i} className={`flex-1 bg-${priority.color}-100 p-2 rounded-lg text-center shadow-sm`}>
                    <span className={`text-xs text-${priority.color}-600 font-medium`}>{priority.label}</span>
                    <p className={`text-lg font-bold text-${priority.color}-800`}>{priority.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customer Satisfaction & SLA Breaches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer Satisfaction */}
        <div className="card">
          <h2 className="section-title">
            <Star className="h-5 w-5 text-blue-600" />
            Customer Satisfaction
          </h2>
          
          <div className="flex justify-center my-6">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold text-blue-600">4.7</span>
                  <p className="text-sm text-gray-500">out of 5</p>
                </div>
              </div>
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200" strokeWidth="2.5"></circle>
                <circle 
                  cx="18" cy="18" r="16" fill="none" className="stroke-blue-500" 
                  strokeWidth="2.5" strokeDasharray="100" strokeDashoffset="6" 
                  strokeLinecap="round" transform="rotate(-90 18 18)"
                ></circle>
              </svg>
            </div>
          </div>
          
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentages = { 5: '75%', 4: '20%', 3: '5%', 2: '0%', 1: '0%' };
              const bgColor = rating > 2 ? 'bg-yellow-50' : 'bg-gray-100';
              const textColor = rating > 2 ? 'text-yellow-700' : 'text-gray-500';
              
              return (
                <div key={rating} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">{rating} stars</span>
                  </div>
                  <span className={`text-sm font-medium ${bgColor} px-2 py-0.5 rounded-full ${textColor}`}>
                    {percentages[rating as keyof typeof percentages]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* SLA Breaches */}
        <div className="card">
          <h2 className="section-title">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            SLA Breaches & Escalations
          </h2>
          
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-100 shadow-sm">
              <div className="flex items-start">
                <AlertTriangle className="text-red-500 mr-3 mt-0.5 h-5 w-5" />
                <div>
                  <h3 className="font-medium text-red-800">SLA Breaches</h3>
                  <p className="text-sm text-red-600 mt-1">5 tickets breached SLA this month</p>
                  
                  <div className="mt-3 space-y-2">
                    {[
                      { priority: 'High Priority', count: '3' },
                      { priority: 'Medium Priority', count: '2' },
                      { priority: 'Low Priority', count: '0' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-red-700">{item.priority}</span>
                        <span className="font-medium text-red-800 bg-red-100 px-2 py-0.5 rounded-full">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 shadow-sm">
              <div className="flex items-start">
                <TrendingUp className="text-yellow-500 mr-3 mt-0.5 h-5 w-5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Escalations</h3>
                  <p className="text-sm text-yellow-600 mt-1">7 tickets were escalated this month</p>
                  
                  <div className="mt-3 space-y-2">
                    {[
                      { reason: 'Technical Complexity', count: '4' },
                      { reason: 'Customer Request', count: '2' },
                      { reason: 'SLA Risk', count: '1' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-yellow-700">{item.reason}</span>
                        <span className="font-medium text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <a href="/tickets/agent/view-ticket" className="btn-primary w-full">
              View Escalated Tickets
            </a>
          </div>
        </div>
      </div>
      
      {/* Action Items & Recommendations */}
      <div className="card mb-6">
        <h2 className="section-title">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Action Items & Recommendations
        </h2>
        
        <div className="space-y-4 mt-4">
          {[
            { 
              title: 'Improve SLA Compliance',
              desc: 'Focus on reducing response time for high priority tickets to improve overall SLA compliance rate.',
              color: 'blue'
            },
            { 
              title: 'Knowledge Base Contributions',
              desc: 'Document solutions for recurring issues to improve one-touch resolution rate.',
              color: 'green'
            },
            { 
              title: 'Team Collaboration',
              desc: 'Engage with team members on complex tickets to reduce escalation rate.',
              color: 'purple'
            }
          ].map((item, i) => (
            <div key={i} className={`flex items-start p-3 bg-${item.color}-50 rounded-lg border border-${item.color}-100`}>
              <div className={`bg-${item.color}-100 p-2 rounded-full mr-3 shadow-sm`}>
                <CheckCircle size={18} className={`text-${item.color}-600`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/tickets/agent/update-ticket" className="btn-primary flex-1">
            <CheckCircle size={16} className="mr-2" />
            Update Ticket Status
          </a>
          
          <a href="/live_chat/agent/internal_notes" className="btn-primary flex-1">
            <MessageCircle size={16} className="mr-2" />
            Live Chat Response
          </a>
        </div>
      </div>
    </div>
  );
}