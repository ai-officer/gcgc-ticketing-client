import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Mail, Shield, Activity, Clock, Calendar, Plus, Users, Repeat } from 'lucide-react';
import { format } from 'date-fns';

const MyView = () => {
  const { user, tickets, users } = useAppContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'scheduler'>('profile');
  
  // Scheduler State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskRecurrence, setTaskRecurrence] = useState('none');
  const [scheduledTasks, setScheduledTasks] = useState([
    { id: '1', title: 'Monthly Inventory Audit', assignee: 'u1', date: '2026-04-01', time: '09:00', recurrence: 'monthly' },
    { id: '2', title: 'System Maintenance Check', assignee: 'u2', date: '2026-03-28', time: '22:00', recurrence: 'weekly' }
  ]);

  if (!user) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      assignee: taskAssignee,
      date: taskDate,
      time: taskTime,
      recurrence: taskRecurrence
    };
    setScheduledTasks([...scheduledTasks, newTask]);
    setIsTaskModalOpen(false);
    setTaskTitle('');
    setTaskAssignee('');
    setTaskDate('');
    setTaskTime('');
    setTaskRecurrence('none');
  };

  const mySubmittedTickets = tickets.filter(t => t.requestorId === user.id);
  const myAssignedTickets = tickets.filter(t => t.assigneeId === user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">My <span className="font-bold">View</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Personal Profile & Activity</p>
        </div>
        {user.role === 'admin' && (
          <div className="flex bg-bg-panel border border-border-subtle rounded-lg p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-text-main shadow-lg' : 'text-text-faint hover:text-text-main'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('scheduler')}
              className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all ${activeTab === 'scheduler' ? 'bg-indigo-600 text-text-main shadow-lg' : 'text-text-faint hover:text-text-main'}`}
            >
              Scheduler
            </button>
          </div>
        )}
      </div>

      {activeTab === 'profile' ? (
        <>
          <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              <div className="h-24 w-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono text-3xl shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                {user.name.charAt(0)}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-medium text-text-main">{user.name}</h2>
                <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {user.email}</span>
                  <span className="hidden sm:inline text-text-fainter">•</span>
                  <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-indigo-400">
                    <Shield className="h-4 w-4" /> {user.role}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <button className="px-4 py-2 bg-bg-subtle hover:bg-bg-strong border border-border-subtle rounded-lg text-sm font-medium text-text-main transition-colors">
                  Edit Profile
                </button>
                <button className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-lg text-sm font-medium text-indigo-400 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative">
              <div className="px-6 py-5 border-b border-border-faint flex items-center gap-3">
                <Activity className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">My Submitted Requests</h3>
              </div>
              <div className="p-6">
                {mySubmittedTickets.length > 0 ? (
                  <ul className="space-y-4">
                    {mySubmittedTickets.slice(0, 5).map(ticket => (
                      <li key={ticket.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-secondary">{ticket.title}</p>
                          <p className="text-xs font-mono text-text-faint mt-1">{ticket.id} • {format(new Date(ticket.createdAt), 'MMM d')}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border
                          ${ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-bg-subtle text-text-muted border-border-subtle'}`}>
                          {ticket.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-mono text-text-faint uppercase tracking-widest text-center py-4">No requests submitted.</p>
                )}
              </div>
            </div>

            <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative">
              <div className="px-6 py-5 border-b border-border-faint flex items-center gap-3">
                <Clock className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">My Assigned Tasks</h3>
              </div>
              <div className="p-6">
                {myAssignedTickets.length > 0 ? (
                  <ul className="space-y-4">
                    {myAssignedTickets.slice(0, 5).map(ticket => (
                      <li key={ticket.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-secondary">{ticket.title}</p>
                          <p className="text-xs font-mono text-text-faint mt-1">{ticket.id} • {ticket.priority}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border
                          ${ticket.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                            ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-bg-subtle text-text-muted border-border-subtle'}`}>
                          {ticket.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-mono text-text-faint uppercase tracking-widest text-center py-4">No tasks assigned.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden">
            <div className="px-6 py-5 border-b border-border-faint flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Operational Scheduler</h3>
              </div>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-text-main rounded hover:bg-indigo-500 transition-colors text-xs font-mono uppercase tracking-wider"
              >
                <Plus className="h-3 w-3" /> Create Task
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledTasks.map(task => (
                  <div key={task.id} className="bg-bg-base border border-border-subtle rounded-lg p-4 relative group hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-indigo-400" />
                      </div>
                      {task.recurrence !== 'none' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono uppercase tracking-wider border border-cyan-500/20">
                          <Repeat className="h-3 w-3" /> {task.recurrence}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">{task.title}</h4>
                    <div className="space-y-1.5 text-xs text-text-muted font-mono">
                      <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-text-faint" /> {format(new Date(task.date), 'MMM d, yyyy')} @ {task.time}</p>
                      <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-text-faint" /> {users.find(u => u.id === task.assignee)?.name || 'Unassigned'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Modal */}
          {isTaskModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
                  <h3 className="text-lg font-medium text-text-main">Schedule New Task</h3>
                  <button onClick={() => setIsTaskModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
                </div>
                <form onSubmit={handleAddTask}>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Task Title</label>
                      <input 
                        type="text" 
                        required
                        value={taskTitle} 
                        onChange={e => setTaskTitle(e.target.value)}
                        className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g., Quarterly Safety Inspection"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Assign User</label>
                      <select 
                        required
                        value={taskAssignee} 
                        onChange={e => setTaskAssignee(e.target.value)}
                        className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">Select User...</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Date</label>
                        <input 
                          type="date" 
                          required
                          value={taskDate} 
                          onChange={e => setTaskDate(e.target.value)}
                          className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Time</label>
                        <input 
                          type="time" 
                          required
                          value={taskTime} 
                          onChange={e => setTaskTime(e.target.value)}
                          className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Recurrence</label>
                      <select 
                        value={taskRecurrence} 
                        onChange={e => setTaskRecurrence(e.target.value)}
                        className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="none">No Recurrence</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
                    <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium shadow-[0_0_10px_rgba(79,70,229,0.3)]">Schedule Task</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyView;
