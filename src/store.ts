import { User, Ticket, ServiceCategory, Worklog, Announcement, Notification, AuditLog, RequestTemplate, IncidentType, Property, Location, Asset, PreventiveMaintenance, InventoryItem, Vendor } from './types';

export const mockVendors: Vendor[] = [
  { id: 'v1', name: 'Otis Elevators', contactName: 'John Smith', email: 'john@otis.com', phone: '555-0101', specialty: 'Elevators', contractStatus: 'active', slaHours: 4 },
  { id: 'v2', name: 'CoolBreeze HVAC', contactName: 'Sarah Connor', email: 'sarah@coolbreeze.com', phone: '555-0102', specialty: 'HVAC', contractStatus: 'active', slaHours: 12 },
  { id: 'v3', name: 'QuickFix Plumbing', contactName: 'Mario Bros', email: 'mario@quickfix.com', phone: '555-0103', specialty: 'Plumbing', contractStatus: 'pending', slaHours: 24 },
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@gcgc.com', role: 'admin', isOnDuty: true },
  { id: 'u2', name: 'Tech John', email: 'john@gcgc.com', role: 'technician', isOnDuty: true },
  { id: 'u3', name: 'Tech Sarah', email: 'sarah@gcgc.com', role: 'technician', isOnDuty: false },
  { id: 'u4', name: 'Req Alice', email: 'alice@hotel.com', role: 'requestor', isOnDuty: true },
  { id: 'u5', name: 'Desk Bob', email: 'bob@gcgc.com', role: 'service_desk', isOnDuty: true },
];

export const mockProperties: Property[] = [
  { id: 'p1', name: 'Hotel Sogo', description: 'Budget hotel chain', collectionTarget: 500000 },
  { id: 'p2', name: 'Eurotel', description: 'European-themed hotel', collectionTarget: 300000 },
];

export const mockLocations: Location[] = [
  { id: 'l1', propertyId: 'p1', name: 'Cubao', address: 'Aurora Blvd, Cubao' },
  { id: 'l2', propertyId: 'p1', name: 'Makati', address: 'Makati Ave' },
  { id: 'l3', propertyId: 'p2', name: 'North EDSA', address: 'EDSA, Quezon City' },
  { id: 'l4', propertyId: 'p2', name: 'Pedro Gil', address: 'Pedro Gil St, Manila' },
];

export const mockAssets: Asset[] = [
  {
    id: 'a1',
    name: 'HVAC Unit - Lobby',
    category: 'HVAC',
    propertyId: 'p1',
    locationId: 'l1',
    status: 'active',
    manufacturer: 'Carrier',
    model: 'X-2000',
    serialNumber: 'SN-HVAC-001',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2028-01-15',
    lastMaintenance: '2024-02-10',
    nextMaintenance: '2024-08-10',
  },
  {
    id: 'a2',
    name: 'Industrial Oven',
    category: 'Kitchen Equipment',
    propertyId: 'p1',
    locationId: 'l1',
    status: 'maintenance',
    manufacturer: 'Vulcan',
    model: 'V-500',
    serialNumber: 'SN-OVEN-002',
    purchaseDate: '2022-05-20',
    warrantyExpiry: '2025-05-20',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-07-05',
  },
  {
    id: 'a3',
    name: 'Elevator 1',
    category: 'Elevator',
    propertyId: 'p2',
    locationId: 'l3',
    status: 'active',
    manufacturer: 'Otis',
    model: 'Gen2',
    serialNumber: 'SN-ELEV-003',
    purchaseDate: '2020-11-10',
    warrantyExpiry: '2030-11-10',
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-06-01',
  }
];

export const mockPreventiveMaintenances: PreventiveMaintenance[] = [
  {
    id: 'pm1',
    title: 'Monthly AC Cleaning',
    description: 'Clean filters and check refrigerant levels for lobby HVAC.',
    assetId: 'a1',
    propertyId: 'p1',
    locationId: 'l1',
    frequency: 'monthly',
    nextDueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    assignedTo: 'u2',
    status: 'active',
  },
  {
    id: 'pm2',
    title: 'Quarterly Elevator Inspection',
    description: 'Perform standard safety checks and lubrication.',
    assetId: 'a3',
    propertyId: 'p2',
    locationId: 'l3',
    frequency: 'quarterly',
    nextDueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    assignedTo: 'u3',
    status: 'active',
  },
  {
    id: 'pm3',
    title: 'Fire Alarm System Test',
    description: 'Test all smoke detectors and alarm panels.',
    propertyId: 'p1',
    locationId: 'l1',
    frequency: 'biannually',
    nextDueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    status: 'active',
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv1',
    name: 'LED Light Bulb 15W',
    sku: 'BULB-LED-15W',
    category: 'Electrical',
    quantity: 45,
    minQuantity: 20,
    unitCost: 5.50,
    propertyId: 'p1',
    locationId: 'l1',
  },
  {
    id: 'inv2',
    name: 'AC Filter 20x20x1',
    sku: 'FILT-AC-20201',
    category: 'HVAC',
    quantity: 8,
    minQuantity: 15,
    unitCost: 12.00,
    propertyId: 'p1',
    locationId: 'l1',
  },
  {
    id: 'inv3',
    name: 'Sink Faucet Cartridge',
    sku: 'PLMB-FAUC-CRT',
    category: 'Plumbing',
    quantity: 12,
    minQuantity: 5,
    unitCost: 25.00,
    propertyId: 'p2',
    locationId: 'l3',
  }
];

