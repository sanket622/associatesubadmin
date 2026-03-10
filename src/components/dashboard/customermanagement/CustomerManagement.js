import { useMemo } from 'react';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import ReusableTable from '../../subcompotents/ReusableTable';
import {
  setCustomerManagementPage,
  setCustomerManagementRowsPerPage,
} from '../../../redux/customerManagement/customerManagementSlice';

const CustomerManagement = () => {
  const dispatch = useDispatch();
  const { rows, loading, error, page, rowsPerPage } = useSelector(
    (state) => state.customerManagement
  );

  const totalCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return rows.slice(startIndex, startIndex + rowsPerPage);
  }, [rows, page, rowsPerPage]);

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

  return (
    <>
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

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <ReusableTable
          title="Ticket"
          columns={columns}
          data={paginatedData}
          loading={loading}
          error={error}
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
    </>
  );
};

export default CustomerManagement;
