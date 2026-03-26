import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Ticket, PlusCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestorDashboard = () => {
  const { user, tickets } = useAppContext();

  const myTickets = tickets.filter((t) => t.requestorId === user?.id);
  const pendingTickets = myTickets.filter((t) => ['open', 'assigned', 'in-progress'].includes(t.status));
  const completedTickets = myTickets.filter((t) => ['resolved', 'closed'].includes(t.status));
  const totalCost = completedTickets.reduce((acc, t) => acc + (t.cost || 0), 0);

  const stats = [
    { name: 'Total Logs', value: myTickets.length, icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { name: 'Pending', value: pendingTickets.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { name: 'Completed', value: completedTickets.length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { name: 'Total Cost', value: `₱${totalCost.toFixed(2)}`, icon: Ticket, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">Requestor <span className="font-bold">Portal</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] text-sm font-medium w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          New Entry
        </Link>
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="px-6 py-5 border-b border-border-faint flex items-center justify-between relative z-10">
          <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Recent Logs</h3>
          <Link to="/my-requests" className="text-xs font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">View all</Link>
        </div>
        <div className="divide-y divide-white/5 relative z-10">
          {myTickets.length > 0 ? (
            myTickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-bg-hover transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary">{ticket.title}</h4>
                    <p className="text-xs font-mono text-text-faint mt-1">
                      <span className="text-indigo-400">{ticket.id}</span> • {ticket.category} • {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border
                      ${ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        ticket.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                        ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-bg-subtle text-text-muted border-border-subtle'}`}>
                      {ticket.status.replace('-', ' ')}
                    </span>
                    <Link
                      to={`/my-requests/${ticket.id}`}
                      className="text-xs font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-widest px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors border border-indigo-500/20"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm font-mono text-text-faint uppercase tracking-widest">No entries found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestorDashboard;
