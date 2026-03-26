import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetails from './pages/TicketDetails';
import SubmitRequest from './pages/SubmitRequest';
import BusinessIntelligence from './pages/BusinessIntelligence';
import FinancialDashboard from './pages/FinancialDashboard';
import ServiceConfig from './pages/ServiceConfig';
import AdminSettings from './pages/AdminSettings';
import TechnicianPerformance from './pages/TechnicianPerformance';
import MyView from './pages/MyView';
import Reports from './pages/Reports';
import AssetList from './pages/AssetList';
import PreventiveMaintenanceList from './pages/PreventiveMaintenance';
import InventoryList from './pages/InventoryList';
import VendorList from './pages/VendorList';
import ServiceDeskDashboard from './pages/ServiceDeskDashboard';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-text-faint font-mono text-sm animate-pulse">AUTHENTICATING...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="requests" element={
              <ProtectedRoute allowedRoles={['admin', 'service_desk']}>
                <TicketList />
              </ProtectedRoute>
            } />
            <Route path="requests/:id" element={
              <ProtectedRoute allowedRoles={['admin', 'service_desk']}>
                <TicketDetails />
              </ProtectedRoute>
            } />
            <Route path="assets" element={
              <ProtectedRoute allowedRoles={['admin', 'technician']}>
                <AssetList />
              </ProtectedRoute>
            } />
            <Route path="pm" element={
              <ProtectedRoute allowedRoles={['admin', 'technician']}>
                <PreventiveMaintenanceList />
              </ProtectedRoute>
            } />
            <Route path="inventory" element={
              <ProtectedRoute allowedRoles={['admin', 'technician']}>
                <InventoryList />
              </ProtectedRoute>
            } />
            <Route path="vendors" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <VendorList />
              </ProtectedRoute>
            } />
            <Route path="my-view" element={<ProtectedRoute allowedRoles={['admin']}><MyView /></ProtectedRoute>} />
            <Route path="bi" element={<ProtectedRoute allowedRoles={['admin']}><BusinessIntelligence /></ProtectedRoute>} />
            <Route path="financial" element={<ProtectedRoute allowedRoles={['admin']}><FinancialDashboard /></ProtectedRoute>} />
            <Route path="config" element={<ProtectedRoute allowedRoles={['admin']}><ServiceConfig /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute allowedRoles={['admin', 'service_desk']}><AdminSettings /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute allowedRoles={['admin', 'technician', 'service_desk']}><Reports /></ProtectedRoute>} />
            
            {/* Technician Routes */}
            <Route path="tasks" element={
              <ProtectedRoute allowedRoles={['technician']}>
                <TicketList />
              </ProtectedRoute>
            } />
            <Route path="tasks/:id" element={
              <ProtectedRoute allowedRoles={['technician']}>
                <TicketDetails />
              </ProtectedRoute>
            } />
            <Route path="performance" element={<ProtectedRoute allowedRoles={['admin', 'technician', 'service_desk']}><TechnicianPerformance /></ProtectedRoute>} />
            
            {/* Service Desk Routes */}
            <Route path="service-desk" element={
              <ProtectedRoute allowedRoles={['admin', 'service_desk']}>
                <ServiceDeskDashboard />
              </ProtectedRoute>
            } />

            {/* Requestor Routes */}
            <Route path="my-requests" element={
              <ProtectedRoute allowedRoles={['requestor']}>
                <TicketList />
              </ProtectedRoute>
            } />
            <Route path="my-requests/:id" element={
              <ProtectedRoute allowedRoles={['requestor']}>
                <TicketDetails />
              </ProtectedRoute>
            } />
            <Route path="submit" element={
              <ProtectedRoute allowedRoles={['requestor']}>
                <SubmitRequest />
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
    </ThemeProvider>
  );
}
