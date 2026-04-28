import { useApp } from '../context/AppContext';
import { getStatusColor, formatDate, formatDateShort } from '../utils/helpers';

export default function PendingApprovals() {
  const { requests, navigate } = useApp();

  // Simulate: show all pending requests (in production, filter for current user as approver)
  const pending = requests.filter(r => r.status === 'pending');

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>✅ Pending Approvals</h1>
        <p style={{ marginTop: 4, color: 'var(--bsp-text-muted)', fontSize: '0.875rem' }}>
          Requests awaiting your review and approval. Click on a request to take action.
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
          <h3>You're All Caught Up!</h3>
          <p className="text-muted" style={{ marginTop: 8 }}>
            No pending approvals at this time. Check back later.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pending.map(req => (
            <div
              key={req.id}
              className="card"
              style={{ cursor: 'pointer', transition: 'all 0.2s', padding: 0 }}
              onClick={() => navigate('approve-detail', req, true)}
              id={`approval-card-${req.id}`}
            >
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: 'var(--bsp-green-dark)' }}>{req.id}</span>
                      <span className={`badge ${getStatusColor(req.status)}`}>
                        <span className={`status-dot ${req.status}`} />
                        Level {req.currentLevel} Review
                      </span>
                      {req.attachments.length > 0 && (
                        <span className="badge badge-info">📎 {req.attachments.length} Doc{req.attachments.length > 1 ? 's' : ''}</span>
                      )}
                    </div>
                    <h3 style={{ margin: 0 }}>{req.type}</h3>
                  </div>
                  <div className="text-sm text-muted">Submitted {formatDateShort(req.submittedAt)}</div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--bsp-text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  {req.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.65rem' }}>{req.submittedBy.initials}</div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{req.submittedBy.name}</div>
                      <div className="text-xs text-muted">{req.submittedBy.title} · {req.submittedBy.dept}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {req.attachments.length > 0 && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--bsp-warning)', fontWeight: 600 }}>
                        ✍️ Signature Required
                      </span>
                    )}
                    <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate('approve-detail', req, true); }}>
                      Review →
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{
                height: 4,
                borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                background: 'var(--bsp-border)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${(req.approvers.filter(a => a.status === 'approved').length / req.approvers.length) * 100}%`,
                  background: 'linear-gradient(90deg, var(--bsp-green-bright), var(--bsp-green-dark))',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
