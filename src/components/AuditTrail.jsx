import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/helpers';

export default function AuditTrail() {
  const { requests } = useApp();

  // Flatten all audit entries across all requests
  const allEntries = requests.flatMap(req =>
    req.auditTrail.map(entry => ({ ...entry, requestId: req.id, requestType: req.type }))
  ).sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>🔍 Audit Trail</h1>
        <p style={{ marginTop: 4, color: 'var(--bsp-text-muted)', fontSize: '0.875rem' }}>
          Complete activity log across all requests. Data sourced from SharePoint audit logging.
        </p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Request</th>
                <th>Type</th>
                <th>Action</th>
                <th>Actor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allEntries.map((entry, i) => (
                <tr key={i}>
                  <td className="text-sm" style={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{formatDate(entry.time)}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.82rem', color: 'var(--bsp-green-dark)' }}>
                      {entry.requestId}
                    </span>
                  </td>
                  <td className="text-sm">{entry.requestType}</td>
                  <td className="text-sm" style={{ fontWeight: 500 }}>{entry.action}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {entry.actor && (
                        <>
                          <div className="avatar" style={{ width: 24, height: 24, fontSize: '0.6rem' }}>
                            {entry.actor.initials || entry.actor.name?.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </div>
                          <span className="text-sm">{entry.actor.name}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      entry.type === 'approved' ? 'badge-approved' :
                      entry.type === 'rejected' ? 'badge-rejected' :
                      entry.type === 'pending'  ? 'badge-pending'  : 'badge-info'
                    }`}>
                      {entry.type === 'approved' ? '✓ Approved' :
                       entry.type === 'rejected' ? '✕ Rejected' :
                       entry.type === 'pending'  ? '⏳ Pending' : 'ℹ Info'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--bsp-surface-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.5rem' }}>🔒</span>
          <div>
            <h4 style={{ marginBottom: 2 }}>SharePoint Audit Compliance</h4>
            <p className="text-sm text-muted">
              All audit records are stored as immutable entries in SharePoint Online with version history enabled.
              Records include electronic signature data, timestamps, and linked document references for full compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
