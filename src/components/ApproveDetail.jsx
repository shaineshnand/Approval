import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, getFileIcon } from '../utils/helpers';

export default function ApproveDetail() {
  const { selectedRequest: req, user, processApproval, navigate } = useApp();

  const [showSignModal, setShowSignModal]     = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment]     = useState('');
  const [rejectError, setRejectError]         = useState('');

  // Signature state
  const [sigName, setSigName]           = useState('');
  const [sigConfirm, setSigConfirm]     = useState(false);
  const [sigError, setSigError]         = useState('');
  const [sigProcessing, setSigProcessing] = useState(false);
  const [sigComplete, setSigComplete]     = useState(false);

  if (!req) return null;

  const currentLevel = req.currentLevel || 1;
  const hasDocuments = req.attachments.length > 0;

  function handleApproveClick() {
    if (hasDocuments) {
      setShowSignModal(true);
    } else {
      // No docs → approve directly
      processApproval(req.id, currentLevel, 'approved', null, '');
      navigate('approvals');
    }
  }

  function handleSignAndApprove() {
    // Validate
    if (sigName.trim().toLowerCase() !== user.name.toLowerCase()) {
      setSigError('Typed name must match your Microsoft identity: ' + user.name);
      return;
    }
    if (!sigConfirm) {
      setSigError('You must confirm that you have read and approve the document(s).');
      return;
    }
    setSigError('');
    setSigProcessing(true);

    const signatureData = {
      name: user.name,
      email: user.email,
      title: user.title,
      dept: user.dept,
      level: currentLevel,
      type: 'Electronic',
      value: sigName,
      timestamp: new Date().toISOString(),
      docRefs: req.attachments.map(a => a.name),
    };

    setTimeout(() => {
      setSigComplete(true);
      setTimeout(() => {
        processApproval(req.id, currentLevel, 'approved', signatureData, '');
        setShowSignModal(false);
        navigate('approvals');
      }, 1500);
    }, 1200);
  }

  function handleReject() {
    if (!rejectComment.trim()) {
      setRejectError('A comment is mandatory when rejecting a request.');
      return;
    }
    processApproval(req.id, currentLevel, 'rejected', null, rejectComment);
    setShowRejectModal(false);
    navigate('approvals');
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h1 style={{ margin: 0 }}>Review: {req.id}</h1>
            <span className="badge badge-pending">⏳ Level {currentLevel} Approval</span>
          </div>
          <p className="text-muted">{req.type} · Submitted {formatDate(req.submittedAt)}</p>
        </div>
      </div>

      {/* Action Alert */}
      <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <strong>Action Required:</strong> Review this request and {hasDocuments ? 'the attached documents, then provide your electronic signature.' : 'approve or reject.'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Requester */}
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>👤 Requester Information</h3>
            <div className="esig-identity-box">
              <IdField label="Full Name"  value={req.submittedBy.name} />
              <IdField label="Email"      value={req.submittedBy.email} />
              <IdField label="Job Title"  value={req.submittedBy.title} />
              <IdField label="Department" value={req.submittedBy.dept} />
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>📝 Request Description</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{req.description}</p>
          </div>

          {/* Documents */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0 }}>📎 Attached Documents</h3>
              {hasDocuments && <span className="badge badge-info">✍️ Signature Required</span>}
            </div>

            {!hasDocuments ? (
              <div className="alert alert-success">
                ✅ No documents attached. Electronic signature is not required.
              </div>
            ) : (
              <>
                <div className="alert alert-warning" style={{ marginBottom: 14 }}>
                  📖 <strong>Important:</strong> Please read all attached documents before approving.
                </div>
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
              </>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Action Card */}
          <div className="card" style={{ borderColor: 'var(--bsp-green-bright)', background: 'linear-gradient(135deg, #f0faf4 0%, #fff 100%)' }}>
            <h3 style={{ marginBottom: 16 }}>⚡ Your Decision</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn btn-primary btn-lg w-full"
                style={{ justifyContent: 'center' }}
                onClick={handleApproveClick}
                id="approve-btn"
              >
                {hasDocuments ? '✍️ Approve & Sign' : '✅ Approve'}
              </button>

              <button
                className="btn btn-danger w-full"
                style={{ justifyContent: 'center' }}
                onClick={() => setShowRejectModal(true)}
                id="reject-btn"
              >
                ❌ Reject
              </button>
            </div>

            {hasDocuments && (
              <p className="text-xs text-muted" style={{ marginTop: 12 }}>
                Because this request has documents, your electronic signature will be captured upon approval.
              </p>
            )}
          </div>

          {/* Approval Chain Status */}
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>🔗 Approval Chain</h3>
            {req.approvers.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', marginBottom: 6,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--bsp-border)',
                background: a.level === currentLevel ? 'var(--bsp-warning-light)' :
                             a.status === 'approved' ? 'var(--bsp-green-light)' : 'var(--bsp-surface)',
              }}>
                <div className="avatar" style={{
                  width: 28, height: 28, fontSize: '0.65rem',
                  background: a.status === 'approved' ? 'var(--bsp-green-dark)' : undefined,
                }}>
                  {a.status === 'approved' ? '✓' : a.user.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{a.user.name}</div>
                  <div className="text-xs text-muted">Level {a.level}</div>
                </div>
                {a.level === currentLevel && <span className="badge badge-pending">Your Turn</span>}
                {a.status === 'approved' && <span className="badge badge-approved">Done</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── E-Signature Modal ─── */}
      {showSignModal && (
        <div className="modal-overlay" onClick={() => !sigProcessing && setShowSignModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>✍️ Electronic Signature</h2>
              {!sigProcessing && (
                <button className="btn btn-ghost btn-sm" onClick={() => setShowSignModal(false)} style={{ fontSize: '1.2rem', padding: 4 }}>×</button>
              )}
            </div>

            <div className="modal-body">
              {!sigComplete ? (
                <>
                  {/* Signature Confirmation */}
                  <div className="alert alert-warning" style={{ marginBottom: 20 }}>
                    <div>
                      <strong>Signature Confirmation</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#92400e' }}>
                        You are about to electronically sign and approve this request. This action is recorded and cannot be undone.
                      </p>
                    </div>
                  </div>

                  {/* Identity Block */}
                  <h4 style={{ marginBottom: 8, fontSize: '0.8rem' }}>YOUR VERIFIED IDENTITY</h4>
                  <div className="esig-identity-box" style={{ marginBottom: 20 }}>
                    <IdField label="Full Name"     value={user.name} />
                    <IdField label="Job Title"     value={user.title} />
                    <IdField label="Department"    value={user.dept} />
                    <IdField label="Date & Time"   value={new Date().toLocaleString('en-AU')} />
                    <IdField label="Approval Level" value={`Level ${currentLevel}`} />
                    <IdField label="Request ID"    value={req.id} />
                  </div>

                  {/* Documents being signed */}
                  <h4 style={{ marginBottom: 8, fontSize: '0.8rem' }}>DOCUMENTS BEING SIGNED</h4>
                  <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {req.attachments.map(f => (
                      <div key={f.id} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px',
                        background: 'var(--bsp-surface-2)',
                        border: '1px solid var(--bsp-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                      }}>
                        <span>{getFileIcon(f.type)}</span>
                        <span style={{ fontWeight: 500 }}>{f.name}</span>
                        <span className="text-muted text-xs">({f.size})</span>
                      </div>
                    ))}
                  </div>

                  {/* Type your name */}
                  <h4 style={{ marginBottom: 8, fontSize: '0.8rem' }}>TYPE YOUR FULL NAME TO SIGN</h4>
                  <input
                    type="text"
                    className={`esig-input ${sigName && sigName.toLowerCase() === user.name.toLowerCase() ? 'signed' : ''}`}
                    placeholder={`Type: ${user.name}`}
                    value={sigName}
                    onChange={e => setSigName(e.target.value)}
                    id="esig-name-input"
                    autoComplete="off"
                    disabled={sigProcessing}
                  />
                  <p className="text-xs text-muted" style={{ marginTop: 4, marginBottom: 16 }}>
                    Must match your Microsoft identity exactly.
                  </p>

                  {/* Confirmation Checkbox */}
                  <div className="esig-checkbox-row" onClick={() => !sigProcessing && setSigConfirm(!sigConfirm)}>
                    <input
                      type="checkbox"
                      checked={sigConfirm}
                      onChange={e => setSigConfirm(e.target.checked)}
                      disabled={sigProcessing}
                      id="esig-confirm-checkbox"
                    />
                    <span className="esig-checkbox-label">
                      <strong>I confirm that I have read and approve this document.</strong><br />
                      I understand that this electronic signature is legally binding and will be recorded.
                    </span>
                  </div>

                  {sigError && <div className="alert alert-error" style={{ marginTop: 12 }}>{sigError}</div>}
                </>
              ) : (
                /* Success State */
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{
                    width: 72, height: 72,
                    borderRadius: '50%',
                    background: 'var(--bsp-green-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '2rem',
                    border: '3px solid var(--bsp-green-bright)',
                    animation: 'slideUp 0.3s ease',
                  }}>
                    ✓
                  </div>
                  <h2 style={{ color: 'var(--bsp-green-dark)', marginBottom: 8 }}>Signature Captured</h2>
                  <p className="text-muted">Your electronic signature has been recorded and stored securely in SharePoint.</p>
                  <div className="esig-stamp" style={{ marginTop: 20, textAlign: 'left' }}>
                    <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '0.82rem' }}>
                      <div><span className="text-muted text-xs">Approved by:</span><br /><strong>{user.name}</strong></div>
                      <div><span className="text-muted text-xs">Job Title:</span><br /><strong>{user.title}</strong></div>
                      <div><span className="text-muted text-xs">Department:</span><br /><strong>{user.dept}</strong></div>
                      <div><span className="text-muted text-xs">Date:</span><br /><strong>{new Date().toLocaleString('en-AU')}</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!sigComplete && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowSignModal(false)} disabled={sigProcessing}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSignAndApprove}
                  disabled={sigProcessing}
                  id="esig-submit-btn"
                >
                  {sigProcessing ? (
                    <><span className="login-spinner" style={{ width: 16, height: 16 }} /> Signing…</>
                  ) : (
                    '✍️ Sign & Approve'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Rejection Modal ─── */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>❌ Reject Request</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowRejectModal(false)} style={{ fontSize: '1.2rem', padding: 4 }}>×</button>
            </div>

            <div className="modal-body">
              <p className="text-sm" style={{ marginBottom: 16 }}>
                Rejecting this request will stop the approval workflow immediately. The requester will be notified with your reason.
              </p>

              <div className="form-group">
                <label className="form-label">Rejection Reason *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Provide a mandatory reason for rejection…"
                  value={rejectComment}
                  onChange={e => setRejectComment(e.target.value)}
                  rows={4}
                  id="reject-comment-input"
                />
                {rejectError && <span className="text-xs text-error">{rejectError}</span>}
              </div>

              <div className="alert alert-info" style={{ marginTop: 12 }}>
                ℹ️ No electronic signature is required for rejection.
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReject} id="reject-submit-btn">
                ❌ Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
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
