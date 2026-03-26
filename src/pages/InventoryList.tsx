import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, Search, Filter, Plus, AlertTriangle, MapPin } from 'lucide-react';
import AddInventoryModal from '../components/AddInventoryModal';
import { Pagination } from '../components/Pagination';

const InventoryList = () => {
  const { inventory, properties, locations } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = propertyFilter ? item.propertyId === propertyFilter : true;
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    
    return matchesSearch && matchesProperty && matchesCategory;
  });

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, propertyFilter, categoryFilter]);

  const categories = Array.from(new Set(inventory.map(i => i.category)));

  const getLocationString = (propertyId: string, locationId?: string) => {
    const prop = properties.find(p => p.id === propertyId);
    const loc = locations.find(l => l.id === locationId);
    return [prop?.name, loc?.name].filter(Boolean).join(' - ');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">Inventory <span className="font-bold">Management</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Spare Parts & Supplies</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-text-main rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-bg-panel p-4 rounded-xl border border-border-subtle flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-bg-base border border-border-subtle rounded-lg text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedInventory.map(item => {
          const isLowStock = item.quantity <= item.minQuantity;
          
          return (
            <div key={item.id} className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden hover:border-indigo-500/30 transition-colors group">
              <div className="p-5 border-b border-border-faint">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-bg-strong text-text-muted">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-text-main font-medium">{item.name}</h3>
                      <p className="text-xs font-mono text-text-faint">{item.sku}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-faint mb-1">Stock Level</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-light ${isLowStock ? 'text-red-400' : 'text-text-main'}`}>
                        {item.quantity}
                      </span>
                      <span className="text-xs text-text-faint">/ {item.minQuantity} min</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-faint mb-1">Unit Cost</p>
                    <p className="text-lg font-light text-text-main">₱{item.unitCost.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border-faint space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <MapPin className="h-3.5 w-3.5 text-text-faint" />
                    <span className="truncate">{getLocationString(item.propertyId, item.locationId)}</span>
                  </div>
                  {isLowStock && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Low stock alert! Reorder needed.</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-5 py-3 bg-bg-base flex justify-between items-center">
                <span className="text-xs font-mono text-text-faint">{item.category}</span>
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Adjust Stock
                </button>
              </div>
            </div>
          );
        })}
        
        {paginatedInventory.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-border-subtle rounded-xl">
            <Package className="h-8 w-8 text-text-fainter mx-auto mb-3" />
            <p className="text-sm font-mono text-text-faint uppercase tracking-widest">No items found</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddInventoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default InventoryList;
