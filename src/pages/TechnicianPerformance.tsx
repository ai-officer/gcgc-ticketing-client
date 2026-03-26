import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, CheckCircle, Zap, Target, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-panel p-3 border border-border-subtle shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-lg backdrop-blur-md">
        <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
          <p className="text-sm text-text-tertiary">
            Resolved: <span className="font-mono text-text-main">{payload[0].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const TechnicianPerformance = () => {
  const { user, users, tickets, worklogs } = useAppContext();
  const [selectedTechId, setSelectedTechId] = useState<string>(user?.id || '');

  const isAdminOrServiceDesk = user?.role === 'admin' || user?.role === 'service_desk';
  const technicians = users.filter(u => u.role === 'technician');

  const targetTechId = isAdminOrServiceDesk ? selectedTechId : user?.id;

  const myTickets = tickets.filter((t) => t.assigneeId === targetTechId);
  const resolvedTickets = myTickets.filter((t) => t.status === 'resolved' || t.status === 'closed');
  const myWorklogs = worklogs.filter((w) => w.technicianId === targetTechId);
  
  const totalMinutes = myWorklogs.reduce((acc, w) => acc + w.timeSpentMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Calculate First-Time Fix Rate (mock logic: tickets with only 1 worklog)
  const firstTimeFixes = resolvedTickets.filter(t => {
    const logs = myWorklogs.filter(w => w.ticketId === t.id);
    return logs.length === 1;
  });
  const ftfr = resolvedTickets.length > 0 ? ((firstTimeFixes.length / resolvedTickets.length) * 100).toFixed(1) : '0.0';

  // Calculate Customer Rating
  const ratedTickets = resolvedTickets.filter(t => t.rating && t.rating.score > 0);
  const avgRating = ratedTickets.length > 0 
    ? (ratedTickets.reduce((acc, t) => acc + (t.rating?.score || 0), 0) / ratedTickets.length).toFixed(1)
    : 'N/A';

  // Mock weekly data
  const weeklyData = [
    { name: 'Mon', resolved: 2 },
    { name: 'Tue', resolved: 4 },
    { name: 'Wed', resolved: 3 },
    { name: 'Thu', resolved: 5 },
    { name: 'Fri', resolved: 4 },
  ];

  // Calculate Avg Time per Job
  const avgTimePerJob = resolvedTickets.length > 0 
    ? (totalMinutes / resolvedTickets.length).toFixed(0)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">Performance <span className="font-bold">Metrics</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Efficiency Dashboard</p>
        </div>
        
        {isAdminOrServiceDesk && (
          <div className="flex items-center gap-3 bg-bg-panel border border-border-subtle rounded-lg px-4 py-2">
            <Users className="h-4 w-4 text-text-muted" />
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              className="bg-transparent border-none text-sm text-text-secondary focus:ring-0 cursor-pointer"
            >
              <option value="">Select Technician...</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <CheckCircle className="h-6 w-6 text-emerald-400 mb-4" />
          <p className="text-3xl font-light text-text-main">{resolvedTickets.length}</p>
          <p className="text-xs font-mono text-text-faint uppercase tracking-wider mt-2">Total Resolved</p>
        </div>
        
        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <Clock className="h-6 w-6 text-indigo-400 mb-4" />
          <p className="text-3xl font-light text-text-main">{totalHours} <span className="text-sm text-text-faint">hrs</span></p>
          <p className="text-xs font-mono text-text-faint uppercase tracking-wider mt-2">Time Logged</p>
        </div>

        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <Clock className="h-6 w-6 text-purple-400 mb-4" />
          <p className="text-3xl font-light text-text-main">{avgTimePerJob} <span className="text-sm text-text-faint">min</span></p>
          <p className="text-xs font-mono text-text-faint uppercase tracking-wider mt-2">Avg Time per Job</p>
        </div>

        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <Zap className="h-6 w-6 text-cyan-400 mb-4" />
          <p className="text-3xl font-light text-text-main">{ftfr} <span className="text-sm text-text-faint">%</span></p>
          <p className="text-xs font-mono text-text-faint uppercase tracking-wider mt-2">First-Time Fix Rate</p>
        </div>

        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <Target className="h-6 w-6 text-amber-400 mb-4" />
          <p className="text-3xl font-light text-text-main">98 <span className="text-sm text-text-faint">%</span></p>
          <p className="text-xs font-mono text-text-faint uppercase tracking-wider mt-2">SLA Hit Rate</p>
        </div>

        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-pink-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p className="text-3xl font-light text-text-main">{avgRating} <span className="text-sm text-text-faint">/ 5</span></p>
          <p className="text-xs font-mono text-text-faint uppercase tracking-wider mt-2">Avg Customer Rating</p>
        </div>
      </div>

      <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">Weekly Resolution Output</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                dataKey="resolved" 
                fill="#818cf8" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TechnicianPerformance;
