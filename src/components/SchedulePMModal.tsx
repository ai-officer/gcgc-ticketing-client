import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Calendar, MapPin, Box, User, Clock, AlertTriangle } from 'lucide-react';
import { PreventiveMaintenance } from '../types';

interface SchedulePMModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulePMModal: React.FC<SchedulePMModalProps> = ({ isOpen, onClose }) => {
  const { addPreventiveMaintenance, properties, locations, assets, users } = useAppContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually'>('monthly');
  const [nextDueDate, setNextDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPM: Omit<PreventiveMaintenance, 'id'> = {
      title,
      description,
      propertyId,
      locationId: locationId || undefined,
      assetId: assetId || undefined,
      frequency,
      nextDueDate: new Date(nextDueDate).toISOString(),
      status: 'active',
      assignedTo: assignedTo || undefined,
    };

    addPreventiveMaintenance(newPM);
    onClose();
    
    // Reset form
    setTitle('');
    setDescription('');
    setPropertyId('');
    setLocationId('');
    setAssetId('');
    setFrequency('monthly');
    setNextDueDate('');
    setAssignedTo('');
  };

  const technicians = users.filter(u => u.role === 'technician');
  const filteredLocations = locations.filter(l => l.propertyId === propertyId);
  const filteredAssets = assets.filter(a => 
    (!propertyId || a.propertyId === propertyId) && 
    (!locationId || a.locationId === locationId)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-bg-panel rounded-2xl border border-border-subtle shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-lg font-medium text-text-main flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-400" />
            Schedule Preventive Maintenance
          </h2>
          <button onClick={onClose} className="text-text-faint hover:text-text-main transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="pm-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., Monthly HVAC Inspection"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Detailed instructions or checklist..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    setAssetId('');
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
                  <MapPin className="h-3.5 w-3.5" /> Location
                </label>
                <select
                  value={locationId}
                  onChange={(e) => {
                    setLocationId(e.target.value);
                    setAssetId('');
                  }}
                  disabled={!propertyId}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                >
                  <option value="">All Locations</option>
                  {filteredLocations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Box className="h-3.5 w-3.5" /> Asset
                </label>
                <select
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  disabled={!propertyId}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                >
                  <option value="">No Specific Asset</option>
                  {filteredAssets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.serialNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Default Assignee
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="">Unassigned</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> Frequency *
                </label>
                <select
                  required
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="biannually">Biannually</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" /> First Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
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
            form="pm-form"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-text-main rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            Schedule PM
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePMModal;
