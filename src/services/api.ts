import { handleResponse } from './apiError';
import type {
  User, Ticket, Worklog, ServiceCategory, Announcement, Notification,
  AuditLog, RequestTemplate, IncidentType, Property, Location, Asset,
  PreventiveMaintenance, InventoryItem, Vendor, SystemSettings,
  PricingRecord, ProjectChangeRequest,
} from '../types';

const BASE = import.meta.env.VITE_API_URL ?? '';

function headers(): HeadersInit {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), { headers: headers() });
  return handleResponse<T>(res);
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

async function postForm<T>(path: string, form: FormData): Promise<T> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  return handleResponse<T>(res);
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: headers() });
  return handleResponse<T>(res);
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      post<LoginResponse>('/api/auth/login', { email, password }),
    me: () => get<User>('/api/auth/me'),
    logout: () => post<void>('/api/auth/logout', {}),
    changePassword: (currentPassword: string, newPassword: string) =>
      post<void>('/api/auth/change-password', { current_password: currentPassword, new_password: newPassword }),
  },

  tickets: {
    list: (params?: Record<string, string | number | undefined>) =>
      get<Paginated<Ticket>>('/api/tickets', params),
    get: (id: string) => get<Ticket>(`/api/tickets/${id}`),
    create: (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) =>
      post<Ticket>('/api/tickets', data),
    update: (id: string, data: Partial<Ticket>) =>
      patch<Ticket>(`/api/tickets/${id}`, data),
    updateStatus: (id: string, status: string) =>
      patch<Ticket>(`/api/tickets/${id}/status`, { status }),
    assign: (id: string, assigneeId: string | number) =>
      patch<Ticket>(`/api/tickets/${id}/assign`, { assigneeId }),
    rate: (id: string, score: number, feedback?: string) =>
      patch<Ticket>(`/api/tickets/${id}/rate`, { score, feedback }),
    getWorklogs: (id: string) => get<Worklog[]>(`/api/tickets/${id}/worklogs`),
    addWorklog: (id: string, form: FormData) =>
      postForm<Worklog>(`/api/tickets/${id}/worklogs`, form),
    toggleTask: (ticketId: string, taskId: string | number, isCompleted: boolean) =>
      patch<void>(`/api/tickets/${ticketId}/tasks/${taskId}?is_completed=${isCompleted}`),
  },

  users: {
    list: (params?: Record<string, string | number | undefined>) =>
      get<Paginated<User>>('/api/users', params),
    get: (id: string | number) => get<User>(`/api/users/${id}`),
    create: (data: Omit<User, 'id'> & { password: string }) =>
      post<User>('/api/users', data),
    update: (id: string | number, data: Partial<User> & { password?: string }) =>
      patch<User>(`/api/users/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/users/${id}`),
    toggleDuty: (id: string | number) => patch<User>(`/api/users/${id}/duty`),
  },

  properties: {
    list: () => get<Paginated<Property>>('/api/properties'),
    create: (data: Omit<Property, 'id'>) => post<Property>('/api/properties', data),
    update: (id: string | number, data: Partial<Property>) =>
      patch<Property>(`/api/properties/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/properties/${id}`),
  },

  locations: {
    list: (params?: Record<string, string | number | undefined>) =>
      get<Paginated<Location>>('/api/locations', params),
    create: (data: Omit<Location, 'id'>) => post<Location>('/api/locations', data),
    update: (id: string | number, data: Partial<Location>) =>
      patch<Location>(`/api/locations/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/locations/${id}`),
  },

  assets: {
    list: (params?: Record<string, string | number | undefined>) =>
      get<Paginated<Asset>>('/api/assets', params),
    create: (data: Omit<Asset, 'id'>) => post<Asset>('/api/assets', data),
    update: (id: string | number, data: Partial<Asset>) =>
      patch<Asset>(`/api/assets/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/assets/${id}`),
  },

  vendors: {
    list: (params?: Record<string, string | number | undefined>) =>
      get<Paginated<Vendor>>('/api/vendors', params),
    create: (data: Omit<Vendor, 'id'>) => post<Vendor>('/api/vendors', data),
    update: (id: string | number, data: Partial<Vendor>) =>
      patch<Vendor>(`/api/vendors/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/vendors/${id}`),
  },

  inventory: {
    list: (params?: Record<string, string | number | undefined>) =>
      get<Paginated<InventoryItem>>('/api/inventory', params),
    create: (data: Omit<InventoryItem, 'id'>) => post<InventoryItem>('/api/inventory', data),
    update: (id: string | number, data: Partial<InventoryItem>) =>
      patch<InventoryItem>(`/api/inventory/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/inventory/${id}`),
  },

  pm: {
    list: (params?: Record<string, string | number | undefined>) =>
      get<Paginated<PreventiveMaintenance>>('/api/pm', params),
    create: (data: Omit<PreventiveMaintenance, 'id'>) =>
      post<PreventiveMaintenance>('/api/pm', data),
    update: (id: string | number, data: Partial<PreventiveMaintenance>) =>
      patch<PreventiveMaintenance>(`/api/pm/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/pm/${id}`),
  },

  categories: {
    list: () => get<Paginated<ServiceCategory>>('/api/categories'),
    create: (data: Omit<ServiceCategory, 'id'>) => post<ServiceCategory>('/api/categories', data),
    update: (id: string | number, data: Partial<ServiceCategory>) =>
      patch<ServiceCategory>(`/api/categories/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/categories/${id}`),
  },

  templates: {
    list: () => get<Paginated<RequestTemplate>>('/api/templates'),
    create: (data: Omit<RequestTemplate, 'id'>) => post<RequestTemplate>('/api/templates', data),
    update: (id: string | number, data: Partial<RequestTemplate>) =>
      patch<RequestTemplate>(`/api/templates/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/templates/${id}`),
  },

  incidentTypes: {
    list: () => get<Paginated<IncidentType>>('/api/incident-types'),
    create: (data: Omit<IncidentType, 'id'>) => post<IncidentType>('/api/incident-types', data),
    update: (id: string | number, data: Partial<IncidentType>) =>
      patch<IncidentType>(`/api/incident-types/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/incident-types/${id}`),
  },

  announcements: {
    list: () => get<Paginated<Announcement>>('/api/announcements'),
    create: (data: Omit<Announcement, 'id' | 'date'>) =>
      post<Announcement>('/api/announcements', data),
  },

  notifications: {
    list: () => get<Paginated<Notification>>('/api/notifications'),
    markRead: (id: string | number) =>
      post<void>('/api/notifications/mark-read', { notification_ids: [id] }),
    markAllRead: () =>
      post<void>('/api/notifications/mark-read', { notification_ids: [] }),
  },

  auditLogs: {
    list: () => get<Paginated<AuditLog>>('/api/audit-logs'),
  },

  settings: {
    get: () => get<SystemSettings>('/api/settings'),
    update: (data: Partial<SystemSettings>) => patch<SystemSettings>('/api/settings', data),
  },

  pricing: {
    list: () => get<Paginated<PricingRecord>>('/api/pricing-records'),
    create: (data: Omit<PricingRecord, 'id'>) => post<PricingRecord>('/api/pricing-records', data),
    update: (id: string | number, data: Partial<PricingRecord>) =>
      patch<PricingRecord>(`/api/pricing-records/${id}`, data),
    delete: (id: string | number) => del<void>(`/api/pricing-records/${id}`),
  },

  pcr: {
    list: () => get<Paginated<ProjectChangeRequest>>('/api/pcr'),
    create: (data: Omit<ProjectChangeRequest, 'id' | 'submittedAt' | 'status'>) =>
      post<ProjectChangeRequest>('/api/pcr', data),
    update: (id: string | number, data: Partial<ProjectChangeRequest>) =>
      patch<ProjectChangeRequest>(`/api/pcr/${id}`, data),
    review: (id: string | number, status: 'approved' | 'rejected') =>
      patch<ProjectChangeRequest>(`/api/pcr/${id}/review`, { status }),
  },
};
