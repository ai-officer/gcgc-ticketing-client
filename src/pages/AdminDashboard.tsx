import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Ticket, CheckCircle, AlertCircle, Clock, Activity, Plus, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-panel p-3 border border-border-subtle shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-lg backdrop-blur-md">
        <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
          <p className="text-sm text-text-tertiary">
            Tickets: <span className="font-mono text-text-main">{payload[0].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const { tickets, addPCR, user } = useAppContext();
  const [isPCRModalOpen, setIsPCRModalOpen] = useState(false);
  const [pcrTitle, setPcrTitle] = useState('');
  const [pcrDesc, setPcrDesc] = useState('');
  const [pcrImpactAnalysis, setPcrImpactAnalysis] = useState('');
  const [pcrCostImpact, setPcrCostImpact] = useState('');
  const [pcrScheduleImpact, setPcrScheduleImpact] = useState('');

  const handlePCRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await addPCR({
      title: pcrTitle,
      description: pcrDesc,
      impactAnalysis: pcrImpactAnalysis,
      costImpact: parseFloat(pcrCostImpact) || 0,
      scheduleImpactDays: parseInt(pcrScheduleImpact) || 0,
      submittedBy: user.id,
    });
    setIsPCRModalOpen(false);
    setPcrTitle('');
    setPcrDesc('');
    setPcrImpactAnalysis('');
    setPcrCostImpact('');
    setPcrScheduleImpact('');
  };

  const stats = [
    { name: 'Total Volume', value: tickets.length, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { name: 'Open Requests', value: tickets.filter((t) => t.status === 'open').length, icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { name: 'In Progress', value: tickets.filter((t) => t.status === 'in-progress').length, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { name: 'Resolved', value: tickets.filter((t) => t.status === 'resolved').length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  const data = [
    { name: 'Plumbing', tickets: tickets.filter((t) => t.category === 'Plumbing').length },
    { name: 'Electrical', tickets: tickets.filter((t) => t.category === 'Electrical').length },
    { name: 'HVAC', tickets: tickets.filter((t) => t.category === 'HVAC').length },
    { name: 'IT Support', tickets: tickets.filter((t) => t.category === 'IT Support').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">System <span className="font-bold">Overview</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Global Operations Matrix</p>
        </div>
        <button 
          onClick={() => setIsPCRModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        >
          <Plus className="h-4 w-4" />
          New Change Request
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-bg-panel overflow-hidden rounded-xl border border-border-subtle relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="p-5 relative z-10">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-lg p-3 ${stat.bg} ${stat.border} border`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-mono text-text-faint uppercase tracking-wider truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-3xl font-light text-text-main mt-1">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[50px] pointer-events-none"></div>
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">Distribution by Category</h2>
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  allowDecimals={false}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: '#ffffff05' }} 
                />
                <Bar 
                  dataKey="tickets" 
                  fill="#22d3ee" 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none"></div>
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">Recent Activity Log</h2>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-white/5">
              {tickets.slice(0, 5).map((ticket) => (
                <li key={ticket.id} className="py-4 hover:bg-bg-hover transition-colors -mx-6 px-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-secondary truncate">{ticket.title}</p>
                      <p className="text-xs font-mono text-text-faint truncate mt-1">
                        <span className="text-indigo-400">{ticket.id}</span> • {ticket.category}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border
                        ${ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          ticket.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                          ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-bg-subtle text-text-muted border-border-subtle'}`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* PCR Modal */}
      {isPCRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-medium text-text-main">Project Change Request</h3>
              </div>
              <button onClick={() => setIsPCRModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <form onSubmit={handlePCRSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">PCR Title</label>
                  <input 
                    type="text" 
                    required
                    value={pcrTitle} 
                    onChange={e => setPcrTitle(e.target.value)}
                    className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g., Upgrade Server Infrastructure"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Description & Justification</label>
                  <textarea
                    required
                    value={pcrDesc}
                    onChange={e => setPcrDesc(e.target.value)}
                    rows={3}
                    className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Explain why this change is needed..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Impact Analysis</label>
                  <textarea
                    value={pcrImpactAnalysis}
                    onChange={e => setPcrImpactAnalysis(e.target.value)}
                    rows={2}
                    className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Describe systems/processes affected..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Cost Impact (₱)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={pcrCostImpact}
                      onChange={e => setPcrCostImpact(e.target.value)}
                      className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Schedule Impact (days)</label>
                    <input
                      type="number"
                      min="0"
                      value={pcrScheduleImpact}
                      onChange={e => setPcrScheduleImpact(e.target.value)}
                      className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
                <button type="button" onClick={() => setIsPCRModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium shadow-[0_0_10px_rgba(79,70,229,0.3)]">Submit PCR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
