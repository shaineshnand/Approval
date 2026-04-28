import { useApp } from '../context/AppContext';
import { getStatusColor, formatDate, getFileIcon } from '../utils/helpers';

export default function RequestDetail() {
  const { selectedRequest: req, navigate } = useApp();
  if (!req) return null;

  return (
    <div className="page-content">
      {/* Header */}
      <div className="request-detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h1 style={{ margin: 0 }}>{req.id}</h1>
            <span className={`badge ${getStatusColor(req.status)}`}>
              <span className={`status-dot ${req.status}`} />
              {capitalize(req.status)}
            </span>
          </div>
          <p className="text-muted">{req.type} · Submitted {formatDate(req.submittedAt)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Requester Info */}
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>👤 Requester</h3>
            <div className="esig-identity-box">
              <IdField label="Full Name"  value={req.submittedBy.name} />
              <IdField label="Email"      value={req.submittedBy.email} />
              <IdField label="Job Title"  value={req.submittedBy.title} />
              <IdField label="Department" value={req.submittedBy.dept} />
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>📝 Description</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--bsp-text-primary)' }}>
              {req.description}
            </p>
          </div>

          {/* Documents */}
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>📎 Attached Documents</h3>
            {req.attachments.length === 0 ? (
              <p className="text-muted text-sm">No documents attached to this request.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {req.attachments.map(f => (
                  <div className="doc-preview-card" key={f.id}>
                    <span className="doc-icon">{getFileIcon(f.type)}</span>
                    <div className="doc-info">
                      <div className="doc-name">{f.name}</div>
                      <div className="doc-meta">{f.size} · {f.type.toUpperCase()}</div>
                    </div>
                    <span className="doc-open-hint">Open in Microsoft Viewer →</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Electronic Signatures */}
          {req.approvers.some(a => a.signature) && (
            <div className="card">
              <h3 style={{ marginBottom: 14 }}>✍️ Electronic Signatures</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {req.approvers.filter(a => a.signature).map((a, i) => (
                  <div className="esig-stamp" key={i}>
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', fontSize: '0.85rem' }}>
                        <div><span className="text-muted text-xs">Approved by:</span><br /><strong>{a.signature.name}</strong></div>
                        <div><span className="text-muted text-xs">Job Title:</span><br /><strong>{a.user.title}</strong></div>
                        <div><span className="text-muted text-xs">Department:</span><br /><strong>{a.user.dept}</strong></div>
                        <div><span className="text-muted text-xs">Date:</span><br /><strong>{formatDate(a.signature.timestamp)}</strong></div>
                        <div><span className="text-muted text-xs">Signature Type:</span><br /><strong>{a.signature.type}</strong></div>
                        <div><span className="text-muted text-xs">Approval ID:</span><br /><strong>{req.id}</strong></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Approval Progress */}
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>🔗 Approval Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {req.approvers.map((a, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20, margin: '0 0 0 16px' }}>
                      <div style={{ width: 2, height: '100%', background: a.status === 'approved' ? 'var(--bsp-green-dark)' : 'var(--bsp-border)' }} />
                    </div>
                  )}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${a.status === 'approved' ? 'var(--bsp-green-bright)' : a.status === 'rejected' ? 'var(--bsp-error)' : 'var(--bsp-border)'}`,
                    background: a.status === 'approved' ? 'var(--bsp-green-light)' : a.status === 'rejected' ? 'var(--bsp-error-light)' : 'var(--bsp-surface)',
                  }}>
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.7rem',
                      background: a.status === 'approved' ? 'var(--bsp-green-dark)' :
                                   a.status === 'rejected' ? 'var(--bsp-error)' :
                                   'linear-gradient(135deg, var(--bsp-green-bright), var(--bsp-green-dark))',
                    }}>
                      {a.status === 'approved' ? '✓' : a.status === 'rejected' ? '✕' : a.user.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{a.user.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--bsp-text-muted)' }}>
                        Level {a.level} · {a.user.title}
                      </div>
                    </div>
                    <span className={`badge ${getStatusColor(a.status)}`} style={{ fontSize: '0.7rem' }}>
                      {capitalize(a.status)}
                    </span>
                  </div>
                  {a.status === 'rejected' && a.comment && (
                    <div className="alert alert-error" style={{ marginTop: 8 }}>
                      <strong>Reason:</strong> {a.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail */}
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>🕐 Activity Timeline</h3>
            <div className="timeline">
              {req.auditTrail.map((entry, i) => (
                <div className="timeline-item" key={i}>
                  <div className={`timeline-icon ${entry.type}`}>
                    {entry.type === 'approved' ? '✓' : entry.type === 'rejected' ? '✕' : entry.type === 'pending' ? '⏳' : 'ℹ'}
                  </div>
                  <div className="timeline-line" />
                  <div className="timeline-content">
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 2 }}>{entry.action}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--bsp-text-muted)' }}>
                      {entry.actor?.name} · {formatDate(entry.time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SharePoint Info */}
          <div className="card" style={{ background: 'var(--bsp-surface-2)' }}>
            <h4 style={{ marginBottom: 8 }}>📁 SharePoint Storage</h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--bsp-text-muted)', lineHeight: 1.6 }}>
              <div>📍 Site: <strong>BSP Life – Approvals</strong></div>
              <div>📂 Library: <strong>/Requests/{req.id}</strong></div>
              <div>🔒 Permissions: <strong>Restricted</strong></div>
              <div>📊 Version History: <strong>Enabled</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IdField({ label, value }) {
  return (
    <div>
      <div className="esig-field-label">{label}</div>
      <div className="esig-field-value">{value}</div>
    </div>
  );
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
