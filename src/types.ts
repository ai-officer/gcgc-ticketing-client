export type Role = 'admin' | 'technician' | 'requestor' | 'service_desk';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isOnDuty?: boolean;
}

export interface Property {
  id: string;
  name: string;
  description?: string;
  collectionTarget?: number;
}

export interface Location {
  id: string;
  propertyId: string;
  name: string;
  address?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  propertyId: string;
  locationId: string;
  status: 'active' | 'maintenance' | 'retired';
  purchaseDate?: string;
  warrantyExpiry?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
}

export interface PreventiveMaintenance {
  id: string;
  title: string;
  description: string;
  assetId?: string;
  propertyId: string;
  locationId?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';
  nextDueDate: string;
  assignedTo?: string;
  status: 'active' | 'paused';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unitCost: number;
  locationId?: string; // Where it's stored
  propertyId: string;
}

export type TicketStatus = 'open' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface Rating {
  score: number; // 1-5
  feedback?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  specialty: string;
  contractStatus: 'active' | 'expired' | 'pending';
  slaHours: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  requestorId: string;
  assigneeId?: string;
  vendorId?: string; // Added for vendor assignment
  vendorCost?: number; // Added to track vendor cost
  propertyId?: string;
  locationId?: string;
  roomNumber?: string;
  assetId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  respondedAt?: string;
  slaDeadline?: string;
  responseSlaDeadline?: string;
  cost?: number;
  revenue?: number; // Added for financial dashboard
  tasks?: Task[]; // Added for checklists
  rating?: Rating; // Added for customer rating
  escalated?: boolean; // Added for SLA escalation
  partsDeducted?: boolean; // Flag to prevent double deduction
}

export interface Worklog {
  id: string;
  ticketId: string;
  technicianId: string;
  activity: string;
  timeSpentMinutes: number;
  createdAt: string;
  partsUsed?: { inventoryId: string; quantity: number }[];
  photos?: string[]; // Array of photo URLs
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  authorId: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface RequestTemplate {
  id: string;
  name: string;
  category: string;
  priority: TicketPriority;
  description: string;
}

export interface IncidentType {
  id: string;
  name: string;
  slaHours: number;
  responseSlaHours: number;
  resolutionSlaHours: number;
  description: string;
  businessHoursOnly?: boolean;
  escalationLevel?: number;
}

export interface PricingRecord {
  id: string;
  serviceName: string;
  category: string;
  price: number;
  effectiveDate: string;
  notes?: string;
}

export interface ProjectChangeRequest {
  id: string;
  title: string;
  description: string;
  impactAnalysis: string;
  costImpact: number;
  scheduleImpactDays: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface SystemSettings {
  branding: {
    logoUrl: string;
    primaryColor: string;
    companyName: string;
  };
  modules: {
    inventory: boolean;
    vendors: boolean;
    financials: boolean;
    preventiveMaintenance: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    slackEnabled: boolean;
  };
}
