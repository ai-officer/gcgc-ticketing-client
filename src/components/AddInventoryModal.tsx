import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Package, MapPin, Tag, DollarSign, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../types';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ isOpen, onClose }) => {
  const { addInventoryItem, properties, locations } = useAppContext();
  
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [minQuantity, setMinQuantity] = useState(0);
  const [unit, setUnit] = useState('pcs');
  const [unitCost, setUnitCost] = useState(0);
  const [propertyId, setPropertyId] = useState('');
  const [locationId, setLocationId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: Omit<InventoryItem, 'id'> = {
      name,
      sku,
      category,
      quantity,
      minQuantity,
      unitCost,
      propertyId,
      locationId: locationId || undefined,
    };

    addInventoryItem(newItem);
    onClose();
    
    // Reset form
    setName('');
    setSku('');
    setCategory('');
    setQuantity(0);
    setMinQuantity(0);
    setUnit('pcs');
    setUnitCost(0);
    setPropertyId('');
    setLocationId('');
  };

  const filteredLocations = locations.filter(l => l.propertyId === propertyId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-bg-panel rounded-2xl border border-border-subtle shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-lg font-medium text-text-main flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-400" />
            Add Inventory Item
          </h2>
          <button onClick={onClose} className="text-text-faint hover:text-text-main transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="inventory-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Item Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., Air Filter 20x20x1"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5" /> SKU / Part Number *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., AF-20201"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Category *</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., HVAC, Plumbing, Electrical"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Current Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" /> Minimum Quantity (Alert) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(parseInt(e.target.value) || 0)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Unit of Measure *</label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., pcs, boxes, rolls, gallons"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5" /> Unit Cost ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={unitCost}
                  onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> Property *
                </label>
                <select
                  required
                  value={propertyId}
                  onChange={(e) => {
                    setPropertyId(e.target.value);
                    setLocationId('');
                  }}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="">Select Property</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> Storage Location
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  disabled={!propertyId}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                >
                  <option value="">Select Location</option>
                  {filteredLocations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border-subtle bg-bg-hover flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="inventory-form"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-text-main rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInventoryModal;