export const mockCategories: ServiceCategory[] = [
  { id: 'c1', name: 'Plumbing', description: 'Water, pipes, leaks' },
  { id: 'c2', name: 'Electrical', description: 'Wiring, lights, power' },
  { id: 'c3', name: 'HVAC', description: 'Heating, ventilation, AC' },
  { id: 'c4', name: 'IT Support', description: 'Network, hardware, software' },
];

export const mockRequestTemplates: RequestTemplate[] = [
  { id: 't1', name: 'Leaking Pipe', category: 'Plumbing', priority: 'high', description: 'Water is leaking from [Location]. Please send a plumber immediately.' },
  { id: 't2', name: 'Power Outage', category: 'Electrical', priority: 'critical', description: 'Complete power loss in [Room/Area]. Needs urgent attention.' },
  { id: 't3', name: 'AC Not Cooling', category: 'HVAC', priority: 'medium', description: 'The air conditioning unit in [Room] is blowing warm air.' },
  { id: 't4', name: 'Network Down', category: 'IT Support', priority: 'high', description: 'No internet connection in [Area]. Guests are complaining.' },
];

export const mockIncidentTypes: IncidentType[] = [
  { id: 'i1', name: 'Critical', slaHours: 2, responseSlaHours: 0.5, resolutionSlaHours: 2, description: 'Immediate business impact' },
  { id: 'i2', name: 'High', slaHours: 4, responseSlaHours: 1, resolutionSlaHours: 4, description: 'Significant degradation' },
  { id: 'i3', name: 'Medium', slaHours: 24, responseSlaHours: 4, resolutionSlaHours: 24, description: 'Moderate impact' },
  { id: 'i4', name: 'Low', slaHours: 72, responseSlaHours: 8, resolutionSlaHours: 72, description: 'Minor issue / Request' },
];

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-1001',
    title: 'Leaking faucet in Room 204',
    description: 'The bathroom sink faucet is leaking continuously.',
    category: 'Plumbing',
    priority: 'medium',
    status: 'assigned',
    requestorId: 'u4',
    assigneeId: 'u2',
    propertyId: 'p1',
    locationId: 'l1',
    roomNumber: '204',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    slaDeadline: new Date(Date.now() + 86400000 * 1).toISOString(),
    tasks: [
      { id: 't1', description: 'Inspect faucet cartridge', isCompleted: false },
      { id: 't2', description: 'Replace O-rings if necessary', isCompleted: false },
    ]
  },
  {
    id: 'TKT-1002',
    title: 'AC not cooling in Lobby',
    description: 'The main lobby AC unit is blowing warm air.',
    category: 'HVAC',
    priority: 'high',
    status: 'open',
    requestorId: 'u4',
    propertyId: 'p2',
    locationId: 'l3',
    roomNumber: 'Lobby',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    slaDeadline: new Date(Date.now() + 3600000 * 19).toISOString(),
  },
  {
    id: 'TKT-1003',
    title: 'Wifi down in Conference Room A',
    description: 'Guests cannot connect to the guest wifi network.',
    category: 'IT Support',
    priority: 'critical',
    status: 'in-progress',
    requestorId: 'u4',
    assigneeId: 'u3',
    propertyId: 'p1',
    locationId: 'l2',
    roomNumber: 'Conf Room A',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    slaDeadline: new Date(Date.now() + 3600000 * 2).toISOString(),
    tasks: [
      { id: 't3', description: 'Check router power', isCompleted: true },
      { id: 't4', description: 'Verify ISP connection', isCompleted: false },
    ]
  },
  {
    id: 'TKT-1004',
    title: 'Replace lightbulb in Hallway 3',
    description: 'Flickering lightbulb needs replacement.',
    category: 'Electrical',
    priority: 'low',
    status: 'resolved',
    requestorId: 'u4',
    assigneeId: 'u2',
    propertyId: 'p2',
    locationId: 'l4',
    roomNumber: 'Hallway 3',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    resolvedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    cost: 15.50,
    revenue: 50.00,
    rating: { score: 5, feedback: 'Very fast service!' }
  },
];

export const mockWorklogs: Worklog[] = [
  {
    id: 'w1',
    ticketId: 'TKT-1003',
    technicianId: 'u3',
    activity: 'Restarted router, checking configurations.',
    timeSpentMinutes: 30,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'w2',
    ticketId: 'TKT-1004',
    technicianId: 'u2',
    activity: 'Replaced bulb with LED 15W.',
    timeSpentMinutes: 15,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'System Maintenance Scheduled',
    content: 'The GCG.SYS terminal will undergo maintenance this Sunday from 0200 to 0400 hours.',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    authorId: 'u1'
  },
  {
    id: 'a2',
    title: 'New SLA Guidelines',
    content: 'Please review the updated SLA response times for Critical priority tickets.',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    authorId: 'u1'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u2',
    message: 'New ticket TKT-1001 assigned to you.',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    link: '/tasks/TKT-1001'
  },
  {
    id: 'n2',
    userId: 'u4',
    message: 'Ticket TKT-1004 has been resolved.',
    read: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    link: '/my-requests/TKT-1004'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'al1',
    userId: 'u1',
    action: 'SYSTEM_LOGIN',
    details: 'Admin user logged in.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'al2',
    userId: 'u2',
    action: 'TICKET_UPDATED',
    details: 'Updated status of TKT-1001 to assigned.',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
  }
];
