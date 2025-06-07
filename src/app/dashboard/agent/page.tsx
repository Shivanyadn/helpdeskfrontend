"use client";

import React, { useState, useEffect } from "react"; // Removed useRef
import AgentSidebar from "@/app/sidebar/AgentSidebar";
import { BarChart } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AgentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [performanceAnalytics, setPerformanceAnalytics] = useState<{
    labels: string[];
    ticketsAssigned: number[];
    ticketsResolved: number[];
    slaBreaches: number[];
  }>({
    labels: [],
    ticketsAssigned: [],
    ticketsResolved: [],
    slaBreaches: [],
  });

  // Fetch metrics and analytics data
  useEffect(() => {
    const fetchMetricsAndAnalytics = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        // Fetch tickets data
        const ticketsResponse = await axios.get('http://localhost:5000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch resolution times data
        const resolutionTimesResponse = await axios.get('http://localhost:5000/api/tickets/resolution-times', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch analytics data
        const analyticsResponse = await axios.get('http://localhost:5000/api/tickets/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (ticketsResponse.data && resolutionTimesResponse.data.success && analyticsResponse.data.success) {
          const tickets = ticketsResponse.data;
          const analytics = analyticsResponse.data;

          // Performance Analytics
          const monthlyData = tickets.reduce(
            (acc: Record<string, { assigned: number; resolved: number; breaches: number }>, ticket: { createdAt: string; status: string; ticketId: string }) => {
              const month = new Date(ticket.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
              if (!acc[month]) acc[month] = { assigned: 0, resolved: 0, breaches: 0 };

              acc[month].assigned += 1;
              if (ticket.status === 'Closed') acc[month].resolved += 1;
              if (analytics.slaBreaches.some((breach: { ticketId: string }) => breach.ticketId === ticket.ticketId)) acc[month].breaches += 1;

              return acc;
            },
            {}
          );

          const labels = Object.keys(monthlyData);
          const ticketsAssigned = labels.map((month) => monthlyData[month].assigned);
          const ticketsResolved = labels.map((month) => monthlyData[month].resolved);
          const slaBreaches = labels.map((month) => monthlyData[month].breaches);

          setPerformanceAnalytics({
            labels,
            ticketsAssigned,
            ticketsResolved,
            slaBreaches,
          });
        }
      } catch (error) {
        console.error('Error fetching metrics and analytics data:', error);
        alert('Failed to fetch metrics and analytics data. Please try again later.');
      }
    };

    fetchMetricsAndAnalytics();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(243, 244, 246, 1)',
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Performance Graph */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
              <BarChart size={16} className="text-blue-600" />
            </span>
            Performance Analytics
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Chart Type Toggle */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setChartType('bar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  chartType === 'bar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  chartType === 'line'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Line Chart
              </button>
            </div>

            {/* Chart Display */}
            <div className="h-80">
              {chartType === 'bar' ? (
                <Bar
                  data={{
                    labels: performanceAnalytics.labels,
                    datasets: [
                      {
                        label: 'Tickets Assigned',
                        data: performanceAnalytics.ticketsAssigned,
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 2,
                      },
                      {
                        label: 'Tickets Resolved',
                        data: performanceAnalytics.ticketsResolved,
                        backgroundColor: 'rgba(16, 185, 129, 0.6)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 2,
                      },
                      {
                        label: 'SLA Breaches',
                        data: performanceAnalytics.slaBreaches,
                        backgroundColor: 'rgba(239, 68, 68, 0.6)',
                        borderColor: 'rgb(239, 68, 68)',
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              ) : (
                <Line
                  data={{
                    labels: performanceAnalytics.labels,
                    datasets: [
                      {
                        label: 'Tickets Assigned',
                        data: performanceAnalytics.ticketsAssigned,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderWidth: 2,
                        tension: 0.4,
                      },
                      {
                        label: 'Tickets Resolved',
                        data: performanceAnalytics.ticketsResolved,
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderWidth: 2,
                        tension: 0.4,
                      },
                      {
                        label: 'SLA Breaches',
                        data: performanceAnalytics.slaBreaches,
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        borderWidth: 2,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgentDashboard;
