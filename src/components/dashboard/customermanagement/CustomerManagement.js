import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DialpadIcon from '@mui/icons-material/Dialpad';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import ReusableTable from '../../subcompotents/ReusableTable';
import {
  addCustomerTicket,
  setCustomerManagementPage,
  setCustomerManagementRowsPerPage,
} from '../../../redux/customerManagement/customerManagementSlice';

const CustomerManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rows, loading, error, page, rowsPerPage } = useSelector(
    (state) => state.customerManagement
  );
  const [searchCustomer, setSearchCustomer] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    platform: '',
  });
  const [draftFilters, setDraftFilters] = useState({
    status: '',
    priority: '',
    platform: '',
  });
  const [createForm, setCreateForm] = useState({
    subject: '',
    customer: '',
    platform: 'Mobile App',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '',
    slaRemaining: '',
  });

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const customerMatches =
        !searchCustomer ||
        item.customer.toLowerCase().includes(searchCustomer.toLowerCase());
      const statusMatches = !filters.status || item.status === filters.status;
      const priorityMatches = !filters.priority || item.priority === filters.priority;
      const platformMatches = !filters.platform || item.platform === filters.platform;
      return customerMatches && statusMatches && priorityMatches && platformMatches;
    });
  }, [rows, searchCustomer, filters]);

  const totalCount = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredRows.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const ticketStats = useMemo(() => {
    const totalOpenCount = rows.filter((item) => item.status === 'Open').length;
    const inProgressCount = rows.filter(
      (item) => item.status === 'In Progress'
    ).length;
    const escalatedCount = rows.filter((item) => item.status === 'Escalated').length;
    const resolvedTodayCount = rows.filter((item) => item.resolvedToday).length;
    const slaBreachedCount = rows.filter((item) => item.slaBreached).length;
    const closedTodayCount = rows.filter((item) => item.closedToday).length;

    return [
      { label: 'Total Open', value: totalOpenCount },
      { label: 'In Progress', value: inProgressCount },
      { label: 'Escalated', value: escalatedCount },
      { label: 'Resolved Today', value: resolvedTodayCount },
      { label: 'SLA Breached', value: slaBreachedCount },
      { label: 'Closed Today', value: closedTodayCount },
    ];
  }, [rows]);

  const columns = [
    { key: 'ticketNumber', label: 'Ticket #' },
    { key: 'subject', label: 'Subject' },
    { key: 'customer', label: 'Customer' },
    { key: 'platform', label: 'Platform' },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => (
        <Chip
          size="small"
          label={value}
          sx={{
            fontWeight: 500,
            backgroundColor:
              value === 'High' ? '#FDECEA' : value === 'Medium' ? '#FFF3E0' : '#E8F5E9',
            color:
              value === 'High' ? '#C62828' : value === 'Medium' ? '#E65100' : '#2E7D32',
          }}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Chip
          size="small"
          label={value}
          sx={{
            fontWeight: 500,
            backgroundColor:
              value === 'Open'
                ? '#E8F5E9'
                : value === 'In Progress'
                  ? '#FFF3E0'
                  : value === 'Escalated'
                    ? '#FDECEA'
                    : '#ECEFF1',
            color:
              value === 'Open'
                ? '#2E7D32'
                : value === 'In Progress'
                  ? '#E65100'
                  : value === 'Escalated'
                    ? '#C62828'
                    : '#546E7A',
          }}
        />
      ),
    },
    { key: 'assignedTo', label: 'Assigned To' },
    {
      key: 'slaRemaining',
      label: 'SLA Remaining',
      render: (value, row) => (
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: row.slaBreached ? '#C62828' : '#2E7D32',
          }}
        >
          {value}
        </Typography>
      ),
    },
    { key: 'createdAt', label: 'Created At' },
  ];

  const headerActions = (
    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
      <Button
        variant="outlined"
        sx={{ textTransform: 'none' }}
        startIcon={<DialpadIcon />}
        onClick={() => navigate('/customer-management/dialer')}
      >
        Dialer
      </Button>
      <Button
        variant="outlined"
        sx={{ textTransform: 'none' }}
        startIcon={<MailOutlineIcon />}
        onClick={() => navigate('/customer-management/mail')}
      >
        Mail
      </Button>
      <Button
        variant="outlined"
        sx={{ textTransform: 'none' }}
        startIcon={<WhatsAppIcon />}
        onClick={() => navigate('/customer-management/whatsapp')}
      >
        WhatsApp
      </Button>
      <Button
        variant="outlined"
        sx={{ textTransform: 'none' }}
        startIcon={<FilterAltOutlinedIcon />}
        onClick={() => {
          setDraftFilters(filters);
          setFilterOpen(true);
        }}
      >
        Filter
      </Button>
      <Button
        variant="contained"
        sx={{ textTransform: 'none', backgroundColor: 'var(--theme-btn-bg)' }}
        startIcon={<AddIcon />}
        onClick={() => setCreateTicketOpen(true)}
      >
        Create Ticket
      </Button>
    </Box>
  );

  const handleSearchChange = (value) => {
    setSearchCustomer(value);
    dispatch(setCustomerManagementPage(1));
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    dispatch(setCustomerManagementPage(1));
    setFilterOpen(false);
  };

  const handleClearFilters = () => {
    const empty = { status: '', priority: '', platform: '' };
    setDraftFilters(empty);
    setFilters(empty);
    dispatch(setCustomerManagementPage(1));
    setFilterOpen(false);
  };

  const formatNow = () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    return `${date} ${time}`;
  };

  const handleCreateTicket = () => {
    if (!createForm.subject || !createForm.customer || !createForm.assignedTo) {
      return;
    }

    const nextTicketNumber = `TCK-${String(1000 + rows.length + 1)}`;
    dispatch(
      addCustomerTicket({
        ticketNumber: nextTicketNumber,
        subject: createForm.subject,
        customer: createForm.customer,
        platform: createForm.platform,
        priority: createForm.priority,
        status: createForm.status,
        assignedTo: createForm.assignedTo,
        slaRemaining: createForm.slaRemaining || '04h 00m',
        createdAt: formatNow(),
        slaBreached: false,
        resolvedToday: false,
        closedToday: false,
      })
    );
    setCreateTicketOpen(false);
    setCreateForm({
      subject: '',
      customer: '',
      platform: 'Mobile App',
      priority: 'Medium',
      status: 'Open',
      assignedTo: '',
      slaRemaining: '',
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, minmax(166px, 1fr))',
            sm: 'repeat(2, minmax(166px, 1fr))',
            md: 'repeat(3, minmax(166px, 1fr))',
            lg: 'repeat(6, minmax(166px, 1fr))',
          },
          columnGap: { xs: 1.5, md: 2 },
          rowGap: 1.5,
          mb: 2.5,
          width: '100%',
        }}
      >
        {ticketStats.map((item) => (
          <Box
            key={item.label}
            sx={{
              width: '100%',
              minWidth: '166px',
              height: '78px',
              borderRadius: '8px',
              opacity: 1,
              border: '1px solid #E3EAF0',
              backgroundColor: '#FFFFFF',
              px: 1.5,
              py: 1.25,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#5B5B5B',
                lineHeight: 1.2,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#084E77',
                lineHeight: 1,
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          width: '100%',
          flex: 1,
        }}
      >
        <ReusableTable
          title="Ticket"
          columns={columns}
          data={paginatedData}
          loading={loading}
          error={error}
          showSearch
          searchValue={searchCustomer}
          onSearchChange={handleSearchChange}
          headerActions={headerActions}
          page={page}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={(newPage) => dispatch(setCustomerManagementPage(newPage))}
          onRowsPerPageChange={(size) =>
            dispatch(setCustomerManagementRowsPerPage(size))
          }
        />
      </Paper>

      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Filter Tickets</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Status"
            value={draftFilters.status}
            onChange={(e) => setDraftFilters((prev) => ({ ...prev, status: e.target.value }))}
            fullWidth
            margin="dense"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Escalated">Escalated</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </TextField>
          <TextField
            select
            label="Priority"
            value={draftFilters.priority}
            onChange={(e) => setDraftFilters((prev) => ({ ...prev, priority: e.target.value }))}
            fullWidth
            margin="dense"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>
          <TextField
            select
            label="Platform"
            value={draftFilters.platform}
            onChange={(e) => setDraftFilters((prev) => ({ ...prev, platform: e.target.value }))}
            fullWidth
            margin="dense"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Mobile App">Mobile App</MenuItem>
            <MenuItem value="Web Portal">Web Portal</MenuItem>
            <MenuItem value="Call Center">Call Center</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters}>Clear</Button>
          <Button onClick={() => setFilterOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApplyFilters}>Apply</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Ticket</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            value={createForm.subject}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, subject: e.target.value }))
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Customer"
            value={createForm.customer}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, customer: e.target.value }))
            }
            fullWidth
            margin="dense"
          />
          <TextField
            select
            label="Platform"
            value={createForm.platform}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, platform: e.target.value }))
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="Mobile App">Mobile App</MenuItem>
            <MenuItem value="Web Portal">Web Portal</MenuItem>
            <MenuItem value="Call Center">Call Center</MenuItem>
          </TextField>
          <TextField
            select
            label="Priority"
            value={createForm.priority}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, priority: e.target.value }))
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            value={createForm.status}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, status: e.target.value }))
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Escalated">Escalated</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </TextField>
          <TextField
            label="Assigned To"
            value={createForm.assignedTo}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, assignedTo: e.target.value }))
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="SLA Remaining"
            value={createForm.slaRemaining}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, slaRemaining: e.target.value }))
            }
            fullWidth
            margin="dense"
            placeholder="02h 30m"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTicketOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTicket}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerManagement;
