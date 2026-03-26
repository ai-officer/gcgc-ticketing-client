import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Shield, UserPlus, Key, Mail, Megaphone, Activity, Plus, Palette, Blocks, Bell, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Pagination } from '../components/Pagination';

const AdminSettings = () => {
  const { user, users, announcements, addAnnouncement, auditLogs, addUser, updateUser, systemSettings, updateSystemSettings, projectChangeRequests, updatePCR, pricingHistory, addPricingRecord, deletePricingRecord } = useAppContext();
  const [activeTab, setActiveTab] = useState<'users' | 'announcements' | 'audit' | 'branding' | 'modules' | 'notifications' | 'pcr' | 'pricing' | 'compliance'>('users');
  
  // Pagination State
  const [currentUsersPage, setCurrentUsersPage] = useState(1);
  const [currentAuditPage, setCurrentAuditPage] = useState(1);
  const [currentPCRPage, setCurrentPCRPage] = useState(1);
  const itemsPerPage = 10;
  
  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<any>('requestor');
  const [userPassword, setUserPassword] = useState('');

  // Announcement Modal State
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  // Pricing Modal State
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [standardRate, setStandardRate] = useState('');

  const totalUsersPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentUsersPage - 1) * itemsPerPage,
    currentUsersPage * itemsPerPage
  );

  const totalAuditPages = Math.ceil(auditLogs.length / itemsPerPage);
  const paginatedAuditLogs = auditLogs.slice(
    (currentAuditPage - 1) * itemsPerPage,
    currentAuditPage * itemsPerPage
  );

  const totalPCRPages = Math.ceil(projectChangeRequests.length / itemsPerPage);
  const paginatedPCRs = projectChangeRequests.slice(
    (currentPCRPage - 1) * itemsPerPage,
    currentPCRPage * itemsPerPage
  );

  const handleOpenUserModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserRole(user.role);
      setUserPassword('');
    } else {
      setEditingUser(null);
      setUserName('');
      setUserEmail('');
      setUserRole('requestor');
      setUserPassword('');
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (editingUser) {
      const updates: any = { name: userName, email: userEmail, role: userRole };
      if (userPassword) updates.password = userPassword;
      await updateUser(editingUser.id, updates);
    } else {
      await addUser({ name: userName, email: userEmail, role: userRole, password: userPassword || 'gcgc2024' });
    }
    setIsUserModalOpen(false);
  };

  const handleSaveAnnouncement = () => {
    addAnnouncement({
      title: annTitle,
      content: annContent,
      authorId: user?.id || 'u1',
    });
    setAnnTitle('');
    setAnnContent('');
    setIsAnnModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">{user?.role === 'admin' ? 'Core' : 'User'} <span className="font-bold">{user?.role === 'admin' ? 'Settings' : 'Management'}</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Access & Security Control</p>
        </div>
        {activeTab === 'users' && (
          <button 
            onClick={() => handleOpenUserModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] text-sm font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Provision User
          </button>
        )}
        {activeTab === 'announcements' && user?.role === 'admin' && (
          <button 
            onClick={() => setIsAnnModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-border-subtle">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'users' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-faint hover:text-text-main'
          }`}
        >
          User Directory
        </button>
        {user?.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'announcements' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-faint hover:text-text-main'
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'audit' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-faint hover:text-text-main'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'branding' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-faint hover:text-text-main'
              }`}
            >
              Branding
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'modules' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-faint hover:text-text-main'
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'notifications' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-faint hover:text-text-main'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('pcr')}
              className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'pcr' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-faint hover:text-text-main'
              }`}
            >
              PCR Flow
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'pricing' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-faint hover:text-text-main'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'compliance' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-faint hover:text-text-main'
              }`}
            >
              Compliance
            </button>
          </>
        )}
      </div>

      <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        {activeTab === 'users' && (
          <>
            <div className="px-6 py-5 border-b border-border-faint flex items-center gap-3 relative z-10">
              <Shield className="h-5 w-5 text-cyan-400" />
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">User Directory</h3>
            </div>
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-faint bg-bg-base">
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-bg-hover transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-secondary">{u.name}</p>
                            <p className="text-xs font-mono text-text-faint">{u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <Mail className="h-3 w-3" /> {u.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border
                          ${u.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            u.role === 'technician' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                            u.role === 'service_desk' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenUserModal(u)}
                          className="text-text-faint hover:text-indigo-400 transition-colors"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentUsersPage}
              totalPages={totalUsersPages}
              onPageChange={setCurrentUsersPage}
            />
          </>
        )}

        {activeTab === 'announcements' && (
          <>
            <div className="px-6 py-5 border-b border-border-faint flex items-center gap-3 relative z-10">
              <Megaphone className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">System Announcements</h3>
            </div>
            <div className="divide-y divide-white/5 relative z-10">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann.id} className="p-6 hover:bg-bg-hover transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium text-text-main">{ann.title}</h4>
                      <span className="text-xs font-mono text-text-faint">{format(new Date(ann.date), 'PPp')}</span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">{ann.content}</p>
                    <div className="mt-3 text-xs font-mono text-text-fainter">
                      Author: {users.find(u => u.id === ann.authorId)?.name || ann.authorId}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm font-mono text-text-faint uppercase tracking-widest">No announcements found.</div>
              )}
            </div>
          </>
        )}

        {activeTab === 'audit' && (
          <>
            <div className="px-6 py-5 border-b border-border-faint flex items-center gap-3 relative z-10">
              <Activity className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">System Audit Logs</h3>
            </div>
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-faint bg-bg-base">
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-bg-hover transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-text-muted whitespace-nowrap">
                        {format(new Date(log.timestamp), 'PPp')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-text-secondary">
                          {users.find(u => u.id === log.userId)?.name || log.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider bg-bg-subtle text-text-tertiary border border-border-subtle">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                  {paginatedAuditLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm font-mono text-text-faint uppercase tracking-widest">
                        No audit logs available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentAuditPage}
              totalPages={totalAuditPages}
              onPageChange={setCurrentAuditPage}
            />
          </>
        )}

        {activeTab === 'branding' && (
          <>
            <div className="px-6 py-5 border-b border-border-faint flex items-center gap-3 relative z-10">
              <Palette className="h-5 w-5 text-pink-400" />
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">System Branding</h3>
            </div>
            <div className="p-6 space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={systemSettings.branding.companyName} 
                  onChange={e => updateSystemSettings({ branding: { ...systemSettings.branding, companyName: e.target.value } })}
                  className="block w-full max-w-md rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Logo URL</label>
                <input 
                  type="text" 
                  value={systemSettings.branding.logoUrl} 
                  onChange={e => updateSystemSettings({ branding: { ...systemSettings.branding, logoUrl: e.target.value } })}
                  placeholder="https://example.com/logo.png"
                  className="block w-full max-w-md rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={systemSettings.branding.primaryColor} 
                    onChange={e => updateSystemSettings({ branding: { ...systemSettings.branding, primaryColor: e.target.value } })}
                    className="h-10 w-10 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <span className="text-sm font-mono text-text-muted">{systemSettings.branding.primaryColor}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'modules' && (
          <>
            <div className="px-6 py-5 border-b border-border-faint flex items-center gap-3 relative z-10">
              <Blocks className="h-5 w-5 text-blue-400" />
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Module Activation</h3>
            </div>
            <div className="p-6 space-y-4 relative z-10">
              {Object.entries(systemSettings.modules).map(([module, isEnabled]) => (
                <div key={module} className="flex items-center justify-between max-w-md p-4 rounded-lg border border-border-faint bg-bg-hover">
                  <div>
                    <h4 className="text-sm font-medium text-text-main capitalize">{module.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <p className="text-xs text-text-faint mt-1">Enable or disable this module globally.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isEnabled}
                      onChange={e => updateSystemSettings({ modules: { ...systemSettings.modules, [module]: e.target.checked } })}
                    />
                    <div className="w-11 h-6 bg-bg-strong peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'notifications' && (
          <>
            <div className="px-6 py-5 border-b border-border-faint flex items-center gap-3 relative z-10">
              <Bell className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Notification Settings</h3>
            </div>
            <div className="p-6 space-y-4 relative z-10">
              {Object.entries(systemSettings.notifications).map(([channel, isEnabled]) => (
                <div key={channel} className="flex items-center justify-between max-w-md p-4 rounded-lg border border-border-faint bg-bg-hover">
                  <div>
                    <h4 className="text-sm font-medium text-text-main capitalize">{channel.replace('Enabled', '')} Notifications</h4>
                    <p className="text-xs text-text-faint mt-1">Send system alerts via {channel.replace('Enabled', '')}.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isEnabled}
                      onChange={e => updateSystemSettings({ notifications: { ...systemSettings.notifications, [channel]: e.target.checked } })}
                    />
                    <div className="w-11 h-6 bg-bg-strong peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'pcr' && (
          <>
            <div className="px-6 py-5 border-b border-border-faint flex items-center gap-3 relative z-10">
              <Activity className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Project Change Requests</h3>
            </div>
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-faint bg-bg-base">
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedPCRs.map((pcr) => (
                    <tr key={pcr.id} className="hover:bg-bg-hover transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-text-muted">{pcr.id}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{pcr.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border ${
                          pcr.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          pcr.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {pcr.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-text-faint">{format(new Date(pcr.submittedAt), 'PP')}</td>
                      <td className="px-6 py-4 text-right">
                        {pcr.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => updatePCR(pcr.id, { status: 'approved' })}
                              className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-mono uppercase tracking-widest hover:bg-emerald-500/20"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => updatePCR(pcr.id, { status: 'rejected' })}
                              className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-mono uppercase tracking-widest hover:bg-red-500/20"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {paginatedPCRs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm font-mono text-text-faint uppercase tracking-widest">
                        No change requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPCRPage}
              totalPages={totalPCRPages}
              onPageChange={setCurrentPCRPage}
            />
          </>
        )}

        {activeTab === 'pricing' && (
          <>
            <div className="px-6 py-5 border-b border-border-faint flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Pricing Management</h3>
              </div>
              <button 
                onClick={() => setIsPricingModalOpen(true)}
                className="px-3 py-1.5 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-[10px] font-mono uppercase tracking-widest"
              >
                Add Record
              </button>
            </div>
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-faint bg-bg-base">
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Rate</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pricingHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-bg-hover transition-colors">
                      <td className="px-6 py-4 text-sm text-text-secondary">{record.serviceName}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">{record.category}</td>
                      <td className="px-6 py-4 text-sm font-mono text-emerald-400 text-right">₱{record.price?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deletePricingRecord(record.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'compliance' && (
          <div className="p-6 space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-bg-base border border-border-subtle rounded-xl p-6">
                <h4 className="text-xs font-mono text-text-faint uppercase tracking-widest mb-4">Security Score</h4>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-light text-emerald-400">94</span>
                  <span className="text-sm font-mono text-text-faint mb-1">/ 100</span>
                </div>
                <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[94%]"></div>
                </div>
              </div>
              <div className="bg-bg-base border border-border-subtle rounded-xl p-6">
                <h4 className="text-xs font-mono text-text-faint uppercase tracking-widest mb-4">Uptime (30d)</h4>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-light text-cyan-400">99.9</span>
                  <span className="text-sm font-mono text-text-faint mb-1">%</span>
                </div>
                <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[99.9%]"></div>
                </div>
              </div>
              <div className="bg-bg-base border border-border-subtle rounded-xl p-6">
                <h4 className="text-xs font-mono text-text-faint uppercase tracking-widest mb-4">Audit Compliance</h4>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-light text-indigo-400">100</span>
                  <span className="text-sm font-mono text-text-faint mb-1">%</span>
                </div>
                <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-bg-base border border-border-subtle rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border-faint bg-white/5">
                <h4 className="text-sm font-mono text-text-muted uppercase tracking-widest">Compliance Checklist</h4>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { label: 'Data Encryption at Rest', status: 'compliant' },
                  { label: 'Multi-Factor Authentication', status: 'compliant' },
                  { label: 'Audit Logging Enabled', status: 'compliant' },
                  { label: 'Role-Based Access Control', status: 'compliant' },
                  { label: 'Regular Security Backups', status: 'compliant' },
                  { label: 'Vulnerability Scanning', status: 'pending' },
                ].map((item, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${
                      item.status === 'compliant' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">Add Pricing Record</h3>
              <button onClick={() => setIsPricingModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Service Name</label>
                <input 
                  type="text" 
                  value={serviceName} 
                  onChange={e => setServiceName(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Category</label>
                <input 
                  type="text" 
                  value={serviceCategory} 
                  onChange={e => setServiceCategory(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Standard Rate (₱)</label>
                <input 
                  type="number" 
                  value={standardRate} 
                  onChange={e => setStandardRate(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
              <button 
                onClick={() => setIsPricingModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  addPricingRecord({
                    serviceName,
                    category: serviceCategory,
                    price: parseFloat(standardRate),
                    effectiveDate: new Date().toISOString(),
                  });
                  setIsPricingModalOpen(false);
                }}
                disabled={!serviceName || !standardRate}
                className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">{editingUser ? 'Edit User' : 'Provision User'}</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={e => setUserName(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={e => setUserEmail(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Role</label>
                <select 
                  value={userRole} 
                  onChange={e => setUserRole(e.target.value as any)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="requestor">Requestor</option>
                  <option value="technician">Technician</option>
                  <option value="service_desk">Service Desk</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">
                  {editingUser ? 'New Password (leave blank to keep)' : 'Password'}
                </label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={e => setUserPassword(e.target.value)}
                  placeholder={editingUser ? '••••••••' : 'Default: gcgc2024'}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUser}
                disabled={!userName || !userEmail}
                className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">New System Announcement</h3>
              <button onClick={() => setIsAnnModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Title</label>
                <input 
                  type="text" 
                  value={annTitle} 
                  onChange={e => setAnnTitle(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., Scheduled Maintenance"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Content</label>
                <textarea 
                  value={annContent} 
                  onChange={e => setAnnContent(e.target.value)}
                  rows={5}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter announcement details..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
              <button 
                onClick={() => setIsAnnModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAnnouncement}
                disabled={!annTitle || !annContent}
                className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
