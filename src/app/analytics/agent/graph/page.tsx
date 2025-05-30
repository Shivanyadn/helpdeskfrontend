'use client';

import { useState, lazy, Suspense } from 'react';
import AgentSidebar from '@/app/sidebar/AgentSidebar';
import { BarChart3, PieChart, LineChart, Clock, AlertTriangle, MessageSquare, ThumbsUp, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, 
  Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, 
  Tooltip, Legend, ArcElement, PointElement, LineElement
);

// Lazy load chart components
const LazyBar = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Bar })));
const LazyPie = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Pie })));
const LazyLine = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Line })));

// Loading fallback component
const ChartLoading = () => (
  <section className="flex items-center justify-center h-[400px] w-full">
    <figure className="animate-pulse flex flex-col items-center">
      <span className="h-10 w-10 bg-blue-200 rounded-full mb-3"></span>
      <figcaption className="text-sm text-gray-500">Loading chart...</figcaption>
    </figure>
  </section>
);

const AgentAnalyticsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChart, setActiveChart] = useState('tickets');
  const [timeRange, setTimeRange] = useState('month');

  // Chart data
  const chartData = {
    tickets: {
      labels: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
      datasets: [{
        label: 'Number of Tickets',
        data: [12, 19, 8, 15, 24],
        backgroundColor: 'rgb(59 130 246 / 0.6)',
        borderColor: 'rgb(59 130 246)',
        borderWidth: 1,
      }],
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' as const },
          title: { display: true, text: 'Ticket Status Distribution' },
        },
      }
    },
    resolution: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Avg. Resolution Time (hours)',
        data: [4.2, 3.8, 5.1, 3.5, 4.0, 2.8, 3.2],
        borderColor: 'rgb(16 185 129)',
        backgroundColor: 'rgb(16 185 129 / 0.2)',
        tension: 0.4,
        fill: true,
      }],
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' as const },
          title: { display: true, text: 'Average Resolution Time Trend' },
        },
      }
    },
    categories: {
      labels: ['Hardware', 'Software', 'Network', 'Account Access', 'Email', 'Other'],
      datasets: [{
        label: 'Tickets by Category',
        data: [25, 32, 18, 15, 22, 8],
        backgroundColor: [
          'rgb(59 130 246 / 0.6)', 'rgb(16 185 129 / 0.6)', 'rgb(245 158 11 / 0.6)',
          'rgb(239 68 68 / 0.6)', 'rgb(139 92 246 / 0.6)', 'rgb(236 72 153 / 0.6)',
        ],
        borderColor: [
          'rgb(59 130 246)', 'rgb(16 185 129)', 'rgb(245 158 11)',
          'rgb(239 68 68)', 'rgb(139 92 246)', 'rgb(236 72 153)',
        ],
        borderWidth: 1,
      }],
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' as const },
          title: { display: true, text: 'Tickets by Category' },
        },
      }
    }
  };

  // Ticket metrics data
  const ticketMetrics = {
    totalAssigned: 78,
    open: 12,
    inProgress: 19,
    closed: 47,
    slaAtRisk: 3,
    avgResolutionTime: '3.8 hours',
    feedbackScore: 4.7,
    responseRate: '92%'
  };

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'chat', user: 'John Doe', message: 'When will my printer be fixed?', time: '10 min ago' },
    { id: 2, type: 'note', user: 'You', message: 'Contacted vendor for replacement parts', time: '25 min ago' },
    { id: 3, type: 'status', ticket: 'TK-1024', status: 'In Progress', time: '1 hour ago' },
    { id: 4, type: 'chat', user: 'Sarah Miller', message: 'Thanks for your help!', time: '2 hours ago' },
  ];

  // Card styles by type
  const cardStyles = {
    blue: "border-l-4 border-blue-500 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300",
    red: "border-l-4 border-red-500 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300",
    green: "border-l-4 border-green-500 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300",
    purple: "border-l-4 border-purple-500 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
  };

  // Icon container styles by color
  const iconStyles = {
    blue: "bg-blue-100 p-2.5 rounded-lg",
    red: "bg-red-100 p-2.5 rounded-lg",
    green: "bg-green-100 p-2.5 rounded-lg",
    purple: "bg-purple-100 p-2.5 rounded-lg"
  };

  // Badge styles by color
  const badgeStyles = {
    blue: "px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium",
    amber: "px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium",
    green: "px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
  };

  // Button styles by color
  const buttonStyles = {
    red: "text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors font-medium",
    blue: "flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  };

  // Activity icon styles by type
  const activityIconStyles = {
    chat: "p-2.5 rounded-full bg-blue-100",
    note: "p-2.5 rounded-full bg-amber-100",
    status: "p-2.5 rounded-full bg-green-100"
  };

  return (
    <>
      <AgentSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} bg-gray-50 min-h-screen`}>
        <section className="p-6 md:p-8">
          {/* Header section */}
          <header className="mb-8">
            <hgroup className="flex items-center gap-3 mb-3">
              <BarChart3 className="h-7 w-7 text-blue-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ticket Analytics</h1>
            </hgroup>
            <p className="text-gray-600 text-lg">Track your performance metrics and ticket analytics</p>
          </header>

          {/* Metrics cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Assigned Tickets */}
            <article className={cardStyles.blue}>
              <header className="flex justify-between items-start">
                <hgroup>
                  <p className="text-sm font-medium text-gray-500">Total Assigned Tickets</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{ticketMetrics.totalAssigned}</h3>
                </hgroup>
                <span className={iconStyles.blue}>
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </span>
              </header>
              <footer className="flex gap-2 mt-4 text-xs">
                <span className={badgeStyles.blue}>Open: {ticketMetrics.open}</span>
                <span className={badgeStyles.amber}>In Progress: {ticketMetrics.inProgress}</span>
                <span className={badgeStyles.green}>Closed: {ticketMetrics.closed}</span>
              </footer>
            </article>

            {/* SLA Breach Alerts */}
            <article className={cardStyles.red}>
              <header className="flex justify-between items-start">
                <hgroup>
                  <p className="text-sm font-medium text-gray-500">SLA Breach Alerts</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{ticketMetrics.slaAtRisk}</h3>
                </hgroup>
                <span className={iconStyles.red}>
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </span>
              </header>
              <footer className="mt-4">
                <button className={buttonStyles.red}>
                  View Critical Cases
                </button>
              </footer>
            </article>

            {/* Resolution Time */}
            <article className={cardStyles.green}>
              <header className="flex justify-between items-start">
                <hgroup>
                  <p className="text-sm font-medium text-gray-500">Avg. Resolution Time</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{ticketMetrics.avgResolutionTime}</h3>
                </hgroup>
                <span className={iconStyles.green}>
                  <Clock className="h-6 w-6 text-green-600" />
                </span>
              </header>
              <footer className="mt-4 text-xs text-gray-500">
                <span className="text-green-600 font-medium">↓ 12%</span> compared to last week
              </footer>
            </article>

            {/* Feedback Score */}
            <article className={cardStyles.purple}>
              <header className="flex justify-between items-start">
                <hgroup>
                  <p className="text-sm font-medium text-gray-500">Customer Feedback</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{ticketMetrics.feedbackScore}/5</h3>
                </hgroup>
                <span className={iconStyles.purple}>
                  <ThumbsUp className="h-6 w-6 text-purple-600" />
                </span>
              </header>
              <footer className="mt-4 text-xs text-gray-500">
                Response rate: <span className="font-medium">{ticketMetrics.responseRate}</span>
              </footer>
            </article>
          </section>

          {/* Controls */}
          <section className="bg-white p-5 rounded-xl shadow-md mb-8">
            <form className="flex flex-col md:flex-row justify-between items-center gap-5">
              {/* Chart type selector */}
              <fieldset className="flex items-center gap-3 w-full md:w-auto">
                <legend className="text-sm font-medium text-gray-700">Chart Type:</legend>
                <nav className="flex bg-gray-100 rounded-lg p-1 flex-wrap md:flex-nowrap">
                  <button
                    type="button"
                    onClick={() => setActiveChart('tickets')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      activeChart === 'tickets' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Ticket Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveChart('resolution')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      activeChart === 'resolution' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Resolution Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveChart('categories')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      activeChart === 'categories' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Categories
                  </button>
                </nav>
              </fieldset>

              {/* Time range selector */}
              <fieldset className="flex items-center gap-3 w-full md:w-auto">
                <label className="text-sm font-medium text-gray-700" htmlFor="timeRange">Time Range:</label>
                <select
                  id="timeRange"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full md:w-auto"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </fieldset>

              {/* Export button */}
              <button type="button" className={`${buttonStyles.blue} w-full md:w-auto mt-3 md:mt-0`}>
                <Download size={16} />
                <span>Export Report</span>
              </button>
            </form>
          </section>

          {/* Chart display */}
          <figure className="bg-white p-6 rounded-xl shadow-md mb-8 overflow-hidden">
            <section className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg p-4">
              <Suspense fallback={<ChartLoading />}>
                {activeChart === 'tickets' && <LazyBar data={chartData.tickets} options={chartData.tickets.options} />}
                {activeChart === 'resolution' && <LazyLine data={chartData.resolution} options={chartData.resolution.options} />}
                {activeChart === 'categories' && <LazyPie data={chartData.categories} options={chartData.categories.options} />}
              </Suspense>
            </section>
          </figure>

          {/* Recent activities and chats */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Activities
            </h3>
            <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <span className={activityIconStyles[activity.type as keyof typeof activityIconStyles]}>
                    {activity.type === 'chat' ? (
                      <MessageSquare size={16} className="text-blue-600" />
                    ) : activity.type === 'note' ? (
                      <MessageSquare size={16} className="text-amber-600" />
                    ) : (
                      <Clock size={16} className="text-green-600" />
                    )}
                  </span>
                  <article className="flex-1">
                    <header className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-gray-800">
                        {activity.type === 'status' ? `Ticket ${activity.ticket} updated to ${activity.status}` : activity.user}
                      </h4>
                      <time className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{activity.time}</time>
                    </header>
                    {activity.message && (
                      <p className="text-sm text-gray-600 mt-1.5">{activity.message}</p>
                    )}
                  </article>
                </li>
              ))}
            </ul>
            <footer className="mt-5 pt-2 border-t border-gray-100">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline">
                View All Activities
                <span className="text-xs">→</span>
              </button>
            </footer>
          </section>
        </section>
      </main>
    </>
  );
};

export default AgentAnalyticsPage;