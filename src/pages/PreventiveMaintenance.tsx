import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Plus, Search, Filter, Clock, MapPin, Box, CheckCircle2 } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import SchedulePMModal from '../components/SchedulePMModal';
import { Pagination } from '../components/Pagination';

const PreventiveMaintenanceList = () => {
  const { preventiveMaintenances, assets, properties, locations, users } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPMs = preventiveMaintenances.filter(pm => {
    const matchesSearch = pm.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? pm.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPMs.length / itemsPerPage);
  const paginatedPMs = filteredPMs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getLocationString = (propertyId: string, locationId?: string) => {
    const prop = properties.find(p => p.id === propertyId);
    const loc = locations.find(l => l.id === locationId);
    return [prop?.name, loc?.name].filter(Boolean).join(' - ');
  };

  const getAssetString = (assetId?: string) => {
    if (!assetId) return null;
    const asset = assets.find(a => a.id === assetId);
    return asset ? asset.name : null;
  };

  const getAssigneeName = (userId?: string) => {
    if (!userId) return 'Unassigned';
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">Preventive <span className="font-bold">Maintenance</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Scheduled Tasks & Inspections</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-text-main rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
        >
          <Plus className="h-4 w-4" />
          Schedule PM
        </button>
      </div>

      {/* Filters */}
      <div className="bg-bg-panel p-4 rounded-xl border border-border-subtle flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <input
            type="text"
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-base border border-border-subtle rounded-lg text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-text-faint"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-bg-base border border-border-subtle rounded-lg text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* PM List */}
      <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-faint bg-bg-hover">
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Location / Asset</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Next Due</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedPMs.map(pm => {
                const isOverdue = isPast(parseISO(pm.nextDueDate));
                const assetName = getAssetString(pm.assetId);
                
                return (
                  <tr key={pm.id} className="hover:bg-bg-hover transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-main">{pm.title}</p>
                          <p className="text-xs text-text-faint truncate max-w-[200px]">{pm.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-text-tertiary">
                          <MapPin className="h-3.5 w-3.5 text-text-faint" />
                          <span className="truncate max-w-[150px]">{getLocationString(pm.propertyId, pm.locationId)}</span>
                        </div>
                        {assetName && (
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Box className="h-3.5 w-3.5 text-text-faint" />
                            <span className="truncate max-w-[150px]">{assetName}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-text-muted capitalize">{pm.frequency}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className={`h-3.5 w-3.5 ${isOverdue ? 'text-red-400' : 'text-text-faint'}`} />
                        <span className={`text-sm ${isOverdue ? 'text-red-400 font-medium' : 'text-text-tertiary'}`}>
                          {format(parseISO(pm.nextDueDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-tertiary">{getAssigneeName(pm.assignedTo)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border ${
                        pm.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-bg-subtle text-text-muted border-border-subtle'
                      }`}>
                        {pm.status === 'active' && <CheckCircle2 className="h-3 w-3" />}
                        {pm.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {paginatedPMs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center border-dashed border-border-subtle">
                    <Calendar className="h-8 w-8 text-text-fainter mx-auto mb-3" />
                    <p className="text-sm font-mono text-text-faint uppercase tracking-widest">No schedules found</p>
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

      <SchedulePMModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default PreventiveMaintenanceList;
