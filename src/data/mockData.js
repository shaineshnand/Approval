// Mock Microsoft 365 users for People Picker simulation
export const mockUsers = [
  { id: 'u1', name: 'Avinesh Kumar',    email: 'avinesh.kumar@bsplife.com.pg',   title: 'Manager – Finance',       dept: 'Finance',           initials: 'AK' },
  { id: 'u2', name: 'Sera Tabe',        email: 'sera.tabe@bsplife.com.pg',       title: 'Senior HR Business Partner', dept: 'Human Resources',  initials: 'ST' },
  { id: 'u3', name: 'Michael Pono',     email: 'michael.pono@bsplife.com.pg',    title: 'Chief Operations Officer', dept: 'Operations',        initials: 'MP' },
  { id: 'u4', name: 'Diane Vagi',       email: 'diane.vagi@bsplife.com.pg',      title: 'Legal Counsel',            dept: 'Legal',             initials: 'DV' },
  { id: 'u5', name: 'James Kila',       email: 'james.kila@bsplife.com.pg',      title: 'IT Manager',               dept: 'Information Technology', initials: 'JK' },
  { id: 'u6', name: 'Rachel Mondo',     email: 'rachel.mondo@bsplife.com.pg',    title: 'Finance Officer',          dept: 'Finance',           initials: 'RM' },
  { id: 'u7', name: 'Peter Gime',       email: 'peter.gime@bsplife.com.pg',      title: 'Compliance Manager',       dept: 'Risk & Compliance', initials: 'PG' },
  { id: 'u8', name: 'Helen Sios',       email: 'helen.sios@bsplife.com.pg',      title: 'Executive Assistant',      dept: 'Executive Office',  initials: 'HS' },
];

// Logged-in user
export const currentUser = {
  id: 'u0',
  name: 'Shaine Shnand',
  email: 'shaine.shnand@bsplife.com.pg',
  title: 'Business Analyst',
  dept: 'Strategy & Planning',
  manager: 'Michael Pono',
  initials: 'SS',
};

// Request types
export const requestTypes = [
  'Contract Approval',
  'Budget Authorisation',
  'Policy Amendment',
  'Procurement Request',
  'HR Action',
  'IT Access Request',
  'Legal Review',
  'Vendor Onboarding',
  'Capital Expenditure',
  'Other',
];

// Mock Requests
export const mockRequests = [
  {
    id: 'REQ-2026-001',
    type: 'Contract Approval',
    description: 'Annual software licensing contract renewal with Microsoft for Office 365 services. Total value: PGK 485,000.',
    status: 'pending',
    submittedAt: '2026-04-25T09:14:00Z',
    submittedBy: { ...currentUser },
    attachments: [
      { id: 'f1', name: 'MS_Contract_2026.pdf', size: '2.1 MB', type: 'pdf' },
      { id: 'f2', name: 'Cost_Breakdown.xlsx',  size: '340 KB', type: 'xlsx' },
    ],
    approvers: [
      { level: 1, user: mockUsers[0], status: 'approved',
        signature: { name: 'Avinesh Kumar', timestamp: '2026-04-25T11:30:00Z', type: 'Electronic' },
        comment: '' },
      { level: 2, user: mockUsers[2], status: 'pending', signature: null, comment: '' },
    ],
    currentLevel: 2,
    auditTrail: [
      { type: 'info',     actor: currentUser,  action: 'Request submitted',         time: '2026-04-25T09:14:00Z' },
      { type: 'approved', actor: mockUsers[0], action: 'Approved (Level 1) — Electronically signed', time: '2026-04-25T11:30:00Z' },
      { type: 'pending',  actor: mockUsers[2], action: 'Awaiting review (Level 2)', time: '2026-04-25T11:30:00Z' },
    ],
  },
  {
    id: 'REQ-2026-002',
    type: 'Procurement Request',
    description: 'Purchase of 20 laptop computers for the new Port Moresby branch office team.',
    status: 'approved',
    submittedAt: '2026-04-20T08:00:00Z',
    submittedBy: { ...currentUser },
    attachments: [
      { id: 'f3', name: 'Laptop_Quote.pdf', size: '890 KB', type: 'pdf' },
    ],
    approvers: [
      { level: 1, user: mockUsers[1], status: 'approved',
        signature: { name: 'Sera Tabe', timestamp: '2026-04-20T14:00:00Z', type: 'Electronic' }, comment: '' },
      { level: 2, user: mockUsers[0], status: 'approved',
        signature: { name: 'Avinesh Kumar', timestamp: '2026-04-21T09:00:00Z', type: 'Electronic' }, comment: '' },
    ],
    currentLevel: null,
    auditTrail: [
      { type: 'info',     actor: currentUser,  action: 'Request submitted',                        time: '2026-04-20T08:00:00Z' },
      { type: 'approved', actor: mockUsers[1], action: 'Approved (Level 1) — Electronically signed', time: '2026-04-20T14:00:00Z' },
      { type: 'approved', actor: mockUsers[0], action: 'Approved (Level 2) — Electronically signed', time: '2026-04-21T09:00:00Z' },
    ],
  },
  {
    id: 'REQ-2026-003',
    type: 'Policy Amendment',
    description: 'Proposed update to the Travel & Expense Policy — increasing daily meal allowance for international travel.',
    status: 'rejected',
    submittedAt: '2026-04-18T11:00:00Z',
    submittedBy: { ...currentUser },
    attachments: [],
    approvers: [
      { level: 1, user: mockUsers[6], status: 'rejected', signature: null, comment: 'Policy amendment requires Executive Committee endorsement before submission. Please resubmit with EC minutes.' },
    ],
    currentLevel: null,
    auditTrail: [
      { type: 'info',     actor: currentUser,  action: 'Request submitted',                              time: '2026-04-18T11:00:00Z' },
      { type: 'rejected', actor: mockUsers[6], action: 'Rejected (Level 1) — Comment provided', time: '2026-04-18T15:20:00Z' },
    ],
  },
  {
    id: 'REQ-2026-004',
    type: 'IT Access Request',
    description: 'Requesting elevated SharePoint permissions for the Strategy team to access the Board Documents library.',
    status: 'pending',
    submittedAt: '2026-04-28T07:45:00Z',
    submittedBy: { ...currentUser },
    attachments: [
      { id: 'f4', name: 'Access_Justification.docx', size: '120 KB', type: 'docx' },
    ],
    approvers: [
      { level: 1, user: mockUsers[4], status: 'pending', signature: null, comment: '' },
    ],
    currentLevel: 1,
    auditTrail: [
      { type: 'info', actor: currentUser, action: 'Request submitted', time: '2026-04-28T07:45:00Z' },
      { type: 'pending', actor: mockUsers[4], action: 'Awaiting review (Level 1)', time: '2026-04-28T07:45:00Z' },
    ],
  },
];

// Requests awaiting the current approver's action (simulated as mockUsers[2])
export const pendingForApproval = [mockRequests[0]];
