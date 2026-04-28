import { useApp } from '../context/AppContext';
import { getStatusColor, formatDateShort } from '../utils/helpers';

export default function MyRequests() {
  const { requests, navigate } = useApp();

  const sorted = [...requests].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>📋 My Requests</h1>
          <p style={{ marginTop: 4, color: 'var(--bsp-text-muted)', fontSize: '0.875rem' }}>
            All requests you have submitted. Click on a request to view details.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('submit')} id="new-request-btn">
          ＋ New Request
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Attachments</th>
                <th>Approvers</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(req => (
                <tr key={req.id} onClick={() => navigate('request-detail', req)} id={`req-row-${req.id}`}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem', color: 'var(--bsp-green-dark)' }}>
                      {req.id}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{req.type}</span>
                  </td>
                  <td>
                    <span className="truncate" style={{ maxWidth: 220, display: 'inline-block' }}>
                      {req.description}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(req.status)}`}>
                      <span className={`status-dot ${req.status}`} />
                      {capitalize(req.status)}
                    </span>
                  </td>
                  <td>
                    {req.attachments.length > 0 ? (
                      <span className="badge badge-info">📎 {req.attachments.length}</span>
                    ) : (
                      <span className="text-muted text-xs">None</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {req.approvers.map((a, i) => (
                        <div
                          key={i}
                          className="avatar"
                          style={{
                            width: 26, height: 26, fontSize: '0.6rem',
                            border: a.status === 'approved' ? '2px solid var(--bsp-green-bright)' :
                                    a.status === 'rejected' ? '2px solid var(--bsp-error)' :
                                    '2px solid var(--bsp-border)',
                          }}
                          title={`${a.user.name} — ${capitalize(a.status)}`}
                        >
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

      {sorted.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
          <h3>No Requests Yet</h3>
          <p className="text-muted" style={{ marginTop: 8 }}>
            Submit your first request to get started.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('submit')} style={{ marginTop: 16 }}>
            ＋ Submit New Request
          </button>
        </div>
      )}
    </div>
  );
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
