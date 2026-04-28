import { useApp } from '../context/AppContext';
import { getStatusColor, formatDateShort } from '../utils/helpers';
import { mockRequests } from '../data/mockData';

const PAGE_TITLES = {
  dashboard:      'Dashboard',
  'my-requests':  'My Requests',
  approvals:      'Pending Approvals',
  'audit-trail':  'Audit Trail',
  submit:         'New Request',
  'request-detail': 'Request Details',
  'approve-detail': 'Review & Approve',
};

export default function TopBar() {
  const { page, navigate } = useApp();

  const pendingCount = mockRequests.filter(r => r.status === 'pending').length;

  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        {(page === 'request-detail' || page === 'approve-detail' || page === 'submit') && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(page === 'approve-detail' ? 'approvals' : page === 'request-detail' ? 'my-requests' : 'dashboard')}
            style={{ padding: '6px 10px' }}
          >
            ← Back
          </button>
        )}
        <h2 className="topbar-title" style={{ margin: 0 }}>{PAGE_TITLES[page] || page}</h2>
      </div>

      <div className="topbar-right">
        {/* MS 365 Indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: '0.75rem', color: 'var(--bsp-text-muted)',
          padding: '4px 10px',
          border: '1px solid var(--bsp-border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bsp-surface-2)',
        }}>
          <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Microsoft 365 Connected
        </div>

        <button className="notification-btn" id="topbar-notifications" title="Notifications">
          🔔
          {pendingCount > 0 && <span className="notification-dot" />}
        </button>
      </div>
    </header>
  );
}
