import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Box, Search, Filter, Plus, MapPin, Wrench, AlertCircle } from 'lucide-react';
import AddAssetModal from '../components/AddAssetModal';
import { Pagination } from '../components/Pagination';

const AssetList = () => {
  const { assets, properties, locations } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = propertyFilter ? asset.propertyId === propertyFilter : true;
    const matchesStatus = statusFilter ? asset.status === statusFilter : true;
    
    return matchesSearch && matchesProperty && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, propertyFilter, statusFilter]);

  const getLocationString = (propertyId: string, locationId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    const loc = locations.find(l => l.id === locationId);
    return [prop?.name, loc?.name].filter(Boolean).join(' - ');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">Asset <span className="font-bold">Registry</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Manage Equipment & Inventory</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-text-main rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
        >
          <Plus className="h-4 w-4" />
          Add Asset
        </button>
      </div>

      {/* Filters */}
      <div className="bg-bg-panel p-4 rounded-xl border border-border-subtle flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <input
            type="text"
            placeholder="Search by name or serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-base border border-border-subtle rounded-lg text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-text-faint"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-bg-base border border-border-subtle rounded-lg text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
            >
              <option value="">All Properties</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-bg-base border border-border-subtle rounded-lg text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedAssets.map(asset => (
          <div key={asset.id} className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden hover:border-indigo-500/30 transition-colors group">
            <div className="p-5 border-b border-border-faint">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    asset.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    asset.status === 'maintenance' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-bg-subtle text-text-muted'
                  }`}>
                    <Box className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-text-main font-medium">{asset.name}</h3>
                    <p className="text-xs font-mono text-text-faint">{asset.serialNumber || 'No SN'}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border ${
                  asset.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  asset.status === 'maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-bg-subtle text-text-muted border-border-subtle'
                }`}>
                  {asset.status}
                </span>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <MapPin className="h-3.5 w-3.5 text-text-faint" />
                  <span className="truncate">{getLocationString(asset.propertyId, asset.locationId)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Wrench className="h-3.5 w-3.5 text-text-faint" />
                  <span>Next PM: {asset.nextMaintenance || 'Not scheduled'}</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-bg-base flex justify-between items-center">
              <span className="text-xs font-mono text-text-faint">{asset.category}</span>
              <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
        
        {paginatedAssets.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-border-subtle rounded-xl">
            <Box className="h-8 w-8 text-text-fainter mx-auto mb-3" />
            <p className="text-sm font-mono text-text-faint uppercase tracking-widest">No assets found</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddAssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default AssetList;
