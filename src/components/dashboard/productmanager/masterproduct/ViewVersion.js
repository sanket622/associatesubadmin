import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Grid, CircularProgress, Paper } from '@mui/material';
import { fetchVersionDetails } from '../../../../redux/masterproduct/tableslice/productsSlice';
import { useParams } from 'react-router';

const ViewVersion = () => {
     const { versionId } = useParams();
  const dispatch = useDispatch();
  const { versionDetails, versionDetailsLoading, versionDetailsError } = useSelector((state) => state.products);

  useEffect(() => {
    if (versionId) {
      dispatch(fetchVersionDetails(versionId));
    }
  }, [dispatch, versionId]);

  if (versionDetailsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (versionDetailsError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {versionDetailsError}
        </Typography>
      </Box>
    );
  }

  if (!versionDetails) {
    return null;
  }

  const { snapshot, masterProduct } = versionDetails;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Version Details: {snapshot.productName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Product Name</Typography>
            <Typography>{snapshot.productName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Version ID</Typography>
            <Typography>{snapshot.versionId}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Status</Typography>
            <Typography>{snapshot.status}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Created At</Typography>
            <Typography>{new Date(snapshot.createdAt).toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Product Code</Typography>
            <Typography>{snapshot.productCode}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Delivery Channel</Typography>
            <Typography>{snapshot.deliveryChannel}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Product Manager</Typography>
            <Typography>{snapshot.productManagerId}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Product Category</Typography>
            <Typography>{snapshot.productCategoryId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Product Description</Typography>
            <Typography>{snapshot.productDescription}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Master Product</Typography>
            <Typography>{masterProduct.productName}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewVersion;
