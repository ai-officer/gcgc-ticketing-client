import React from 'react';
import { useAppContext } from '../context/AppContext';
import AdminDashboard from './AdminDashboard';
import TechnicianDashboard from './TechnicianDashboard';
import RequestorDashboard from './RequestorDashboard';
import ServiceDeskDashboard from './ServiceDeskDashboard';
import AnnouncementsWidget from '../components/AnnouncementsWidget';

const Dashboard = () => {
  const { user } = useAppContext();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <AnnouncementsWidget />
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'technician' && <TechnicianDashboard />}
      {user.role === 'requestor' && <RequestorDashboard />}
      {user.role === 'service_desk' && <ServiceDeskDashboard />}
    </div>
  );
};

export default Dashboard;
