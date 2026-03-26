import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';
import {
  LayoutDashboard,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  BarChart3,
  Briefcase,
  Bell,
  Activity,
  Box,
  Calendar,
  Package,
  Sun,
  Moon
} from 'lucide-react';
import { clsx } from 'clsx';

const Layout = () => {
  const { user, logout, notifications, markNotificationRead } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const myNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif: any) => {
    if (!notif.read) markNotificationRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      setNotifOpen(false);
    }
  };

  const navItems = {
    admin: [
      { name: 'System Overview', path: '/', icon: LayoutDashboard },
      { name: 'My View', path: '/my-view', icon: UserIcon },
      { name: 'Service Desk', path: '/service-desk', icon: Ticket },
      { name: 'Operations Matrix', path: '/requests', icon: Ticket },
      { name: 'Asset Registry', path: '/assets', icon: Box },
      { name: 'PM Schedules', path: '/pm', icon: Calendar },
      { name: 'Inventory', path: '/inventory', icon: Package },
      { name: 'Vendors', path: '/vendors', icon: Briefcase },
      { name: 'Intelligence', path: '/bi', icon: Activity },
      { name: 'Financials', path: '/financial', icon: Briefcase },
      { name: 'Reports', path: '/reports', icon: BarChart3 },
      { name: 'Service Config', path: '/config', icon: Settings },
      { name: 'Core Settings', path: '/settings', icon: Settings },
    ],
    technician: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'My Assigned Requests', path: '/tasks', icon: Briefcase },
      { name: 'Asset Registry', path: '/assets', icon: Box },
      { name: 'PM Schedules', path: '/pm', icon: Calendar },
      { name: 'Inventory', path: '/inventory', icon: Package },
      { name: 'Technician Performance', path: '/performance', icon: BarChart3 },
      { name: 'Reports', path: '/reports', icon: BarChart3 },
    ],
    requestor: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Submit Requests', path: '/submit', icon: Briefcase },
      { name: 'My Requests', path: '/my-requests', icon: Ticket },
    ],
    service_desk: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Requests Management', path: '/requests', icon: Ticket },
      { name: 'Technician Performance', path: '/performance', icon: BarChart3 },
      { name: 'Reports', path: '/reports', icon: BarChart3 },
      { name: 'User Management', path: '/settings', icon: Settings },
    ],
  };

  const items = user ? navItems[user.role] : [];

  return (
    <div className="min-h-screen bg-bg-base flex text-text-tertiary font-sans selection:bg-indigo-500/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-bg-panel border-r border-border-faint transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-border-faint">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-indigo-500 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <span className="text-sm font-bold text-text-main tracking-widest uppercase">GCG.SYS</span>
          </div>
          <button className="lg:hidden text-text-muted hover:text-text-main" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 border-b border-border-faint">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-bg-faint border border-border-subtle flex items-center justify-center text-indigo-400">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-text-main truncate">{user?.name}</p>
              <p className="text-xs font-mono text-indigo-400/80 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_2px_0_0_rgba(99,102,241,1)]'
                    : 'text-text-muted hover:bg-bg-subtle hover:text-text-main'
                )
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border-faint">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-faint hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <header className="h-16 bg-bg-panel/80 backdrop-blur-md border-b border-border-faint flex items-center justify-between px-4 lg:px-8 z-10">
          <button
            className="lg:hidden text-text-muted hover:text-text-main"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-subtle border border-border-faint">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
              <span className="text-xs font-mono text-text-muted">SYSTEM.ONLINE</span>
            </div>
            
            <button
              onClick={toggleTheme}
              className="text-text-muted hover:text-text-main relative p-2 rounded-full hover:bg-bg-subtle transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="text-text-muted hover:text-text-main relative p-2 rounded-full hover:bg-bg-subtle transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-bg-panel border border-border-subtle rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border-faint flex items-center justify-between">
                    <h3 className="text-sm font-mono text-text-tertiary uppercase tracking-widest">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs font-mono bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">{unreadCount} New</span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {myNotifications.length > 0 ? (
                      <ul className="divide-y divide-white/5">
                        {myNotifications.map(notif => (
                          <li 
                            key={notif.id} 
                            className={clsx(
                              "p-4 hover:bg-bg-subtle transition-colors cursor-pointer",
                              !notif.read && "bg-indigo-500/5"
                            )}
                            onClick={() => handleNotificationClick(notif)}
                          >
                            <p className={clsx("text-sm", !notif.read ? "text-text-main font-medium" : "text-text-muted")}>
                              {notif.message}
                            </p>
                            <p className="text-xs font-mono text-text-faint mt-2">
                              {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-6 text-center text-sm font-mono text-text-faint uppercase tracking-widest">
                        No alerts
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
