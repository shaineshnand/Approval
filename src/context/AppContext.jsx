import { createContext, useContext, useState } from 'react';
import { currentUser, mockRequests } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user]              = useState(currentUser);
  const [requests, setRequests] = useState(mockRequests);
  const [page, setPage]    = useState('login');   // login | dashboard | my-requests | approvals | submit | request-detail | approve-detail

  // Navigation state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approveMode, setApproveMode]         = useState(false);   // true = viewing as approver

  function navigate(p, req = null, asApprover = false) {
    setSelectedRequest(req);
    setApproveMode(asApprover);
    setPage(p);
  }

  function submitRequest(newReq) {
    setRequests(prev => [newReq, ...prev]);
  }

  function processApproval(requestId, level, decision, signatureData, comment) {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      const updatedApprovers = req.approvers.map(a => {
        if (a.level !== level) return a;
        return { ...a, status: decision, signature: signatureData || null, comment: comment || '' };
      });

      const hasNext = req.approvers.some(a => a.level === level + 1);
      const newStatus = decision === 'rejected' ? 'rejected' : hasNext ? 'pending' : 'approved';
      const newLevel  = decision === 'approved' && hasNext ? level + 1 : null;

      const auditEntry = {
        type: decision,
        actor: user,
        action: decision === 'approved'
          ? `Approved (Level ${level})${signatureData ? ' — Electronically signed' : ''}`
          : `Rejected (Level ${level}) — Comment provided`,
        time: new Date().toISOString(),
      };
      const nextEntry = newStatus === 'pending' && hasNext
        ? [{ type: 'pending', actor: req.approvers.find(a => a.level === level + 1)?.user, action: `Awaiting review (Level ${level + 1})`, time: new Date().toISOString() }]
        : [];

      return {
        ...req,
        approvers: updatedApprovers,
        status: newStatus,
        currentLevel: newLevel,
        auditTrail: [...req.auditTrail, auditEntry, ...nextEntry],
      };
    }));
  }

  return (
    <AppContext.Provider value={{ user, requests, page, selectedRequest, approveMode, navigate, submitRequest, processApproval }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
