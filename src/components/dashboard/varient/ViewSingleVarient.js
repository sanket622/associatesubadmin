import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVariantProductDetail } from '../../../redux/varient/variantSingleSlice';
import {
  Box, Typography, Grid, Divider, Paper, CircularProgress
} from '@mui/material';

const Section = ({ title, fields }) => (
  <Box mb={4}>
    <Box
      sx={{
        background: '#EEF2FF',
        py: 1,
        px: 2,
        borderTop: '1px solid #CBD5E1',
        borderBottom: '1px solid #CBD5E1',
        borderRadius: '8px 8px 0 0',
      }}
    >
      <Typography fontWeight="bold" color="#0000FF">
        {title}
      </Typography>
    </Box>
    <Box px={2}>
      <Grid container spacing={2} py={2}>
        {fields.map(({ label, value }, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Typography variant="body2" fontWeight={600} color="#1F2937">
              {label}
            </Typography>
            <Typography variant="body2" color="#6B7280">
              {value ?? 'N/A'}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

const ViewSingleVarient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { variantDetail, loading, error } = useSelector((state) => state.variantSingle);

  useEffect(() => {
    if (id) dispatch(fetchVariantProductDetail(id));
  }, [dispatch, id]);

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!variantDetail) return null;

  const {
    variantName,
    variantType,
    variantCode,
    productType,
    remark,
    masterProduct,
    VariantProductParameter,
    VariantProductOtherCharges,
    VariantProductRepayment,
  } = variantDetail;

  return (
    <Box p={{ xs: 1, md: 2 }} maxWidth={1000}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          View Variant Product
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Section
          title="Variant Info"
          fields={[
            { label: 'Variant Name', value: variantName },
            { label: 'Variant Type', value: variantType },
            { label: 'Variant Code', value: variantCode },
            { label: 'Product Type', value: productType },
            { label: 'Remark', value: remark },
          ]}
        />

        <Section
          title="Master Product Info"
          fields={[
            { label: 'Product Name', value: masterProduct?.productName },
            { label: 'Product ID', value: masterProduct?.productId },
            { label: 'Product Code', value: masterProduct?.productCode },
            { label: 'Status', value: masterProduct?.status },
          ]}
        />

        <Section
          title="Loan Parameters"
          fields={[
            { label: 'Min Loan Amount', value: VariantProductParameter?.minLoanAmount },
            { label: 'Max Loan Amount', value: VariantProductParameter?.maxLoanAmount },
            { label: 'Tenure (Months)', value: `${VariantProductParameter?.minTenure} - ${VariantProductParameter?.maxTenure}` },
            { label: 'Interest Rate', value: `${VariantProductParameter?.interestRateMin}% - ${VariantProductParameter?.interestRateMax}%` },
            { label: 'EMI Frequency', value: VariantProductParameter?.emiFrequency },
            { label: 'Penal Interest Rate', value: VariantProductParameter?.penalInterestRate },
          ]}
        />

        <Section
          title="Other Charges"
          fields={[
            { label: 'Cheque Bounce Charge', value: VariantProductOtherCharges?.bounceCharge },
            { label: 'Duplicate NOC Charge', value: VariantProductOtherCharges?.nocCharge },
            { label: 'Furnishing Charge', value: VariantProductOtherCharges?.furnishingCharge },
            { label: 'Revocation', value: VariantProductOtherCharges?.revocation },
            { label: 'Stamp Duty', value: VariantProductOtherCharges?.stampDutyCharge },
          ]}
        />

        <Section
          title="Repayment Info"
          fields={[
            { label: 'Penal Interest Applicable', value: VariantProductRepayment?.penalInterestApplicable ? 'Yes' : 'No' },
            { label: 'Incentive Type', value: VariantProductRepayment?.incentiveType || 'N/A' },
            { label: 'Incentive Value', value: VariantProductRepayment?.incentiveValue },
          ]}
        />
      </Paper>
    </Box>
  );
};

export default ViewSingleVarient;
