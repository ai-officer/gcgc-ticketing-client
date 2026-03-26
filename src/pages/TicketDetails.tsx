import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { format, isPast, differenceInHours } from 'date-fns';
import { ArrowLeft, Clock, User, Save, Terminal, CheckSquare, Square, Star, AlertTriangle, MapPin, Box, Package, Plus, Trash2, Building2 } from 'lucide-react';
import type { Worklog } from '../types';

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, tickets, users, updateTicket, addWorklog, properties, locations, assets, inventory, vendors } = useAppContext();

  const ticket = tickets.find((t) => t.id === id);

  const [ticketWorklogs, setTicketWorklogs] = useState<Worklog[]>([]);
  useEffect(() => {
    if (!id) return;
    api.tickets.getWorklogs(id).then(setTicketWorklogs).catch(() => {});
  }, [id]);

  const [newActivity, setNewActivity] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [status, setStatus] = useState(ticket?.status || 'open');
  const [assigneeId, setAssigneeId] = useState(ticket?.assigneeId || '');
  const [vendorId, setVendorId] = useState(ticket?.vendorId || '');
  const [vendorCost, setVendorCost] = useState(ticket?.vendorCost || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Parts used state
  const [partsUsed, setPartsUsed] = useState<{ inventoryId: string; quantity: number }[]>([]);
  
  // Photos state
  const [photos, setPhotos] = useState<string[]>([]);

  // Rating state
  const [ratingScore, setRatingScore] = useState(ticket?.rating?.score || 0);
  const [ratingFeedback, setRatingFeedback] = useState(ticket?.rating?.feedback || '');

  if (!ticket || !user) {
    return <div className="p-8 text-center text-sm font-mono text-text-faint uppercase tracking-widest">Entry not found or unauthorized.</div>;
  }

  const isAdminOrServiceDesk = user.role === 'admin' || user.role === 'service_desk';
  const isTechnician = user.role === 'technician';
  const isRequestor = user.role === 'requestor';

  const technicians = users.filter((u) => u.role === 'technician');

  const isOverdue = ticket.status !== 'resolved' && ticket.status !== 'closed' && ticket.slaDeadline && isPast(new Date(ticket.slaDeadline));
  const isApproachingSLA = ticket.status !== 'resolved' && ticket.status !== 'closed' && ticket.slaDeadline && !isPast(new Date(ticket.slaDeadline)) && differenceInHours(new Date(ticket.slaDeadline), new Date()) <= 2;

  const handleAddPart = () => {
    setPartsUsed([...partsUsed, { inventoryId: '', quantity: 1 }]);
  };

  const handleUpdatePart = (index: number, field: 'inventoryId' | 'quantity', value: string | number) => {
    const updatedParts = [...partsUsed];
    updatedParts[index] = { ...updatedParts[index], [field]: value };
    setPartsUsed(updatedParts);
  };

  const handleRemovePart = (index: number) => {
    setPartsUsed(partsUsed.filter((_, i) => i !== index));
  };

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPhotoFiles(prev => [...prev, ...newFiles]);
      const newPhotos = newFiles.map((file: File) => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    URL.revokeObjectURL(photos[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      await updateTicket(ticket.id, {
        status,
        assigneeId: assigneeId || undefined,
        vendorId: vendorId || undefined,
        vendorCost: vendorCost || undefined,
      });

      if (newActivity && timeSpent > 0) {
        const validParts = partsUsed.filter(p => p.inventoryId && p.quantity > 0);
        const form = new FormData();
        form.append('activity', newActivity);
        form.append('time_spent_minutes', String(timeSpent));
        if (validParts.length > 0) {
          form.append('parts_used', JSON.stringify(validParts));
        }
        photoFiles.forEach(file => form.append('photos', file));

        await addWorklog(ticket.id, form);
        // Refresh local worklogs after adding
        const updated = await api.tickets.getWorklogs(ticket.id);
        setTicketWorklogs(updated);
        setNewActivity('');
        setTimeSpent(0);
        setPartsUsed([]);
        setPhotos([]);
        setPhotoFiles([]);
      }
    } catch {
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTask = async (taskId: string | number) => {
    if (!ticket.tasks) return;
    const task = ticket.tasks.find(t => String(t.id) === String(taskId));
    if (!task) return;
    const newVal = !task.isCompleted;
    try {
      await api.tickets.toggleTask(ticket.id, taskId, newVal);
      await updateTicket(ticket.id, {});
    } catch {
      // silently ignore — optimistic UI will revert on next ticket load
    }
  };

  const handleSubmitRating = async () => {
    if (ratingScore > 0) {
      const { api: apiClient } = await import('../services/api');
      await apiClient.tickets.rate(ticket.id, ratingScore, ratingFeedback || undefined);
      await updateTicket(ticket.id, {});
    }
  };

  const property = properties.find(p => p.id === ticket.propertyId);
  const location = locations.find(l => l.id === ticket.locationId);
  const asset = assets.find(a => a.id === ticket.assetId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-faint hover:text-text-main transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Return
        </button>
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider border
          ${ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            ticket.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
            ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            ticket.status === 'assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            'bg-bg-subtle text-text-muted border-border-subtle'}`}>
          {ticket.status.replace('-', ' ')}
        </span>
      </div>

      <div className={`bg-bg-panel rounded-xl border ${isOverdue ? 'border-red-500/30' : isApproachingSLA ? 'border-amber-500/30' : 'border-border-subtle'} overflow-hidden relative`}>
        <div className={`absolute top-0 right-0 w-64 h-64 ${isOverdue ? 'bg-red-500/5' : isApproachingSLA ? 'bg-amber-500/5' : 'bg-indigo-500/5'} rounded-full blur-[80px] pointer-events-none`}></div>
        <div className="px-6 py-6 border-b border-border-faint relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-medium text-text-main">{ticket.title}</h1>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="h-3.5 w-3.5" /> SLA Breach
                </span>
              )}
              {isApproachingSLA && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="h-3.5 w-3.5" /> SLA Warning
                </span>
              )}
            </div>
            <span className="text-sm font-mono text-indigo-400">{ticket.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-faint uppercase tracking-wider">
            <p>
              {ticket.category} <span className="mx-2">•</span> Priority: <span className={`font-bold ${
                ticket.priority === 'critical' ? 'text-red-400' :
                ticket.priority === 'high' ? 'text-orange-400' :
                ticket.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>{ticket.priority}</span>
            </p>
            {(property || location || ticket.roomNumber) && (
              <div className="flex items-center gap-1.5 text-indigo-400/80 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                <MapPin className="h-3.5 w-3.5" />
                {[property?.name, location?.name, ticket.roomNumber ? `Rm ${ticket.roomNumber}` : null].filter(Boolean).join(' - ')}
              </div>
            )}
            {asset && (
              <div className="flex items-center gap-1.5 text-emerald-400/80 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                <Box className="h-3.5 w-3.5" />
                {asset.name} ({asset.serialNumber})
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-6 relative z-10">
          <h3 className="text-xs font-mono text-text-faint uppercase tracking-wider mb-4">Description</h3>
          <p className="text-text-tertiary whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
        </div>

        {/* Tasks / Checklist */}
        {ticket.tasks && ticket.tasks.length > 0 && (
          <div className="px-6 py-5 bg-bg-base border-t border-border-faint relative z-10">
            <h3 className="text-xs font-mono text-text-faint uppercase tracking-wider mb-4">Task Checklist</h3>
            <ul className="space-y-3">
              {ticket.tasks.map(task => (
                <li key={task.id} className="flex items-start gap-3">
                  <button 
                    onClick={() => (isAdminOrServiceDesk || isTechnician) && handleToggleTask(task.id)}
                    disabled={!isAdminOrServiceDesk && !isTechnician}
                    className={`mt-0.5 ${!isAdminOrServiceDesk && !isTechnician ? 'cursor-default opacity-50' : 'cursor-pointer hover:text-indigo-400 transition-colors'} ${task.isCompleted ? 'text-emerald-400' : 'text-text-faint'}`}
                  >
                    {task.isCompleted ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                  </button>
                  <span className={`text-sm ${task.isCompleted ? 'text-text-faint line-through' : 'text-text-tertiary'}`}>
                    {task.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="px-6 py-5 bg-bg-base border-t border-border-faint grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          <div>
            <h4 className="text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
              <User className="h-3 w-3" /> Requestor
            </h4>
            <p className="text-sm text-text-secondary font-medium">
              {users.find((u) => u.id === ticket.requestorId)?.name || 'Unknown'}
            </p>
            <p className="text-xs font-mono text-text-fainter mt-1">{format(new Date(ticket.createdAt), 'PPpp')}</p>
          </div>
          <div>
            <h4 className="text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
              <Terminal className="h-3 w-3" /> Assignee
            </h4>
            <p className="text-sm text-text-secondary font-medium">
              {users.find((u) => u.id === ticket.assigneeId)?.name || 'Unassigned'}
            </p>
            {ticket.slaDeadline && (
              <p className="text-xs font-mono text-text-fainter flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" /> SLA: {format(new Date(ticket.slaDeadline), 'PPp')}
              </p>
            )}
          </div>
          {ticket.vendorId && (
            <div>
              <h4 className="text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-2">
                <Building2 className="h-3 w-3" /> Vendor
              </h4>
              <p className="text-sm text-text-secondary font-medium">
                {vendors.find((v) => v.id === ticket.vendorId)?.name || 'Unknown Vendor'}
              </p>
              {ticket.vendorCost !== undefined && (
                <p className="text-xs font-mono text-emerald-400/80 flex items-center gap-1 mt-1">
                  Cost: ₱{ticket.vendorCost.toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Customer Rating Section (Visible when resolved/closed) */}
      {(ticket.status === 'resolved' || ticket.status === 'closed') && (
        <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden">
          <div className="px-6 py-5 border-b border-border-faint">
            <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Service Rating</h3>
          </div>
          <div className="p-6">
            {ticket.rating ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`h-6 w-6 ${star <= ticket.rating!.score ? 'text-amber-400 fill-amber-400' : 'text-text-faintest'}`} />
                  ))}
                  <span className="ml-2 text-sm font-mono text-text-muted">{ticket.rating.score} / 5</span>
                </div>
                {ticket.rating.feedback && (
                  <p className="text-sm text-text-tertiary italic bg-bg-subtle p-4 rounded-lg border border-border-faint">"{ticket.rating.feedback}"</p>
                )}
              </div>
            ) : isRequestor ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setRatingScore(star)} className="focus:outline-none hover:scale-110 transition-transform">
                      <Star className={`h-8 w-8 ${star <= ratingScore ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-text-faintest hover:text-amber-400/50'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={ratingFeedback}
                  onChange={(e) => setRatingFeedback(e.target.value)}
                  placeholder="Leave feedback on the service provided..."
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-text-faint"
                  rows={3}
                />
                <button
                  onClick={handleSubmitRating}
                  disabled={ratingScore === 0}
                  className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-sm font-medium hover:bg-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Rating
                </button>
              </div>
            ) : (
              <p className="text-sm font-mono text-text-faint uppercase tracking-widest">Pending customer rating.</p>
            )}
          </div>
        </div>
      )}

      {/* Admin / Technician Controls */}
      {(isAdminOrServiceDesk || isTechnician) && (
        <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden">
          <div className="px-6 py-5 border-b border-border-faint">
            <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Update Entry</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {isAdminOrServiceDesk && (
                <>
                  <div>
                    <label htmlFor="assignee" className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Assignee</label>
                    <select
                      id="assignee"
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    >
                      <option value="">Unassigned</option>
                      {technicians.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vendor" className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Vendor</label>
                    <select
                      id="vendor"
                      value={vendorId}
                      onChange={(e) => setVendorId(e.target.value)}
                      className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    >
                      <option value="">No Vendor Assigned</option>
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  {vendorId && (
                    <div>
                      <label htmlFor="vendorCost" className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Vendor Cost (₱)</label>
                      <input
                        type="number"
                        id="vendorCost"
                        min="0"
                        step="0.01"
                        value={vendorCost}
                        onChange={(e) => setVendorCost(parseFloat(e.target.value) || 0)}
                        className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {isTechnician && (
              <div className="space-y-4 border-t border-border-faint pt-6">
                <h4 className="text-sm font-mono text-text-muted uppercase tracking-widest">Log Activity</h4>
                <div>
                  <label htmlFor="activity" className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Activity Description</label>
                  <textarea
                    id="activity"
                    rows={3}
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-text-faint"
                    placeholder="Describe actions taken..."
                  />
                </div>
                <div>
                  <label htmlFor="timeSpent" className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Time Spent (minutes)</label>
                  <input
                    type="number"
                    id="timeSpent"
                    min="0"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(parseInt(e.target.value) || 0)}
                    className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>

                {/* Parts Used Section */}
                <div className="pt-4 border-t border-border-faint">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-mono text-text-faint uppercase tracking-wider">Parts Used</h4>
                    <button
                      onClick={handleAddPart}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-subtle hover:bg-bg-strong text-text-tertiary rounded-lg text-xs font-medium transition-colors border border-border-subtle"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Part
                    </button>
                  </div>
                  
                  {partsUsed.length > 0 ? (
                    <div className="space-y-3">
                      {partsUsed.map((part, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1">
                            <select
                              value={part.inventoryId}
                              onChange={(e) => handleUpdatePart(index, 'inventoryId', e.target.value)}
                              className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            >
                              <option value="">Select Part...</option>
                              {inventory.map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.name} ({item.sku}) - {item.quantity} in stock
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-24">
                            <input
                              type="number"
                              min="1"
                              value={part.quantity}
                              onChange={(e) => handleUpdatePart(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            />
                          </div>
                          <button
                            onClick={() => handleRemovePart(index)}
                            className="p-2 text-text-faint hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-fainter italic">No parts added to this log.</p>
                  )}
                </div>

                {/* Photo Upload Section */}
                <div className="pt-4 border-t border-border-faint">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-mono text-text-faint uppercase tracking-wider">Photos</h4>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-subtle hover:bg-bg-strong text-text-tertiary rounded-lg text-xs font-medium transition-colors border border-border-subtle cursor-pointer">
                      <Plus className="h-3.5 w-3.5" />
                      Add Photo
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                  
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border-subtle">
                          <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemovePhoto(index)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-text-main rounded-md opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-fainter italic">No photos uploaded.</p>
                  )}
                </div>
              </div>
            )}

            {saveError && (
              <p className="text-xs font-mono text-red-400 text-right">{saveError}</p>
            )}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-text-main bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Commit Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Worklogs */}
      <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border-faint">
          <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Activity Log</h3>
        </div>
        <div className="divide-y divide-white/5">
          {ticketWorklogs.length > 0 ? (
            ticketWorklogs.map((log) => (
              <div key={log.id} className="p-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center">
                      <Terminal className="h-4 w-4 text-indigo-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium text-text-secondary">
                        {users.find((u) => u.id === log.technicianId)?.name || 'Unknown'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-text-muted leading-relaxed">
                      <p>{log.activity}</p>
                    </div>
                    {log.partsUsed && log.partsUsed.length > 0 && (
                      <div className="mt-3 bg-bg-subtle border border-border-subtle rounded-lg p-3">
                        <h5 className="text-xs font-mono text-text-faint uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5" /> Parts Used
                        </h5>
                        <ul className="space-y-1">
                          {log.partsUsed.map((part, idx) => {
                            const item = inventory.find(i => i.id === part.inventoryId);
                            return (
                              <li key={idx} className="text-sm text-text-tertiary flex items-center justify-between">
                                <span>{item ? item.name : 'Unknown Part'} {item && <span className="text-xs text-text-faint font-mono">({item.sku})</span>}</span>
                                <span className="font-mono text-text-muted">x{part.quantity}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    {log.photos && log.photos.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Attached Photos</h5>
                        <div className="flex flex-wrap gap-2">
                          {log.photos.map((photo, idx) => (
                            <a key={idx} href={photo} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-lg overflow-hidden border border-border-subtle hover:border-indigo-500 transition-colors">
                              <img src={photo} alt={`Log attachment ${idx + 1}`} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-3 text-xs font-mono text-text-fainter flex items-center gap-4">
                      <span>{format(new Date(log.createdAt), 'PPp')}</span>
                      <span className="flex items-center gap-1.5 text-indigo-400/70">
                        <Clock className="h-3 w-3" /> {log.timeSpentMinutes} MINS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm font-mono text-text-faint uppercase tracking-widest">No activity logged yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
