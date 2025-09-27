import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import RegisterPage from '../components/Auth/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import KanbanPage from '../pages/Kanban/KanbanPage';
import LoginPage from '../components/Auth/LoginPage';
import NotificationPage from '../pages/Notifications/NotificationPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />      
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />      
      <Route path="/projects/:projectId/kanban" element={<ProtectedRoute><KanbanPage /></ProtectedRoute>} />      
      <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
