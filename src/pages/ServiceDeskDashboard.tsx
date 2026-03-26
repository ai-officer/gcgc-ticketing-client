import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Ticket as TicketIcon, Clock, CheckCircle, AlertTriangle, Search, Filter, MessageSquare, User, Activity, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Pagination } from '../components/Pagination';

const ServiceDeskDashboard = () => {
  const { tickets, users, updateTicket } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const technicians = users.filter(u => u.role === 'technician');

  const handleAssign = () => {
    if (selectedTicket && selectedTechnician) {
      updateTicket(selectedTicket.id, { assigneeId: selectedTechnician });
      setIsAssignModalOpen(false);
      setSelectedTicket(null);
      setSelectedTechnician('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">Service Desk <span className="font-bold">Dashboard</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Manage & Dispatch Requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-panel p-6 rounded-xl border border-border-subtle relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-mono text-text-faint uppercase tracking-wider mb-1">Total Requests</p>
              <p className="text-3xl font-light text-text-main">{tickets.length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <TicketIcon className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-bg-panel p-6 rounded-xl border border-border-subtle relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-mono text-text-faint uppercase tracking-wider mb-1">Open</p>
              <p className="text-3xl font-light text-text-main">{tickets.filter(t => t.status === 'open').length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-bg-panel p-6 rounded-xl border border-border-subtle relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-mono text-text-faint uppercase tracking-wider mb-1">In Progress</p>
              <p className="text-3xl font-light text-text-main">{tickets.filter(t => t.status === 'in-progress').length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="bg-bg-panel p-6 rounded-xl border border-border-subtle relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-mono text-text-faint uppercase tracking-wider mb-1">Escalated</p>
              <p className="text-3xl font-light text-text-main">{tickets.filter(t => t.escalated).length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metrics Summary (Module XIII) */}
      <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-border-faint flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Financial Summary</h3>
          </div>
          <span className="text-[10px] font-mono text-text-faint uppercase tracking-widest">Live Computation</span>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest">Total Revenue</p>
            <p className="text-2xl font-bold text-emerald-400">₱{tickets.reduce((acc, t) => acc + (t.revenue || 0), 0).toLocaleString()}</p>
            <p className="text-[10px] font-mono text-emerald-500/60">Resolved tickets</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest">Total Cost</p>
            <p className="text-2xl font-bold text-red-400">₱{tickets.reduce((acc, t) => acc + (t.vendorCost || 0), 0).toLocaleString()}</p>
            <p className="text-[10px] font-mono text-red-500/60">Vendor costs</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest">Net Profit</p>
            <p className="text-2xl font-bold text-text-main">₱{(tickets.reduce((acc, t) => acc + (t.revenue || 0), 0) - tickets.reduce((acc, t) => acc + (t.vendorCost || 0), 0)).toLocaleString()}</p>
            <p className="text-[10px] font-mono text-emerald-500/60">Revenue minus costs</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-panel border border-border-subtle rounded-lg text-sm text-text-secondary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-faint" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-bg-panel border border-border-subtle rounded-lg text-sm text-text-secondary py-2 px-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-faint bg-bg-base">
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Requestor</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Technician</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-bg-hover transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-text-muted">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary font-medium">{ticket.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border
                      ${ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        ticket.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                        ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-bg-subtle text-text-muted border-border-subtle'}`}>
                      {ticket.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border
                      ${ticket.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        ticket.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {users.find(u => u.id === ticket.requestorId)?.name || ticket.requestorId}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {ticket.assigneeId ? (users.find(u => u.id === ticket.assigneeId)?.name || ticket.assigneeId) : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button 
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setSelectedTechnician(ticket.assigneeId || '');
                        setIsAssignModalOpen(true);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 text-xs font-mono uppercase tracking-wider transition-colors"
                    >
                      Dispatch
                    </button>
                    <Link
                      to={`/requests/${ticket.id}`}
                      className="text-indigo-400 hover:text-indigo-300 text-xs font-mono uppercase tracking-wider transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {paginatedTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm font-mono text-text-faint uppercase tracking-widest">
                    No tickets found.
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
      </div>

      {/* Assign Modal */}
      {isAssignModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">Dispatch Ticket</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-text-muted mb-4">Assign technician to <span className="text-text-main font-medium">{selectedTicket.title}</span></p>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Select Technician</label>
                <select 
                  value={selectedTechnician} 
                  onChange={e => setSelectedTechnician(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">-- Unassigned --</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint bg-bg-base flex justify-end gap-3">
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssign}
                className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] text-sm font-medium"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDeskDashboard;
