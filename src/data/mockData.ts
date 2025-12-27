export interface Equipment {
  id: string;
  name: string;
  category: 'Machine' | 'IT' | 'Vehicle';
  location: string;
  status: 'Active' | 'Scrap';
  team: string;
  openRequests: number;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  equipmentId: string;
  equipmentName: string;
  assignedTechnician: {
    name: string;
    avatar: string;
  };
  type: 'Preventive' | 'Corrective';
  status: 'New' | 'In Progress' | 'Repaired' | 'Scrap';
  scheduledDate: string;
  isOverdue?: boolean;
}

export const equipment: Equipment[] = [
  { id: 'eq1', name: 'CNC Milling Machine', category: 'Machine', location: 'Building A - Floor 1', status: 'Active', team: 'Manufacturing', openRequests: 2 },
  { id: 'eq2', name: 'Industrial Laser Cutter', category: 'Machine', location: 'Building A - Floor 2', status: 'Active', team: 'Manufacturing', openRequests: 1 },
  { id: 'eq3', name: 'Server Rack #12', category: 'IT', location: 'Data Center', status: 'Active', team: 'IT Operations', openRequests: 0 },
  { id: 'eq4', name: 'Forklift FL-203', category: 'Vehicle', location: 'Warehouse B', status: 'Active', team: 'Logistics', openRequests: 1 },
  { id: 'eq5', name: 'HVAC Unit Central', category: 'Machine', location: 'Building B - Roof', status: 'Active', team: 'Facilities', openRequests: 0 },
  { id: 'eq6', name: 'Delivery Truck T-15', category: 'Vehicle', location: 'Parking Lot', status: 'Active', team: 'Logistics', openRequests: 3 },
  { id: 'eq7', name: 'Network Switch Core', category: 'IT', location: 'Server Room', status: 'Active', team: 'IT Operations', openRequests: 0 },
  { id: 'eq8', name: 'Old Printer Unit', category: 'IT', location: 'Storage', status: 'Scrap', team: 'IT Operations', openRequests: 0 },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr1',
    title: 'Replace worn spindle bearings',
    equipmentId: 'eq1',
    equipmentName: 'CNC Milling Machine',
    assignedTechnician: { name: 'Mike Chen', avatar: 'MC' },
    type: 'Corrective',
    status: 'New',
    scheduledDate: '2024-01-15',
    isOverdue: true,
  },
  {
    id: 'mr2',
    title: 'Quarterly lubrication service',
    equipmentId: 'eq1',
    equipmentName: 'CNC Milling Machine',
    assignedTechnician: { name: 'Sarah Miller', avatar: 'SM' },
    type: 'Preventive',
    status: 'In Progress',
    scheduledDate: '2024-01-20',
  },
  {
    id: 'mr3',
    title: 'Calibrate laser alignment',
    equipmentId: 'eq2',
    equipmentName: 'Industrial Laser Cutter',
    assignedTechnician: { name: 'John Davis', avatar: 'JD' },
    type: 'Preventive',
    status: 'New',
    scheduledDate: '2024-01-22',
  },
  {
    id: 'mr4',
    title: 'Hydraulic system check',
    equipmentId: 'eq4',
    equipmentName: 'Forklift FL-203',
    assignedTechnician: { name: 'Mike Chen', avatar: 'MC' },
    type: 'Preventive',
    status: 'In Progress',
    scheduledDate: '2024-01-18',
  },
  {
    id: 'mr5',
    title: 'Brake pad replacement',
    equipmentId: 'eq6',
    equipmentName: 'Delivery Truck T-15',
    assignedTechnician: { name: 'Sarah Miller', avatar: 'SM' },
    type: 'Corrective',
    status: 'Repaired',
    scheduledDate: '2024-01-10',
  },
  {
    id: 'mr6',
    title: 'Engine oil change',
    equipmentId: 'eq6',
    equipmentName: 'Delivery Truck T-15',
    assignedTechnician: { name: 'John Davis', avatar: 'JD' },
    type: 'Preventive',
    status: 'New',
    scheduledDate: '2024-01-25',
  },
  {
    id: 'mr7',
    title: 'Tire rotation and inspection',
    equipmentId: 'eq6',
    equipmentName: 'Delivery Truck T-15',
    assignedTechnician: { name: 'Mike Chen', avatar: 'MC' },
    type: 'Preventive',
    status: 'Repaired',
    scheduledDate: '2024-01-12',
  },
  {
    id: 'mr8',
    title: 'Dispose old printer',
    equipmentId: 'eq8',
    equipmentName: 'Old Printer Unit',
    assignedTechnician: { name: 'Sarah Miller', avatar: 'SM' },
    type: 'Corrective',
    status: 'Scrap',
    scheduledDate: '2024-01-05',
  },
];

export const calendarEvents = [
  { date: '2024-01-15', title: 'CNC Bearing Replacement', type: 'Corrective' as const },
  { date: '2024-01-18', title: 'Forklift Hydraulic Check', type: 'Preventive' as const },
  { date: '2024-01-20', title: 'CNC Lubrication Service', type: 'Preventive' as const },
  { date: '2024-01-22', title: 'Laser Calibration', type: 'Preventive' as const },
  { date: '2024-01-25', title: 'Truck Oil Change', type: 'Preventive' as const },
  { date: '2024-01-28', title: 'HVAC Filter Replacement', type: 'Preventive' as const },
];
