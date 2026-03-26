import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Download, Filter, Calendar, FileDown, Clock, Plus, Settings } from 'lucide-react';
import { format, subDays, isAfter, isBefore } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pagination } from '../components/Pagination';

const Reports = () => {
  const { tickets, users } = useAppContext();
  const [dateRange, setDateRange] = useState('30'); // '7', '30', '90', 'all'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'export' | 'custom' | 'scheduled'>('export');
  
  // Custom Report State
  const [customReportName, setCustomReportName] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>(['id', 'title', 'status', 'createdAt']);
  const availableFields = ['id', 'title', 'category', 'priority', 'status', 'createdAt', 'resolvedAt', 'requestorId', 'assigneeId', 'cost'];

  // Scheduled Report State
  const [scheduledReports, setScheduledReports] = useState([
    { id: '1', name: 'Weekly Summary', frequency: 'weekly', format: 'pdf', recipients: 'admin@gcgc.com' }
  ]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ name: '', frequency: 'weekly', format: 'pdf', recipients: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getFilteredTickets = () => {
    let filtered = tickets;

    if (dateRange !== 'all') {
      const cutoffDate = subDays(new Date(), parseInt(dateRange));
      filtered = filtered.filter(t => isAfter(new Date(t.createdAt), cutoffDate));
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    return filtered;
  };

  const filteredTickets = getFilteredTickets();

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, categoryFilter]);

  const generateCSV = () => {
    const headers = selectedFields.map(f => f.charAt(0).toUpperCase() + f.slice(1));
    const rows = filteredTickets.map(t => {
      return selectedFields.map(field => {
        if (field === 'requestorId') return `"${users.find(u => u.id === t.requestorId)?.name || 'Unknown'}"`;
        if (field === 'assigneeId') return `"${users.find(u => u.id === t.assigneeId)?.name || 'Unassigned'}"`;
        if (field === 'createdAt' || field === 'resolvedAt') return t[field] ? format(new Date(t[field] as string), 'yyyy-MM-dd HH:mm') : '';
        if (field === 'title') return `"${(t[field] as string).replace(/"/g, '""')}"`;
        return t[field as keyof typeof t] || '';
      }).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${customReportName || 'GCG_Operations_Report'}_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(customReportName || 'GCG Service Operations Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 30);
    doc.text(`Filters: ${dateRange === 'all' ? 'All Time' : `Last ${dateRange} Days`} | Category: ${categoryFilter === 'all' ? 'All' : categoryFilter}`, 14, 36);

    const tableColumn = selectedFields.map(f => f.charAt(0).toUpperCase() + f.slice(1));
    const tableRows = [];

    filteredTickets.forEach(ticket => {
      const ticketData = selectedFields.map(field => {
        if (field === 'requestorId') return users.find(u => u.id === ticket.requestorId)?.name || 'Unknown';
        if (field === 'assigneeId') return users.find(u => u.id === ticket.assigneeId)?.name || 'Unassigned';
        if (field === 'createdAt' || field === 'resolvedAt') return ticket[field] ? format(new Date(ticket[field] as string), 'yyyy-MM-dd') : '';
        return ticket[field as keyof typeof ticket] || '';
      });
      tableRows.push(ticketData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
    });

    doc.save(`${customReportName || 'GCG_Operations_Report'}_${format(new Date(), 'yyyyMMdd')}.pdf`);
  };

  const toggleField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleAddSchedule = () => {
    if (newSchedule.name && newSchedule.recipients) {
      setScheduledReports([...scheduledReports, { id: Date.now().toString(), ...newSchedule }]);
      setIsScheduleModalOpen(false);
      setNewSchedule({ name: '', frequency: 'weekly', format: 'pdf', recipients: '' });
    }
  };

  const categories = Array.from(new Set(tickets.map(t => t.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-text-main">System <span className="font-bold">Reports</span></h1>
        <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Data Extraction & Analysis</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle">
        <button
          onClick={() => setActiveTab('export')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'export' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          Standard Export
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'custom' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          Custom Builder
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'scheduled' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          Scheduled Reports
        </button>
      </div>

      <div className="bg-bg-panel p-6 rounded-xl border border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          {/* Common Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-end justify-between border-b border-border-faint pb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Timeframe
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2 pl-3 pr-10 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Filter className="h-3 w-3" /> Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2 pl-3 pr-10 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeTab !== 'scheduled' && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={generateCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-tertiary bg-bg-base border border-border-subtle hover:bg-bg-subtle transition-colors w-full sm:w-auto justify-center"
                >
                  <FileDown className="h-4 w-4" />
                  CSV
                </button>
                <button
                  onClick={generatePDF}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-main bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] w-full sm:w-auto justify-center"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            )}
          </div>

          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Report Name</label>
                <input 
                  type="text" 
                  value={customReportName}
                  onChange={e => setCustomReportName(e.target.value)}
                  placeholder="e.g., Monthly Performance Report"
                  className="block w-full max-w-md rounded-lg bg-bg-base border border-border-subtle py-2 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Select Fields to Include</label>
                <div className="flex flex-wrap gap-2">
                  {availableFields.map(field => (
                    <button
                      key={field}
                      onClick={() => toggleField(field)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider border transition-colors ${
                        selectedFields.includes(field) 
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                          : 'bg-bg-base border-border-subtle text-text-faint hover:border-border-strong hover:text-text-main'
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Active Schedules</h3>
                <button 
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 rounded hover:bg-indigo-600/30 transition-colors text-xs font-mono uppercase tracking-wider"
                >
                  <Plus className="h-3 w-3" /> New Schedule
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledReports.map(schedule => (
                  <div key={schedule.id} className="bg-bg-base border border-border-subtle rounded-lg p-4 relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button className="text-text-faint hover:text-indigo-400"><Settings className="h-4 w-4" /></button>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Clock className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-text-secondary">{schedule.name}</h4>
                        <p className="text-xs font-mono text-text-faint uppercase">{schedule.frequency}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-text-muted">
                      <p><span className="text-text-faint">Format:</span> {schedule.format.toUpperCase()}</p>
                      <p><span className="text-text-faint">To:</span> {schedule.recipients}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'scheduled' && (
            <div className="border-t border-border-faint pt-6">
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-4">Report Preview ({filteredTickets.length} records)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5">
                  <thead>
                    <tr>
                      {selectedFields.map(field => (
                        <th key={field} scope="col" className="px-3 py-3 text-left text-xs font-mono text-text-faint uppercase tracking-wider">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-bg-hover transition-colors">
                        {selectedFields.map(field => (
                          <td key={field} className="whitespace-nowrap px-3 py-3 text-sm text-text-tertiary truncate max-w-xs">
                            {field === 'requestorId' ? users.find(u => u.id === ticket.requestorId)?.name || 'Unknown' :
                             field === 'assigneeId' ? users.find(u => u.id === ticket.assigneeId)?.name || 'Unassigned' :
                             field === 'createdAt' || field === 'resolvedAt' ? (ticket[field] ? format(new Date(ticket[field] as string), 'MMM d, yyyy') : '') :
                             field === 'status' ? (
                               <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border
                                ${ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  ticket.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                  ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  ticket.status === 'assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                  'bg-bg-subtle text-text-muted border-border-subtle'}`}>
                                {ticket.status.replace('-', ' ')}
                              </span>
                             ) :
                             ticket[field as keyof typeof ticket] || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {paginatedTickets.length === 0 && (
                      <tr>
                        <td colSpan={selectedFields.length} className="px-3 py-8 text-center text-sm font-mono text-text-faint uppercase tracking-widest">
                          No records found for the selected criteria.
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
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">Schedule Report</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Schedule Name</label>
                <input 
                  type="text" 
                  value={newSchedule.name} 
                  onChange={e => setNewSchedule({...newSchedule, name: e.target.value})}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., Weekly Operations Summary"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Frequency</label>
                <select 
                  value={newSchedule.frequency} 
                  onChange={e => setNewSchedule({...newSchedule, frequency: e.target.value})}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Format</label>
                <select 
                  value={newSchedule.format} 
                  onChange={e => setNewSchedule({...newSchedule, format: e.target.value})}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Recipients (comma separated)</label>
                <input 
                  type="text" 
                  value={newSchedule.recipients} 
                  onChange={e => setNewSchedule({...newSchedule, recipients: e.target.value})}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="admin@gcgc.com, manager@gcgc.com"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
              <button 
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSchedule}
                disabled={!newSchedule.name || !newSchedule.recipients}
                className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
