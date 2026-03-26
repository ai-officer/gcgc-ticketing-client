import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { Filter, Search, ChevronRight, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { format, isPast, differenceInHours } from 'date-fns';
import { Pagination } from '../components/Pagination';

const TicketList = () => {
  const { user, tickets, users, properties, locations } = useAppContext();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!user) return null;

  const isMyRequests = location.pathname === '/my-requests';
  const isMyTasks = location.pathname === '/tasks';
  const isAdminOrServiceDesk = user.role === 'admin' || user.role === 'service_desk';

  let filteredTickets = tickets;

  if (isMyRequests) {
    filteredTickets = tickets.filter((t) => t.requestorId === user.id);
  } else if (isMyTasks) {
    filteredTickets = tickets.filter((t) => t.assigneeId === user.id);
  }

  if (searchTerm) {
    filteredTickets = filteredTickets.filter(
      (t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter !== 'all') {
    filteredTickets = filteredTickets.filter((t) => t.status === statusFilter);
  }

  if (propertyFilter !== 'all') {
    filteredTickets = filteredTickets.filter((t) => t.propertyId === propertyFilter);
  }

  if (locationFilter !== 'all') {
    filteredTickets = filteredTickets.filter((t) => t.locationId === locationFilter);
  }

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, propertyFilter, locationFilter]);

  const getAssigneeName = (id?: string) => {
    if (!id) return 'Unassigned';
    return users.find((u) => u.id === id)?.name || 'Unknown';
  };

  const getRequestorName = (id: string) => {
    return users.find((u) => u.id === id)?.name || 'Unknown';
  };

  const getLocationString = (ticket: any) => {
    const prop = properties.find(p => p.id === ticket.propertyId);
    const loc = locations.find(l => l.id === ticket.locationId);
    if (!prop && !loc) return '';
    const parts = [];
    if (prop) parts.push(prop.name);
    if (loc) parts.push(loc.name);
    if (ticket.roomNumber) parts.push(`Rm ${ticket.roomNumber}`);
    return parts.join(' - ');
  };

  const isOverdue = (ticket: any) => {
    if (ticket.status === 'resolved' || ticket.status === 'closed') return false;
    if (!ticket.slaDeadline) return false;
    return isPast(new Date(ticket.slaDeadline));
  };

  const isApproachingSLA = (ticket: any) => {
    if (ticket.status === 'resolved' || ticket.status === 'closed') return false;
    if (!ticket.slaDeadline) return false;
    if (isPast(new Date(ticket.slaDeadline))) return false; // Already overdue
    const hoursLeft = differenceInHours(new Date(ticket.slaDeadline), new Date());
    return hoursLeft <= 2; // Approaching if <= 2 hours left
  };

  const filteredLocations = locations.filter(l => propertyFilter === 'all' || l.propertyId === propertyFilter);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">
            {isMyRequests ? 'My Logs' : isMyTasks ? 'Active Tasks' : 'Operations Matrix'}
          </h1>
          <p className="mt-1 text-sm font-mono text-text-faint uppercase tracking-widest">
            System Registry
          </p>
        </div>
        {isMyRequests && (
          <div className="mt-4 sm:mt-0">
            <Link
              to="/submit"
              className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-text-main shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all sm:w-auto"
            >
              New Entry
            </Link>
          </div>
        )}
      </div>

      <div className="bg-bg-panel p-4 rounded-xl border border-border-subtle flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between relative z-10">
          <div className="relative w-full sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-text-faint" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-lg bg-bg-base border border-border-subtle pl-10 py-2 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-text-faint"
              placeholder="Search registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-text-faint" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2 pl-3 pr-8 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <select
              value={propertyFilter}
              onChange={(e) => {
                setPropertyFilter(e.target.value);
                setLocationFilter('all');
              }}
              className="block w-full sm:w-auto rounded-lg bg-bg-base border border-border-subtle py-2 pl-3 pr-8 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="all">All Properties</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              disabled={propertyFilter === 'all'}
              className="block w-full sm:w-auto rounded-lg bg-bg-base border border-border-subtle py-2 pl-3 pr-8 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              <option value="all">All Branches</option>
              {filteredLocations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative">
        <ul role="list" className="divide-y divide-white/5 relative z-10">
          {paginatedTickets.length > 0 ? (
            paginatedTickets.map((ticket) => {
              const overdue = isOverdue(ticket);
              const approaching = isApproachingSLA(ticket);
              const locationStr = getLocationString(ticket);
              
              return (
                <li key={ticket.id} className={overdue ? 'bg-red-500/5' : approaching ? 'bg-amber-500/5' : ''}>
                  <Link
                    to={isMyRequests ? `/my-requests/${ticket.id}` : isMyTasks ? `/tasks/${ticket.id}` : `/requests/${ticket.id}`}
                    className="block hover:bg-bg-hover transition-colors"
                  >
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="truncate">
                          <div className="flex text-sm items-center">
                            <p className="font-mono text-indigo-400 truncate">{ticket.id}</p>
                            <p className="ml-2 flex-shrink-0 font-mono text-xs text-text-faint uppercase tracking-wider">
                              / {ticket.category}
                            </p>
                            {overdue && (
                              <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                                <AlertTriangle className="h-3 w-3" /> SLA Breach
                              </span>
                            )}
                            {approaching && (
                              <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Clock className="h-3 w-3" /> SLA Warning
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm gap-2">
                            <p className="font-medium text-text-secondary truncate">{ticket.title}</p>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border w-fit
                              ${ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                ticket.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                ticket.status === 'assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-bg-subtle text-text-muted border-border-subtle'}`}>
                              {ticket.status.replace('-', ' ')}
                            </span>
                          </div>
                          {locationStr && (
                            <div className="mt-2 flex items-center text-xs font-mono text-text-faint">
                              <MapPin className="h-3 w-3 mr-1" />
                              {locationStr}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                          <div className="flex -space-x-1 overflow-hidden sm:justify-end">
                            <div className="flex flex-col items-end text-xs font-mono text-text-faint space-y-1">
                              <p>LOGGED: {format(new Date(ticket.createdAt), 'MMM d, yyyy')}</p>
                              {isAdminOrServiceDesk && <p className="text-text-muted">REQ: {getRequestorName(ticket.requestorId)}</p>}
                              {(isAdminOrServiceDesk || isMyRequests) && <p className="text-text-muted">TECH: {getAssigneeName(ticket.assigneeId)}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <ChevronRight className="h-5 w-5 text-text-fainter" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })
          ) : (
            <li className="px-4 py-12 text-center">
              <p className="text-sm font-mono text-text-faint uppercase tracking-widest">No entries found matching criteria.</p>
            </li>
          )}
        </ul>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TicketList;
