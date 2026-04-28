export function getInitials(name = '') {
  return name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase();
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDateShort(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function getFileIcon(type) {
  switch (type) {
    case 'pdf':  return '📄';
    case 'docx': return '📝';
    case 'xlsx': return '📊';
    case 'pptx': return '📋';
    case 'png':
    case 'jpg':  return '🖼️';
    default:     return '📎';
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'approved': return 'badge-approved';
    case 'rejected': return 'badge-rejected';
    case 'pending':  return 'badge-pending';
    default:         return 'badge-draft';
  }
}

export function generateRequestId() {
  const y = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 900) + 100);
  return `REQ-${y}-${n}`;
}
