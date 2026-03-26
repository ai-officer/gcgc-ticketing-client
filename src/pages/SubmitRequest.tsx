import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Save, X } from 'lucide-react';

const SubmitRequest = () => {
  const { user, categories, addTicket, requestTemplates, properties, locations, assets } = useAppContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [assetId, setAssetId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tplId = e.target.value;
    setSelectedTemplate(tplId);
    
    if (tplId) {
      const tpl = requestTemplates.find(t => t.id === tplId);
      if (tpl) {
        setTitle(tpl.name);
        setDescription(tpl.description);
        setCategory(tpl.category);
        setPriority(tpl.priority as any);
      }
    } else {
      setTitle('');
      setDescription('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await addTicket({
        title,
        description,
        category,
        priority,
        status: 'open',
        requestorId: user.id,
        propertyId: propertyId || undefined,
        locationId: locationId || undefined,
        roomNumber: roomNumber || undefined,
        assetId: assetId || undefined,
      });
      navigate('/my-requests');
    } catch {
      setSubmitError('Failed to submit request. Please try again.');
      setIsSubmitting(false);
    }
  };

  const filteredLocations = locations.filter(l => l.propertyId === propertyId);
  const filteredAssets = assets.filter(a => (!propertyId || a.propertyId === propertyId) && (!locationId || a.locationId === locationId));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-text-main">New <span className="font-bold">Entry</span></h1>
        <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Initialize Service Request</p>
      </div>

      <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
          <div>
            <label htmlFor="template" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              Quick Template (Optional)
            </label>
            <select
              id="template"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="">-- Select a Template --</option>
              {requestTemplates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-border-faint pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="property" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Property / Brand
              </label>
              <select
                id="property"
                value={propertyId}
                onChange={(e) => {
                  setPropertyId(e.target.value);
                  setLocationId('');
                  setAssetId('');
                }}
                className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="">-- Select Property --</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Branch Location
              </label>
              <select
                id="location"
                value={locationId}
                onChange={(e) => {
                  setLocationId(e.target.value);
                  setAssetId('');
                }}
                disabled={!propertyId}
                className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                <option value="">-- Select Branch --</option>
                {filteredLocations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="roomNumber" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Room / Area
              </label>
              <input
                type="text"
                id="roomNumber"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-text-faint"
                placeholder="e.g., 204, Lobby"
              />
            </div>

            <div>
              <label htmlFor="asset" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Asset / Equipment
              </label>
              <select
                id="asset"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="">-- Select Asset --</option>
                {filteredAssets.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.serialNumber})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-border-faint pt-6">
            <label htmlFor="title" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-text-faint"
              placeholder="Brief summary of the issue"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-text-faint"
              placeholder="Detailed description of the problem, location, etc."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Priority
              </label>
              <select
                id="priority"
                required
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="low">Low - Minor issue, no immediate impact</option>
                <option value="medium">Medium - Standard service request</option>
                <option value="high">High - Significant impact on operations</option>
                <option value="critical">Critical - Emergency, immediate action required</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-border-faint flex items-center justify-end gap-4">
            {submitError && (
              <p className="text-xs font-mono text-red-400 mr-auto">{submitError}</p>
            )}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors"
            >
              <X className="h-4 w-4" />
              Abort
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-text-main bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitRequest;
