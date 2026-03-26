import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Box, MapPin, Tag, Calendar, Building2 } from 'lucide-react';
import { Asset } from '../types';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose }) => {
  const { addAsset, properties, locations } = useAppContext();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyUntil, setWarrantyUntil] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAsset: Omit<Asset, 'id'> = {
      name,
      category,
      propertyId,
      locationId,
      status: 'active',
      serialNumber: serialNumber || undefined,
      manufacturer: manufacturer || undefined,
      model: model || undefined,
      purchaseDate: purchaseDate || undefined,
      warrantyExpiry: warrantyUntil || undefined,
    };

    addAsset(newAsset);
    onClose();
    
    // Reset form
    setName('');
    setCategory('');
    setPropertyId('');
    setLocationId('');
    setSerialNumber('');
    setManufacturer('');
    setModel('');
    setPurchaseDate('');
    setWarrantyUntil('');
  };

  const filteredLocations = locations.filter(l => l.propertyId === propertyId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-bg-panel rounded-2xl border border-border-subtle shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-lg font-medium text-text-main flex items-center gap-2">
            <Box className="h-5 w-5 text-indigo-400" />
            Add New Asset
          </h2>
          <button onClick={onClose} className="text-text-faint hover:text-text-main transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="asset-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., HVAC Unit Roof-1"
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
                  placeholder="e.g., HVAC, Plumbing, IT"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5" /> Serial Number
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., SN-123456789"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" /> Manufacturer
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., Carrier, Trane"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., XC20"
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
                  <MapPin className="h-3.5 w-3.5" /> Location *
                </label>
                <select
                  required
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

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" /> Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" /> Warranty Until
                </label>
                <input
                  type="date"
                  value={warrantyUntil}
                  onChange={(e) => setWarrantyUntil(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
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
            form="asset-form"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-text-main rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            Add Asset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;
