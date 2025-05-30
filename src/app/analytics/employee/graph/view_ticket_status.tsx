'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { getTickets } from '@/api/tickets'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50']

type ChartDataType = { name: string; value: number }

const TicketStatusGraph = () => {
  const [chartData, setChartData] = useState<ChartDataType[]>([])
  const [totalTickets, setTotalTickets] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true)
        const tickets = await getTickets()
        
        // Process tickets to count by status
        const statusCounts: Record<string, number> = {}
        tickets.forEach(ticket => {
          statusCounts[ticket.status] = (statusCounts[ticket.status] || 0) + 1
        })
        
        // Convert to chart data format
        const formattedData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
        
        setChartData(formattedData)
        setTotalTickets(tickets.length)
        setError(null)
      } catch (err) {
        console.error('Error fetching ticket data:', err)
        setError('Failed to load ticket data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTicketData()
  }, [])

  // Calculate resolution rate
  const resolutionRate = chartData.some(item => item.name === "Resolved") 
    ? `${((chartData.find(item => item.name === "Resolved")?.value || 0) / totalTickets * 100).toFixed(0)}%` 
    : "0%"

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Left side - Pie Chart */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4">Ticket Status Graph</h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : chartData.length > 0 ? (
            <div>
              <PieChart width={400} height={300}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              
              {/* Status indicators */}
              <div className="flex flex-wrap gap-4 mt-2 justify-center">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">No ticket data available</p>
          )}
        </div>

        {/* Right side - Status Details and Stats */}
        <div className="flex-1 mt-4 md:mt-0 flex flex-col gap-6">
          {/* Status Details Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold p-4 border-b">Ticket Status Details</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Status', 'Count', 'Percentage', 'Color'].map(header => (
                      <th key={header} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-sm text-gray-500">Loading data...</td>
                    </tr>
                  ) : chartData.length > 0 ? (
                    <>
                      {chartData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-500">{item.value}</td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {((item.value / totalTickets) * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-medium">
                        <td className="py-3 px-4 text-sm">Total</td>
                        <td className="py-3 px-4 text-sm">{totalTickets}</td>
                        <td className="py-3 px-4 text-sm">100%</td>
                        <td className="py-3 px-4"></td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-sm text-gray-500">No ticket data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { 
                bg: "bg-blue-50", 
                title: "Average Resolution Time", 
                titleColor: "text-blue-800", 
                valueColor: "text-blue-900", 
                value: loading ? "Loading..." : "2.4 days" 
              },
              { 
                bg: "bg-green-50", 
                title: "Resolution Rate", 
                titleColor: "text-green-800", 
                valueColor: "text-green-900", 
                value: loading ? "Loading..." : resolutionRate 
              }
            ].map((stat, index) => (
              <div key={index} className={`${stat.bg} p-4 rounded-lg shadow-sm`}>
                <h4 className={`text-sm font-medium ${stat.titleColor} mb-1`}>{stat.title}</h4>
                <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketStatusGraph
