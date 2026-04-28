import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { key: 'dashboard',    icon: '🏠', label: 'Dashboard' },
  { key: 'my-requests',  icon: '📋', label: 'My Requests' },
  { key: 'approvals',    icon: '✅', label: 'Pending Approvals', badge: 1 },
  { key: 'audit-trail',  icon: '🔍', label: 'Audit Trail' },
];

export default function Sidebar() {
  const { page, navigate, user } = useApp();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <BSPLogo />
        <span className="sidebar-logo-text">Approval Portal</span>
      </div>

      <div className="sidebar-section-label">Navigation</div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            className={`nav-item ${page === item.key ? 'active' : ''}`}
            onClick={() => navigate(item.key)}
            id={`nav-${item.key}`}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
          </button>
        ))}
      </nav>

      {/* Submit CTA */}
      <div style={{ padding: '0 8px 8px' }}>
        <button
          className="btn btn-primary w-full"
          onClick={() => navigate('submit')}
          id="nav-submit-btn"
          style={{ justifyContent: 'center' }}
        >
          ＋ New Request
        </button>
      </div>

      {/* User */}
      <div className="sidebar-user">
        <div className="avatar" style={{ fontSize: '0.8rem' }}>{user.initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user.name}</div>
          <div className="sidebar-user-role">{user.title}</div>
        </div>
      </div>
    </aside>
  );
}

function BSPLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="rgba(255,255,255,0.12)"/>
      <path d="M10 18 C10 11 17 8 22 11 C19 11 13 15 13 22 C17 22 22 18 24 12 C24 20 21 26 13 26 C10 26 10 22 10 18Z" fill="#3aba6f"/>
      <path d="M13 22 L21 14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
