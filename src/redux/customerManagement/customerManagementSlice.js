import { createSlice } from '@reduxjs/toolkit';

const mockTickets = [
  {
    id: 'TCK-1001',
    subject: 'Salary advance request not submitted',
    category: 'Application',
    priority: 'High',
    status: 'Open',
    createdOn: '2026-03-01',
  },
  {
    id: 'TCK-1002',
    subject: 'Unable to upload bank statement',
    category: 'Document',
    priority: 'Medium',
    status: 'In Progress',
    createdOn: '2026-02-26',
  },
  {
    id: 'TCK-1003',
    subject: 'KYC verification delayed',
    category: 'KYC',
    priority: 'High',
    status: 'Open',
    createdOn: '2026-02-19',
  },
  {
    id: 'TCK-1004',
    subject: 'Disbursal date clarification needed',
    category: 'Disbursal',
    priority: 'Low',
    status: 'Resolved',
    createdOn: '2026-02-15',
  },
  {
    id: 'TCK-1005',
    subject: 'EMI schedule mismatch',
    category: 'Repayment',
    priority: 'Medium',
    status: 'In Progress',
    createdOn: '2026-02-12',
  },
  {
    id: 'TCK-1006',
    subject: 'Need help with profile update',
    category: 'Profile',
    priority: 'Low',
    status: 'Resolved',
    createdOn: '2026-02-08',
  },
  {
    id: 'TCK-1007',
    subject: 'Loan status not updating',
    category: 'Application',
    priority: 'High',
    status: 'Open',
    createdOn: '2026-02-03',
  },
  {
    id: 'TCK-1008',
    subject: 'Document rejected without reason',
    category: 'Document',
    priority: 'Medium',
    status: 'In Progress',
    createdOn: '2026-01-28',
  },
  {
    id: 'TCK-1009',
    subject: 'Interest rate query',
    category: 'Repayment',
    priority: 'Low',
    status: 'Resolved',
    createdOn: '2026-01-22',
  },
  {
    id: 'TCK-1010',
    subject: 'Cannot download sanction letter',
    category: 'Document',
    priority: 'Medium',
    status: 'Open',
    createdOn: '2026-01-18',
  },
];

const initialState = {
  loading: false,
  error: null,
  rows: mockTickets,
  page: 1,
  rowsPerPage: 5,
};

const customerManagementSlice = createSlice({
  name: 'customerManagement',
  initialState,
  reducers: {
    setCustomerManagementPage: (state, action) => {
      state.page = action.payload;
    },
    setCustomerManagementRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload;
      state.page = 1;
    },
  },
});

export const {
  setCustomerManagementPage,
  setCustomerManagementRowsPerPage,
} = customerManagementSlice.actions;

export default customerManagementSlice.reducer;
