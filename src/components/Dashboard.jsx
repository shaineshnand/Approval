import { useApp } from '../context/AppContext';
import { getStatusColor, formatDateShort } from '../utils/helpers';

export default function Dashboard() {
  const { requests, navigate, user } = useApp();

  const stats = {
    total:    requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const recentRequests = [...requests].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5);

  return (
    <div className="page-content">
      {/* Greeting */}
      <div className="page-header">
        <h1>Good {getGreeting()}, {user.name.split(' ')[0]} 👋</h1>
        <p style={{ marginTop: 4, color: 'var(--bsp-text-muted)', fontSize: '0.9rem' }}>
          Here's an overview of your approval activity. Today is {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="📋" label="Total Requests" value={stats.total} iconBg="#e8f7ee" iconColor="#3aba6f" change="+2 this month" changeType="up" />
        <StatCard icon="⏳" label="Pending"         value={stats.pending} iconBg="#fffbeb" iconColor="#d97706" change="Action required" changeType="down" />
        <StatCard icon="✅" label="Approved"        value={stats.approved} iconBg="#e8f7ee" iconColor="#3aba6f" change="All-time" changeType="up" />
        <StatCard icon="❌" label="Rejected"        value={stats.rejected} iconBg="#fff5f5" iconColor="#e53e3e" change="All-time" changeType="" />
      </div>

      {/* Main Grid */}
      <div className="content-grid">
        {/* Recent Requests */}
        <div className="card" style={{ padding: 0 }}>
          <div className="card-header" style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--bsp-border)' }}>
            <h3 style={{ margin: 0 }}>Recent Requests</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('my-requests')}>View All →</button>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Approvers</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(req => (
                  <tr key={req.id} onClick={() => navigate('request-detail', req)} id={`row-${req.id}`}>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.82rem', color: 'var(--bsp-green-dark)' }}>{req.id}</span></td>
                    <td>{req.type}</td>
                    <td><span className={`badge ${getStatusColor(req.status)}`}><span className={`status-dot ${req.status}`} />{capitalize(req.status)}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {req.approvers.map((a, i) => (
                          <div key={i} className="avatar" style={{ width: 26, height: 26, fontSize: '0.65rem', opacity: a.status === 'approved' ? 1 : 0.5 }} title={a.user.name}>
                            {a.user.initials}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="text-muted text-sm">{formatDateShort(req.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Pending Action */}
          <div className="card" style={{ borderColor: 'var(--bsp-green-bright)', background: 'linear-gradient(135deg, var(--bsp-green-light) 0%, #fff 100%)' }}>
            <h4 style={{ marginBottom: 12, color: 'var(--bsp-green-darker)' }}>🔔 Action Required</h4>
            {requests.filter(r => r.status === 'pending').length > 0 ? (
              <>
                <p className="text-sm" style={{ marginBottom: 12 }}>
                  You have <strong>{requests.filter(r => r.status === 'pending').length}</strong> request(s) awaiting action.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('approvals')}>
                  View Pending Approvals
                </button>
              </>
            ) : (
              <p className="text-sm text-muted">You're all caught up! No pending actions.</p>
            )}
          </div>

          {/* User Profile Card */}
          <div className="card">
            <h4 style={{ marginBottom: 14 }}>🪪 My Identity</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div className="avatar avatar-lg">{user.initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                <div className="text-sm text-muted">{user.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <ProfileField label="Job Title"   value={user.title} />
              <ProfileField label="Department"  value={user.dept} />
              <ProfileField label="Manager"     value={user.manager} />
            </div>
            <div style={{ marginTop: 12 }}>
              <span className="badge badge-info">🔒 Microsoft Entra ID Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h4 style={{ marginBottom: 12 }}>⚡ Quick Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('submit')}>📝 Submit New Request</button>
              <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('approvals')}>✅ Review Approvals</button>
              <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('audit-trail')}>🔍 View Audit Trail</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, iconBg, iconColor, change, changeType }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: iconBg }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {change && <div className={`stat-change ${changeType}`}>{change}</div>}
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid var(--bsp-border)' }}>
      <span className="text-muted">{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
