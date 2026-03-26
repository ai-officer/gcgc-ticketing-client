import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Briefcase, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pagination } from '../components/Pagination';

const TechnicianDashboard = () => {
  const { user, tickets, toggleDuty } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const myTickets = tickets.filter((t) => t.assigneeId === user?.id);
  const activeTickets = myTickets.filter((t) => ['assigned', 'in-progress'].includes(t.status));
  const resolvedTickets = myTickets.filter((t) => t.status === 'resolved' || t.status === 'closed');
  
  const urgentTickets = activeTickets.filter((t) => t.priority === 'high' || t.priority === 'critical');

  const totalPages = Math.ceil(activeTickets.length / itemsPerPage);
  const paginatedTickets = activeTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = [
    { name: 'Active Tasks', value: activeTickets.length, icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { name: 'Urgent', value: urgentTickets.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { name: 'Completed', value: resolvedTickets.length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { name: 'Avg Time/Job', value: '1.5h', icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">Technician <span className="font-bold">Terminal</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Welcome back, {user?.name}</p>
        </div>
        <button 
          onClick={toggleDuty}
          className={`flex items-center gap-3 px-4 py-2 bg-bg-panel border rounded-lg transition-all hover:scale-105 active:scale-95 ${
            user?.isOnDuty ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-red-500/50 grayscale opacity-70'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {user?.isOnDuty && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              user?.isOnDuty ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
            }`}></span>
          </span>
          <span className={`text-xs font-mono uppercase tracking-widest ${
            user?.isOnDuty ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {user?.isOnDuty ? 'On Duty' : 'Off Duty'}
          </span>
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

      <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="px-6 py-5 border-b border-border-faint flex items-center justify-between relative z-10">
          <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">My Assigned Tasks</h3>
          <Link to="/tasks" className="text-xs font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">View all</Link>
        </div>
        <div className="divide-y divide-white/5 relative z-10">
          {paginatedTickets.length > 0 ? (
            paginatedTickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-bg-hover transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className={`mt-1.5 sm:mt-0 h-2 w-2 rounded-full shadow-[0_0_8px_currentColor] flex-shrink-0 ${
                      ticket.priority === 'critical' ? 'bg-red-500 text-red-500' :
                      ticket.priority === 'high' ? 'bg-orange-500 text-orange-500' :
                      ticket.priority === 'medium' ? 'bg-amber-500 text-amber-500' : 'bg-emerald-500 text-emerald-500'
                    }`} />
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary">{ticket.title}</h4>
                      <p className="text-xs font-mono text-text-faint mt-1">
                        <span className="text-indigo-400">{ticket.id}</span> • {ticket.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-6 sm:ml-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border
                      ${ticket.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-bg-subtle text-text-muted border-border-subtle'}`}>
                      {ticket.status.replace('-', ' ')}
                    </span>
                    <Link
                      to={`/tasks/${ticket.id}`}
                      className="text-xs font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-widest px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors border border-indigo-500/20"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm font-mono text-text-faint uppercase tracking-widest">No active tasks assigned.</div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TechnicianDashboard;
