import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';

import { fetchVersionDetails } from '../../../../redux/masterproduct/tableslice/productsSlice';

/* ---------------- FIELD CONFIG ---------------- */

const SNAPSHOT_FIELDS = {
  productName: 'Product Name',
  versionId: 'Version',
  status: 'Status',
  productCode: 'Product Code',
  productId: 'Product ID',
  productManagerId: 'Product Manager',
  productCategoryId: 'Product Category',
  loanTypeId: 'Loan Type',
  productDescription: 'Description',
  createdAt: 'Created At',
  updatedAt: 'Updated At',
};

const MASTER_PRODUCT_FIELDS = {
  productName: 'Master Product Name',
  id: 'Master Product ID',
};

/* ---------------- HELPERS ---------------- */

const formatValue = (key, value) => {
  if (!value) return '-';

  if (key.toLowerCase().includes('date') || key.includes('At')) {
    return new Date(value).toLocaleString();
  }

  return value;
};

const KeyValueGrid = ({ title, data, fields }) => (
  <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
    <Typography variant="h6" mb={2} color="primary">
      {title}
    </Typography>

    <Divider sx={{ mb: 2 }} />

    <Grid container spacing={2}>
      {Object.entries(fields).map(([key, label]) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography
            variant="body1"
            fontWeight={500}
            sx={{ wordBreak: 'break-word' }}
          >
            {formatValue(key, data?.[key])}
          </Typography>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

/* ---------------- MAIN COMPONENT ---------------- */

const ViewVersion = () => {
  const { versionId } = useParams();
  const dispatch = useDispatch();

  const {
    versionDetails,
    versionDetailsLoading,
    versionDetailsError,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (versionId) {
      dispatch(fetchVersionDetails(versionId));
    }
  }, [dispatch, versionId]);

  if (versionDetailsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (versionDetailsError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <Typography color="error">{versionDetailsError}</Typography>
      </Box>
    );
  }

  if (!versionDetails) return null;

  const { snapshot, masterProduct } = versionDetails;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3} fontWeight={600}>
        Product Version Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <KeyValueGrid
            title="Version Snapshot"
            data={snapshot}
            fields={SNAPSHOT_FIELDS}
          />
        </Grid>

        <Grid item xs={12}>
          <KeyValueGrid
            title="Master Product"
            data={masterProduct}
            fields={MASTER_PRODUCT_FIELDS}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewVersion;
