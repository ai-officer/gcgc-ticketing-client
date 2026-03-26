import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Plus, Building2, Phone, Mail, Star, AlertTriangle, CheckCircle, User } from 'lucide-react';
import AddVendorModal from '../components/AddVendorModal';
import { Pagination } from '../components/Pagination';

const VendorList = () => {
  const { vendors } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  let filteredVendors = vendors;

  if (searchTerm) {
    filteredVendors = filteredVendors.filter(
      (v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter !== 'all') {
    filteredVendors = filteredVendors.filter((v) => v.contractStatus === statusFilter);
  }

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">Vendor <span className="font-bold">Directory</span></h1>
          <p className="mt-1 text-sm font-mono text-text-faint uppercase tracking-widest">
            External Service Providers
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-text-main shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </button>
        </div>
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
              className="block w-full rounded-lg bg-bg-base border border-border-subtle pl-10 py-2 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-text-faint"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2 pl-3 pr-8 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedVendors.map((vendor) => (
          <div key={vendor.id} className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden hover:border-indigo-500/50 transition-colors group">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-text-main group-hover:text-indigo-400 transition-colors">{vendor.name}</h3>
                    <p className="text-xs font-mono text-text-faint uppercase tracking-wider">{vendor.specialty}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border
                  ${vendor.contractStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    vendor.contractStatus === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {vendor.contractStatus}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <User className="h-4 w-4 text-text-faint" />
                  <span>{vendor.contactName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <Phone className="h-4 w-4 text-text-faint" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <Mail className="h-4 w-4 text-text-faint" />
                  <span>{vendor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>SLA: {vendor.slaHours} Hours</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint bg-bg-hover flex justify-end">
              <button className="text-xs font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">
                View Details &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddVendorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default VendorList;
