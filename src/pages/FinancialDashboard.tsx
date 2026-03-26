import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DollarSign, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Pagination } from '../components/Pagination';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-panel p-3 border border-border-subtle shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-lg backdrop-blur-md">
        <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
          <p className="text-sm text-text-tertiary">
            Cost: <span className="font-mono text-text-main">${payload[0].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const FinancialDashboard = () => {
  const { tickets, updateTicket, properties, pricingHistory } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'revenue' | 'branches' | 'pricing'>('revenue');
  const itemsPerPage = 10;

  // Calculate total costs from resolved/closed tickets
  const totalCost = tickets.reduce((acc, t) => acc + (t.cost || 0), 0);
  
  // Calculate total revenue from tickets
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.revenue || 0), 0);
  const grossProfit = totalRevenue - totalCost;
  const roi = totalCost > 0 ? ((grossProfit / totalCost) * 100).toFixed(1) : '0.0';

  // Mock YoY data for demonstration
  const yoyGrowth = {
    revenue: 12.5,
    profit: 8.2,
    roi: 4.1,
    spend: -5.4
  };

  const propertyStats = properties.map(p => {
    const propertyTickets = tickets.filter(t => t.propertyId === p.id);
    const revenue = propertyTickets.reduce((acc, t) => acc + (t.revenue || 0), 0);
    const cost = propertyTickets.reduce((acc, t) => acc + (t.cost || 0), 0);
    const target = p.collectionTarget || 0;
    const progress = target > 0 ? (revenue / target) * 100 : 0;
    return { ...p, revenue, cost, target, progress };
  });

  const costByCategory = [
    { name: 'Plumbing', cost: tickets.filter(t => t.category === 'Plumbing').reduce((a, t) => a + (t.cost || 0), 0) },
    { name: 'Electrical', cost: tickets.filter(t => t.category === 'Electrical').reduce((a, t) => a + (t.cost || 0), 0) },
    { name: 'HVAC', cost: tickets.filter(t => t.category === 'HVAC').reduce((a, t) => a + (t.cost || 0), 0) },
    { name: 'IT Support', cost: tickets.filter(t => t.category === 'IT Support').reduce((a, t) => a + (t.cost || 0), 0) },
  ];

  const ticketsWithCost = tickets.filter(t => t.cost && t.cost > 0);
  const totalPages = Math.ceil(ticketsWithCost.length / itemsPerPage);
  const paginatedTickets = ticketsWithCost.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-text-main">Financial <span className="font-bold">Matrix</span></h1>
        <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Revenue, Profit & ROI Tracking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-text-faint uppercase tracking-wider">Total Revenue</p>
            <DollarSign className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-light text-text-main mt-4">₱{totalRevenue.toLocaleString()}</p>
          <div className={`mt-4 flex items-center text-xs font-mono ${yoyGrowth.revenue >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
            {yoyGrowth.revenue >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            <span>{Math.abs(yoyGrowth.revenue)}% from last year</span>
          </div>
        </div>

        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-text-faint uppercase tracking-wider">Gross Profit</p>
            <TrendingDown className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-light text-text-main mt-4">₱{grossProfit.toLocaleString()}</p>
          <div className={`mt-4 flex items-center text-xs font-mono ${yoyGrowth.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {yoyGrowth.profit >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            <span>{Math.abs(yoyGrowth.profit)}% YoY Growth</span>
          </div>
        </div>

        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-text-faint uppercase tracking-wider">Return on Investment</p>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-light text-text-main mt-4">{roi}%</p>
          <div className={`mt-4 flex items-center text-xs font-mono ${yoyGrowth.roi >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            {yoyGrowth.roi >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            <span>{Math.abs(yoyGrowth.roi)}% Efficiency Gain</span>
          </div>
        </div>

        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-text-faint uppercase tracking-wider">Total Spend (YTD)</p>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-light text-text-main mt-4">₱{totalCost.toLocaleString()}</p>
          <div className={`mt-4 flex items-center text-xs font-mono ${yoyGrowth.spend <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {yoyGrowth.spend <= 0 ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
            <span>{Math.abs(yoyGrowth.spend)}% {yoyGrowth.spend <= 0 ? 'reduction' : 'increase'}</span>
          </div>
        </div>
      </div>

      <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">Expenditure by Category</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#737373', fontSize: 12, fontFamily: 'JetBrains Mono' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#737373', fontSize: 12, fontFamily: 'JetBrains Mono' }} 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: '#ffffff05' }} 
              />
              <Bar 
                dataKey="cost" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden">
        <div className="flex border-b border-border-faint">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-6 py-4 text-xs font-mono uppercase tracking-widest transition-colors ${
              activeTab === 'revenue' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-white/5' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Revenue & Billing
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-6 py-4 text-xs font-mono uppercase tracking-widest transition-colors ${
              activeTab === 'branches' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-white/5' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Branch Collections
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-6 py-4 text-xs font-mono uppercase tracking-widest transition-colors ${
              activeTab === 'pricing' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-white/5' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Pricing History
          </button>
        </div>

        {activeTab === 'revenue' && (
          <>
            <div className="px-6 py-5 border-b border-border-faint flex items-center justify-between">
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Revenue & Billing Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-faint bg-bg-base">
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Ticket ID</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Cost</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Revenue</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedTickets.map((ticket) => {
                    const profit = (ticket.revenue || 0) - (ticket.cost || 0);
                    return (
                      <tr key={ticket.id} className="hover:bg-bg-hover transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-text-muted">{ticket.id}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{ticket.title}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{ticket.category}</td>
                        <td className="px-6 py-4 text-sm font-mono text-red-400 text-right">₱{ticket.cost?.toLocaleString() || 0}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm font-mono text-text-muted">₱</span>
                            <input
                              type="number"
                              value={ticket.revenue || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                updateTicket(ticket.id, { revenue: isNaN(val) ? 0 : val });
                              }}
                              className="w-24 bg-bg-base border border-border-subtle rounded px-2 py-1 text-sm font-mono text-emerald-400 text-right focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm font-mono text-right ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          ₱{profit.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedTickets.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm font-mono text-text-faint uppercase tracking-widest">
                        No tickets with costs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === 'branches' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {propertyStats.map(p => (
              <div key={p.id} className="bg-bg-base border border-border-subtle rounded-xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-text-main">{p.name}</h4>
                    <p className="text-xs font-mono text-text-faint uppercase tracking-wider">{p.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-text-faint uppercase tracking-wider">Target</p>
                    <p className="text-sm font-mono text-text-tertiary">₱{p.target.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
                    <span className="text-text-muted">Collection Progress</span>
                    <span className="text-emerald-400">{p.progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                      style={{ width: `${Math.min(p.progress, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <p className="text-[10px] font-mono text-text-faint uppercase tracking-wider mb-1">Revenue</p>
                      <p className="text-lg font-light text-emerald-400">₱{p.revenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <p className="text-[10px] font-mono text-text-faint uppercase tracking-wider mb-1">Cost</p>
                      <p className="text-lg font-light text-red-400">₱{p.cost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-faint bg-bg-base">
                  <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Standard Rate</th>
                  <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pricingHistory.length > 0 ? (
                  pricingHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-bg-hover transition-colors">
                      <td className="px-6 py-4 text-sm text-text-secondary">{record.serviceName}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">{record.category}</td>
                      <td className="px-6 py-4 text-sm font-mono text-emerald-400 text-right">₱{record.price?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs font-mono text-text-faint">{record.effectiveDate ? new Date(record.effectiveDate).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm font-mono text-text-faint uppercase tracking-widest">
                      No pricing records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;
