import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate, useParams } from 'react-router-dom';

import ReusableTable from '../../../subcompotents/ReusableTable';
import { fetchProductVersions } from '../../../../redux/masterproduct/tableslice/productsSlice';

const VersionHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { masterProductId } = useParams();

  const {
    productVersions = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (masterProductId) {
      dispatch(fetchProductVersions(masterProductId));
    }
  }, [dispatch, masterProductId]);

 
  const tableData = productVersions.map((version) => ({
    id: version.id,
    versionId: version.versionId,
    status: version.snapshot?.status || '-',
    createdAt: version.snapshot?.createdAt
      ? new Date(version.snapshot.createdAt).toLocaleString()
      : '-',
    productName: version.snapshot?.productName || '-',
  }));

 
  const columns = [
    {
      key: 'versionId',
      label: 'Version',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'createdAt',
      label: 'Created At',
    },
    {
      key: 'productName',
      label: 'Product Name',
    },
    {
      key: 'action',
      label: 'Actions',
      render: (_, row) => (
        <IconButton onClick={() => navigate(`/view-version/${row.id}`)}>
          <VisibilityIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <ReusableTable
        title="Product Version History"
        columns={columns}
        data={tableData}
        loading={loading}
        error={error}
        showSearch={false}
        showFilter={false}
        page={page}
        rowsPerPage={limit}
        totalCount={productVersions.length}
        totalPages={Math.ceil(productVersions.length / limit)}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={() => { }}
      />
    </Paper>
  );
};

export default VersionHistory;
