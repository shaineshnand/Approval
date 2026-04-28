import './App.css';
import { AppProvider, useApp } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import MyRequests from './components/MyRequests';
import PendingApprovals from './components/PendingApprovals';
import SubmitRequest from './components/SubmitRequest';
import RequestDetail from './components/RequestDetail';
import ApproveDetail from './components/ApproveDetail';
import AuditTrail from './components/AuditTrail';

function AppContent() {
  const { page } = useApp();

  if (page === 'login') return <LoginScreen />;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        {page === 'dashboard'      && <Dashboard />}
        {page === 'my-requests'    && <MyRequests />}
        {page === 'approvals'      && <PendingApprovals />}
        {page === 'submit'         && <SubmitRequest />}
        {page === 'request-detail' && <RequestDetail />}
        {page === 'approve-detail' && <ApproveDetail />}
        {page === 'audit-trail'    && <AuditTrail />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
