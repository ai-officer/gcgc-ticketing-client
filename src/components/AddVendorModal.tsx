import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Building2, User, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { Vendor } from '../types';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({ isOpen, onClose }) => {
  const { addVendor } = useAppContext();
  
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contractStatus, setContractStatus] = useState<'active' | 'pending' | 'expired'>('active');
  const [slaHours, setSlaHours] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVendor: Omit<Vendor, 'id'> = {
      name,
      specialty,
      contactName,
      phone,
      email,
      contractStatus,
      slaHours: parseInt(slaHours) || 24,
    };

    addVendor(newVendor);
    onClose();
    
    // Reset form
    setName('');
    setSpecialty('');
    setContactName('');
    setPhone('');
    setEmail('');
    setContractStatus('active');
    setSlaHours('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-bg-panel rounded-2xl border border-border-subtle shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-lg font-medium text-text-main flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-400" />
            Add New Vendor
          </h2>
          <button onClick={onClose} className="text-text-faint hover:text-text-main transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="vendor-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Company Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., Acme Plumbing Services"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Specialty *</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., Plumbing, HVAC, Electrical"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Primary Contact *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., Jane Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., contact@acme.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> Contract Status *
                </label>
                <select
                  required
                  value={contractStatus}
                  onChange={(e) => setContractStatus(e.target.value as any)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> SLA (Hours) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={slaHours}
                  onChange={(e) => setSlaHours(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g., 24"
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
            form="vendor-form"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-text-main rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            Add Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVendorModal;
