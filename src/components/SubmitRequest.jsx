import { useState } from 'react';
import { useApp } from '../context/AppContext';
import PeoplePicker from './PeoplePicker';
import { requestTypes } from '../data/mockData';
import { generateRequestId, getFileIcon } from '../utils/helpers';

const MAX_APPROVERS = 4;

export default function SubmitRequest() {
  const { user, navigate, submitRequest } = useApp();

  const [type, setType]             = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles]           = useState([]);
  const [approvers, setApprovers]   = useState([null]); // at least 1
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]         = useState({});

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files).map(f => ({
      id: 'f-' + Math.random().toString(36).slice(2, 8),
      name: f.name,
      size: (f.size / 1024).toFixed(0) + ' KB',
      type: f.name.split('.').pop().toLowerCase(),
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }

  function removeFile(id) {
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  function setApprover(index, user) {
    setApprovers(prev => {
      const next = [...prev];
      next[index] = user;
      return next;
    });
  }

  function addApprover() {
    if (approvers.length < MAX_APPROVERS) {
      setApprovers(prev => [...prev, null]);
    }
  }

  function removeApprover(index) {
    if (approvers.length > 1) {
      setApprovers(prev => prev.filter((_, i) => i !== index));
    }
  }

  function validate() {
    const errs = {};
    if (!type) errs.type = 'Select a request type';
    if (!description.trim()) errs.description = 'Enter a description';
    if (!approvers[0]) errs.approvers = 'At least one approver is required';
    // check duplicates
    const ids = approvers.filter(Boolean).map(a => a.id);
    if (new Set(ids).size !== ids.length) errs.approvers = 'Duplicate approvers are not allowed';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);

    const newReq = {
      id: generateRequestId(),
      type,
      description,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      submittedBy: { ...user },
      attachments: files,
      approvers: approvers.filter(Boolean).map((a, i) => ({
        level: i + 1,
        user: a,
        status: i === 0 ? 'pending' : 'waiting',
        signature: null,
        comment: '',
      })),
      currentLevel: 1,
      auditTrail: [
        { type: 'info', actor: user, action: 'Request submitted', time: new Date().toISOString() },
        { type: 'pending', actor: approvers[0], action: 'Awaiting review (Level 1)', time: new Date().toISOString() },
      ],
    };

    setTimeout(() => {
      submitRequest(newReq);
      navigate('request-detail', newReq);
    }, 800);
  }

  const selectedIds = approvers.filter(Boolean).map(a => a.id);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>📝 Submit New Request</h1>
        <p style={{ marginTop: 4, color: 'var(--bsp-text-muted)', fontSize: '0.875rem' }}>
          Complete the form below to submit a new approval request. All fields marked are required.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Main Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Requester Info (Read-Only) */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 14 }}>
              <h3 style={{ margin: 0 }}>👤 Requester Information</h3>
              <span className="badge badge-info">🔒 Read-Only</span>
            </div>
            <div className="esig-identity-box">
              <IdField label="Full Name"   value={user.name} />
              <IdField label="Email"       value={user.email} />
              <IdField label="Job Title"   value={user.title} />
              <IdField label="Department"  value={user.dept} />
            </div>
            <p className="text-xs text-muted" style={{ marginTop: 8 }}>
              Identity sourced from Microsoft Entra ID — cannot be edited.
            </p>
          </div>

          {/* Request Details */}
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>📋 Request Details</h3>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Request Type *</label>
              <select
                className={`form-select ${errors.type ? 'form-error' : ''}`}
                value={type}
                onChange={e => setType(e.target.value)}
                id="input-request-type"
              >
                <option value="">— Select a request type —</option>
                {requestTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <span className="text-xs text-error">{errors.type}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className={`form-textarea ${errors.description ? 'form-error' : ''}`}
                placeholder="Provide a detailed description of your request…"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                id="input-description"
              />
              {errors.description && <span className="text-xs text-error">{errors.description}</span>}
            </div>
          </div>

          {/* Attachments */}
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>📎 Supporting Documents</h3>

            <label htmlFor="file-upload" className="file-upload-zone" id="file-upload-zone">
              <div className="file-upload-icon">📁</div>
              <div className="file-upload-text">Click to upload or drag documents here</div>
              <div className="file-upload-hint">PDF, Word, Excel, PowerPoint — Max 25 MB each</div>
              <input
                type="file"
                id="file-upload"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>

            {files.length > 0 && (
              <div className="file-list">
                {files.map(f => (
                  <div className="file-item" key={f.id}>
                    <span className="file-item-icon">{getFileIcon(f.type)}</span>
                    <div className="file-item-info">
                      <div className="file-item-name">{f.name}</div>
                      <div className="file-item-size">{f.size}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeFile(f.id)} style={{ color: 'var(--bsp-error)', padding: 4 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <div className="alert alert-info" style={{ marginTop: 12 }}>
                ✍️ Documents with attachments will require electronic signatures from approvers.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Approvers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h3 style={{ marginBottom: 6 }}>🔗 Approval Chain</h3>
            <p className="text-xs text-muted" style={{ marginBottom: 16 }}>
              Approvals are processed sequentially. Approver 1 must act before Approver 2, and so on.
            </p>
            {errors.approvers && <div className="alert alert-error" style={{ marginBottom: 12 }}>{errors.approvers}</div>}

            <div className="approver-chain" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {approvers.map((a, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div className="approver-connector">↓</div>
                  )}
                  <div className="approver-row">
                    <div className="approver-level">Level {i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <PeoplePicker
                        selected={a}
                        onChange={u => setApprover(i, u)}
                        excludeIds={[user.id, ...selectedIds]}
                        placeholder={i === 0 ? 'Select approver (required)' : 'Select approver (optional)'}
                      />
                    </div>
                    {i > 0 && (
                      <button className="btn btn-ghost btn-sm" onClick={() => removeApprover(i)} style={{ color: 'var(--bsp-error)', padding: '4px 8px' }}>✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {approvers.length < MAX_APPROVERS && (
              <button className="btn btn-secondary btn-sm w-full" style={{ marginTop: 12, justifyContent: 'center' }} onClick={addApprover} id="add-approver-btn">
                ＋ Add Next Approver
              </button>
            )}

            <div style={{ marginTop: 16, padding: '12px', background: 'var(--bsp-surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--bsp-text-muted)' }}>
              <strong style={{ color: 'var(--bsp-text-secondary)' }}>How it works:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 16 }}>
                <li>Approvals are sequential (not parallel)</li>
                <li>If any approver rejects, the workflow stops</li>
                <li>Documents require electronic signatures</li>
              </ul>
            </div>
          </div>

          {/* Submit */}
          <div className="card" style={{ borderColor: 'var(--bsp-green-bright)' }}>
            <h4 style={{ marginBottom: 8 }}>Ready to Submit?</h4>
            <p className="text-xs text-muted" style={{ marginBottom: 16 }}>
              Your request will be routed to the selected approvers. You will be notified of any actions.
            </p>
            <button
              className="btn btn-primary btn-lg w-full"
              style={{ justifyContent: 'center' }}
              onClick={handleSubmit}
              disabled={submitting}
              id="submit-request-btn"
            >
              {submitting ? (
                <><span className="login-spinner" style={{ width: 18, height: 18 }} /> Submitting…</>
              ) : (
                '🚀 Submit Request'
              )}
            </button>
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
