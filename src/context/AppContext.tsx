import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import {
  User, Ticket, Worklog, ServiceCategory, Announcement, Notification,
  AuditLog, RequestTemplate, IncidentType, Property, Location, Asset,
  PreventiveMaintenance, InventoryItem, Vendor, SystemSettings,
  PricingRecord, ProjectChangeRequest,
} from '../types';
import { api } from '../services/api';

interface AppContextType {
  user: User | null;
  authLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  categories: ServiceCategory[];
  addCategory: (category: Omit<ServiceCategory, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<ServiceCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  worklogs: Worklog[];
  addWorklog: (ticketId: string, form: FormData) => Promise<void>;
  users: User[];
  addUser: (user: Omit<User, 'id'> & { password: string }) => Promise<void>;
  updateUser: (id: string, updates: Partial<User> & { password?: string }) => Promise<void>;
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
  notifications: Notification[];
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  requestTemplates: RequestTemplate[];
  addRequestTemplate: (template: Omit<RequestTemplate, 'id'>) => Promise<void>;
  updateRequestTemplate: (id: string, updates: Partial<RequestTemplate>) => Promise<void>;
  deleteRequestTemplate: (id: string) => Promise<void>;
  incidentTypes: IncidentType[];
  addIncidentType: (incidentType: Omit<IncidentType, 'id'>) => Promise<void>;
  updateIncidentType: (id: string, updates: Partial<IncidentType>) => Promise<void>;
  deleteIncidentType: (id: string) => Promise<void>;
  properties: Property[];
  addProperty: (property: Omit<Property, 'id'>) => Promise<void>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  locations: Location[];
  addLocation: (location: Omit<Location, 'id'>) => Promise<void>;
  updateLocation: (id: string, updates: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id'>) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  preventiveMaintenances: PreventiveMaintenance[];
  addPreventiveMaintenance: (pm: Omit<PreventiveMaintenance, 'id'>) => Promise<void>;
  updatePreventiveMaintenance: (id: string, updates: Partial<PreventiveMaintenance>) => Promise<void>;
  deletePreventiveMaintenance: (id: string) => Promise<void>;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id'>) => Promise<void>;
  updateVendor: (id: string, updates: Partial<Vendor>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  pricingHistory: PricingRecord[];
  addPricingRecord: (record: Omit<PricingRecord, 'id'>) => Promise<void>;
  updatePricingRecord: (id: string, updates: Partial<PricingRecord>) => Promise<void>;
  deletePricingRecord: (id: string) => Promise<void>;
  projectChangeRequests: ProjectChangeRequest[];
  addPCR: (pcr: Omit<ProjectChangeRequest, 'id' | 'submittedAt' | 'status'>) => Promise<void>;
  updatePCR: (id: string, updates: Partial<ProjectChangeRequest>) => Promise<void>;
  toggleDuty: () => Promise<void>;
  systemSettings: SystemSettings;
  updateSystemSettings: (updates: Partial<SystemSettings>) => Promise<void>;
}

const defaultSystemSettings: SystemSettings = {
  branding: { logoUrl: '', primaryColor: '#4f46e5', companyName: 'Global Comfort Group' },
  modules: { inventory: true, vendors: true, financials: true, preventiveMaintenance: true },
  notifications: { emailEnabled: true, smsEnabled: false, slackEnabled: false },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [worklogs, setWorklogs] = useState<Worklog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [requestTemplates, setRequestTemplates] = useState<RequestTemplate[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [preventiveMaintenances, setPreventiveMaintenances] = useState<PreventiveMaintenance[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [pricingHistory, setPricingHistory] = useState<PricingRecord[]>([]);
  const [projectChangeRequests, setProjectChangeRequests] = useState<ProjectChangeRequest[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(defaultSystemSettings);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { setAuthLoading(false); return; }
    api.auth.me()
      .then(u => setUser(u))
      .catch(() => localStorage.removeItem('access_token'))
      .finally(() => setAuthLoading(false));
  }, []);

  // Load all reference data once authenticated
  const loadData = useCallback(async () => {
    const [
      ticketsRes, cats, userList, anns, notifs, logs,
      tmpls, iTypes, props, locs, assetList, pms, inv, vendList,
      pricing, pcrList, settings,
    ] = await Promise.allSettled([
      api.tickets.list({ limit: 100 }),
      api.categories.list(),
      api.users.list({ limit: 100 }),
      api.announcements.list(),
      api.notifications.list(),
      api.auditLogs.list(),
      api.templates.list(),
      api.incidentTypes.list(),
      api.properties.list(),
      api.locations.list(),
      api.assets.list(),
      api.pm.list(),
      api.inventory.list(),
      api.vendors.list(),
      api.pricing.list(),
      api.pcr.list(),
      api.settings.get(),
    ]);

    if (ticketsRes.status === 'fulfilled') setTickets(ticketsRes.value.items);
    if (cats.status === 'fulfilled') setCategories(cats.value.items);
    if (userList.status === 'fulfilled') setUsers(userList.value.items);
    if (anns.status === 'fulfilled') setAnnouncements(anns.value.items);
    if (notifs.status === 'fulfilled') setNotifications(notifs.value.items);
    if (logs.status === 'fulfilled') setAuditLogs(logs.value.items);
    if (tmpls.status === 'fulfilled') setRequestTemplates(tmpls.value.items);
    if (iTypes.status === 'fulfilled') setIncidentTypes(iTypes.value.items);
    if (props.status === 'fulfilled') setProperties(props.value.items);
    if (locs.status === 'fulfilled') setLocations(locs.value.items);
    if (assetList.status === 'fulfilled') setAssets(assetList.value.items);
    if (pms.status === 'fulfilled') setPreventiveMaintenances(pms.value.items);
    if (inv.status === 'fulfilled') setInventory(inv.value.items);
    if (vendList.status === 'fulfilled') setVendors(vendList.value.items);
    if (pricing.status === 'fulfilled') setPricingHistory(pricing.value.items);
    if (pcrList.status === 'fulfilled') setProjectChangeRequests(pcrList.value.items);
    if (settings.status === 'fulfilled') setSystemSettings(settings.value);
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  const login = (u: User) => setUser(u);

  const logout = () => {
    api.auth.logout().catch(() => {});
    localStorage.removeItem('access_token');
    setUser(null);
    setTickets([]);
  };

  // Stubs kept for backward compat with pages that call addAuditLog/addNotification directly
  const addAuditLog = (_log: Omit<AuditLog, 'id' | 'timestamp'>) => {};
  const addNotification = (_n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {};

  // --- Tickets ---
  const addTicket = async (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const t = await api.tickets.create(data);
    setTickets(prev => [t, ...prev]);
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    let updated: Ticket;
    if (updates.status && Object.keys(updates).length === 1) {
      updated = await api.tickets.updateStatus(id, updates.status);
    } else if (updates.assigneeId && Object.keys(updates).length === 1) {
      updated = await api.tickets.assign(id, updates.assigneeId);
    } else {
      updated = await api.tickets.update(id, updates);
    }
    setTickets(prev => prev.map(t => t.id === id ? updated : t));
  };

  // --- Worklogs ---
  const addWorklog = async (ticketId: string, form: FormData) => {
    const wl = await api.tickets.addWorklog(ticketId, form);
    setWorklogs(prev => [wl, ...prev]);
    // Refresh ticket to reflect status change (assigned → in-progress)
    const updated = await api.tickets.get(ticketId);
    setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
  };

  // --- Categories ---
  const addCategory = async (data: Omit<ServiceCategory, 'id'>) => {
    const c = await api.categories.create(data);
    setCategories(prev => [...prev, c]);
  };
  const updateCategory = async (id: string, updates: Partial<ServiceCategory>) => {
    const c = await api.categories.update(id, updates);
    setCategories(prev => prev.map(x => x.id === id ? c : x));
  };
  const deleteCategory = async (id: string) => {
    await api.categories.delete(id);
    setCategories(prev => prev.filter(x => x.id !== id));
  };

  // --- Users ---
  const addUser = async (data: Omit<User, 'id'> & { password: string }) => {
    const u = await api.users.create(data);
    setUsers(prev => [...prev, u]);
  };
  const updateUser = async (id: string, updates: Partial<User> & { password?: string }) => {
    const u = await api.users.update(id, updates);
    setUsers(prev => prev.map(x => x.id === id ? u : x));
  };

  // --- Announcements ---
  const addAnnouncement = async (data: Omit<Announcement, 'id' | 'date'>) => {
    const a = await api.announcements.create(data);
    setAnnouncements(prev => [a, ...prev]);
  };

  // --- Notifications ---
  const markNotificationRead = async (id: string) => {
    await api.notifications.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAllNotificationsRead = async () => {
    await api.notifications.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // --- Templates ---
  const addRequestTemplate = async (data: Omit<RequestTemplate, 'id'>) => {
    const t = await api.templates.create(data);
    setRequestTemplates(prev => [...prev, t]);
  };
  const updateRequestTemplate = async (id: string, updates: Partial<RequestTemplate>) => {
    const t = await api.templates.update(id, updates);
    setRequestTemplates(prev => prev.map(x => x.id === id ? t : x));
  };
  const deleteRequestTemplate = async (id: string) => {
    await api.templates.delete(id);
    setRequestTemplates(prev => prev.filter(x => x.id !== id));
  };

  // --- Incident Types ---
  const addIncidentType = async (data: Omit<IncidentType, 'id'>) => {
    const it = await api.incidentTypes.create(data);
    setIncidentTypes(prev => [...prev, it]);
  };
  const updateIncidentType = async (id: string, updates: Partial<IncidentType>) => {
    const it = await api.incidentTypes.update(id, updates);
    setIncidentTypes(prev => prev.map(x => x.id === id ? it : x));
  };
  const deleteIncidentType = async (id: string) => {
    await api.incidentTypes.delete(id);
    setIncidentTypes(prev => prev.filter(x => x.id !== id));
  };

  // --- Properties ---
  const addProperty = async (data: Omit<Property, 'id'>) => {
    const p = await api.properties.create(data);
    setProperties(prev => [...prev, p]);
  };
  const updateProperty = async (id: string, updates: Partial<Property>) => {
    const p = await api.properties.update(id, updates);
    setProperties(prev => prev.map(x => x.id === id ? p : x));
  };
  const deleteProperty = async (id: string) => {
    await api.properties.delete(id);
    setProperties(prev => prev.filter(x => x.id !== id));
    setLocations(prev => prev.filter(l => l.propertyId !== id));
  };

  // --- Locations ---
  const addLocation = async (data: Omit<Location, 'id'>) => {
    const l = await api.locations.create(data);
    setLocations(prev => [...prev, l]);
  };
  const updateLocation = async (id: string, updates: Partial<Location>) => {
    const l = await api.locations.update(id, updates);
    setLocations(prev => prev.map(x => x.id === id ? l : x));
  };
  const deleteLocation = async (id: string) => {
    await api.locations.delete(id);
    setLocations(prev => prev.filter(x => x.id !== id));
  };

  // --- Assets ---
  const addAsset = async (data: Omit<Asset, 'id'>) => {
    const a = await api.assets.create(data);
    setAssets(prev => [...prev, a]);
  };
  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    const a = await api.assets.update(id, updates);
    setAssets(prev => prev.map(x => x.id === id ? a : x));
  };
  const deleteAsset = async (id: string) => {
    await api.assets.delete(id);
    setAssets(prev => prev.filter(x => x.id !== id));
  };

  // --- Preventive Maintenance ---
  const addPreventiveMaintenance = async (data: Omit<PreventiveMaintenance, 'id'>) => {
    const pm = await api.pm.create(data);
    setPreventiveMaintenances(prev => [...prev, pm]);
  };
  const updatePreventiveMaintenance = async (id: string, updates: Partial<PreventiveMaintenance>) => {
    const pm = await api.pm.update(id, updates);
    setPreventiveMaintenances(prev => prev.map(x => x.id === id ? pm : x));
  };
  const deletePreventiveMaintenance = async (id: string) => {
    await api.pm.delete(id);
    setPreventiveMaintenances(prev => prev.filter(x => x.id !== id));
  };

  // --- Inventory ---
  const addInventoryItem = async (data: Omit<InventoryItem, 'id'>) => {
    const item = await api.inventory.create(data);
    setInventory(prev => [...prev, item]);
  };
  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    const item = await api.inventory.update(id, updates);
    setInventory(prev => prev.map(x => x.id === id ? item : x));
  };
  const deleteInventoryItem = async (id: string) => {
    await api.inventory.delete(id);
    setInventory(prev => prev.filter(x => x.id !== id));
  };

  // --- Vendors ---
  const addVendor = async (data: Omit<Vendor, 'id'>) => {
    const v = await api.vendors.create(data);
    setVendors(prev => [...prev, v]);
  };
  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    const v = await api.vendors.update(id, updates);
    setVendors(prev => prev.map(x => x.id === id ? v : x));
  };
  const deleteVendor = async (id: string) => {
    await api.vendors.delete(id);
    setVendors(prev => prev.filter(x => x.id !== id));
  };

  // --- Pricing ---
  const addPricingRecord = async (data: Omit<PricingRecord, 'id'>) => {
    const r = await api.pricing.create(data);
    setPricingHistory(prev => [r, ...prev]);
  };
  const updatePricingRecord = async (id: string, updates: Partial<PricingRecord>) => {
    const r = await api.pricing.update(id, updates);
    setPricingHistory(prev => prev.map(x => x.id === id ? r : x));
  };
  const deletePricingRecord = async (id: string) => {
    await api.pricing.delete(id);
    setPricingHistory(prev => prev.filter(x => x.id !== id));
  };

  // --- PCR ---
  const addPCR = async (data: Omit<ProjectChangeRequest, 'id' | 'submittedAt' | 'status'>) => {
    const p = await api.pcr.create(data);
    setProjectChangeRequests(prev => [p, ...prev]);
  };
  const updatePCR = async (id: string, updates: Partial<ProjectChangeRequest>) => {
    let p: ProjectChangeRequest;
    if (updates.status && Object.keys(updates).length === 1) {
      p = await api.pcr.review(id, updates.status as 'approved' | 'rejected');
    } else {
      p = await api.pcr.update(id, updates);
    }
    setProjectChangeRequests(prev => prev.map(x => x.id === id ? p : x));
  };

  // --- Duty toggle ---
  const toggleDuty = async () => {
    if (!user) return;
    const updated = await api.users.toggleDuty(user.id);
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  // --- System Settings ---
  const updateSystemSettings = async (updates: Partial<SystemSettings>) => {
    const merged = { ...systemSettings, ...updates };
    const result = await api.settings.update(merged);
    setSystemSettings(result);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        login,
        logout,
        tickets,
        addTicket,
        updateTicket,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        worklogs,
        addWorklog,
        users,
        addUser,
        updateUser,
        announcements,
        addAnnouncement,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        auditLogs,
        addAuditLog,
        requestTemplates,
        addRequestTemplate,
        updateRequestTemplate,
        deleteRequestTemplate,
        incidentTypes,
        addIncidentType,
        updateIncidentType,
        deleteIncidentType,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        locations,
        addLocation,
        updateLocation,
        deleteLocation,
        assets,
        addAsset,
        updateAsset,
        deleteAsset,
        preventiveMaintenances,
        addPreventiveMaintenance,
        updatePreventiveMaintenance,
        deletePreventiveMaintenance,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        vendors,
        addVendor,
        updateVendor,
        deleteVendor,
        pricingHistory,
        addPricingRecord,
        updatePricingRecord,
        deletePricingRecord,
        projectChangeRequests,
        addPCR,
        updatePCR,
        toggleDuty,
        systemSettings,
        updateSystemSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
