import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-panel p-3 border border-border-subtle shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-lg backdrop-blur-md">
        <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">{label}</p>
        <div className="flex flex-col gap-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-sm text-text-tertiary">
                {entry.name}: <span className="font-mono text-text-main">{entry.value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const BusinessIntelligence = () => {
  const { tickets } = useAppContext();

  // Mock data for trends
  const trendData = [
    { name: 'Mon', volume: 12, resolved: 8 },
    { name: 'Tue', volume: 19, resolved: 15 },
    { name: 'Wed', volume: 15, resolved: 12 },
    { name: 'Thu', volume: 22, resolved: 18 },
    { name: 'Fri', volume: 28, resolved: 20 },
    { name: 'Sat', volume: 10, resolved: 15 },
    { name: 'Sun', volume: 5,  resolved: 8 },
  ];

  // Mock data for YoY Analysis
  const yoyData = [
    { month: 'Jan', currentYear: 120, previousYear: 90 },
    { month: 'Feb', currentYear: 150, previousYear: 110 },
    { month: 'Mar', currentYear: 180, previousYear: 130 },
    { month: 'Apr', currentYear: 140, previousYear: 145 },
    { month: 'May', currentYear: 190, previousYear: 160 },
    { month: 'Jun', currentYear: 210, previousYear: 180 },
    { month: 'Jul', currentYear: 230, previousYear: 200 },
    { month: 'Aug', currentYear: 200, previousYear: 190 },
    { month: 'Sep', currentYear: 240, previousYear: 210 },
    { month: 'Oct', currentYear: 260, previousYear: 220 },
    { month: 'Nov', currentYear: 280, previousYear: 240 },
    { month: 'Dec', currentYear: 300, previousYear: 250 },
  ];

  const priorityData = [
    { name: 'Critical', value: tickets.filter(t => t.priority === 'critical').length, color: '#ef4444' },
    { name: 'High', value: tickets.filter(t => t.priority === 'high').length, color: '#f97316' },
    { name: 'Medium', value: tickets.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tickets.filter(t => t.priority === 'low').length, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-text-main">Business <span className="font-bold">Intelligence</span></h1>
        <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Analytics & Performance Metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">Volume vs Resolution Trend</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12, fontFamily: 'JetBrains Mono' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="volume" name="New Tickets" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[50px] pointer-events-none"></div>
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-2">Priority Distribution</h2>
          <div className="flex-1 min-h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="absolute bottom-0 left-0 w-full flex flex-wrap justify-center gap-4">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-mono text-text-muted">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-text-faint uppercase tracking-wider">Avg Resolution Time</p>
            <p className="text-2xl font-light text-text-main mt-1">4.2 <span className="text-sm text-text-faint">hrs</span></p>
          </div>
        </div>
        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-text-faint uppercase tracking-wider">SLA Compliance</p>
            <p className="text-2xl font-light text-text-main mt-1">94.8 <span className="text-sm text-text-faint">%</span></p>
          </div>
        </div>
        <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-text-faint uppercase tracking-wider">Backlog</p>
            <p className="text-2xl font-light text-text-main mt-1">{tickets.filter(t => t.status === 'open').length} <span className="text-sm text-text-faint">tickets</span></p>
          </div>
        </div>
      </div>

      {/* Year-over-Year Analysis */}
      <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">Year-over-Year Ticket Volume</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yoyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12, fontFamily: 'JetBrains Mono' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="currentYear" name="Current Year" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#10b981' }} />
              <Line type="monotone" dataKey="previousYear" name="Previous Year" stroke="#737373" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#737373', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#737373' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligence;
