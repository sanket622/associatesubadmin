import { useMemo } from 'react';
import { Chip, Paper } from '@mui/material';
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

  const columns = [
    {
      key: 'sno',
      label: 'S.No.',
      render: (_, __, index) => (page - 1) * rowsPerPage + index + 1,
    },
    { key: 'id', label: 'Ticket ID' },
    { key: 'subject', label: 'Subject' },
    { key: 'category', label: 'Category' },
    { key: 'priority', label: 'Priority' },
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
                  : '#ECEFF1',
            color:
              value === 'Open'
                ? '#2E7D32'
                : value === 'In Progress'
                  ? '#E65100'
                  : '#546E7A',
          }}
        />
      ),
    },
    { key: 'createdOn', label: 'Created On' },
  ];

  return (
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
  );
};

export default CustomerManagement;
