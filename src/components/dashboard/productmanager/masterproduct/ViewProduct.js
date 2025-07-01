import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../../../../redux/masterproduct/tableslice/productsSlice';
import { Box, Typography, Grid, Divider, Paper, CircularProgress } from '@mui/material';

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
      <Typography fontWeight="bold" color="#0000FF" sx={{ background: '#F5F5FF' }}>
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

const ViewProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!productDetails) return null;

  const {
    productId,
    productName,
    productCode,
    productDescription,
    deliveryChannel,
    status,
    productCategory,
    loanType,
    MasterProductSegment,
    MasterProductPurpose,
    productPartner,
    eligibilityCriteria,
    creditBureauConfig,
    financialStatements,
    behavioralData,
    riskScoring,
    Collateral,
  } = productDetails;

  return (
    <Box p={{ xs: 1, md: 2 }} maxWidth={1000}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          View Master Product
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Section
          title="General Product Metadata"
          fields={[
            { label: 'Product ID', value: productId },
            { label: 'Product Name', value: productName },
            { label: 'Product Code', value: productCode },
            { label: 'Product Description', value: productDescription },
            { label: 'Delivery Channel', value: deliveryChannel },
            { label: 'Status', value: status },
            { label: 'Product Category', value: productCategory?.categoryName },
            { label: 'Loan Type', value: loanType?.name },
            { label: 'Segment Type', value: MasterProductSegment?.[0]?.productSegment?.name },
            { label: 'Purpose Category', value: MasterProductPurpose?.[0]?.productPurpose?.purpose },
            { label: 'Partner', value: productPartner?.name },
          ]}
        />

        <Section
          title="Eligibility Criteria"
          fields={[
            { label: 'Min Age', value: eligibilityCriteria?.minAge },
            { label: 'Max Age', value: eligibilityCriteria?.maxAge },
            { label: 'Min Monthly Income', value: eligibilityCriteria?.minMonthlyIncome },
            { label: 'Min Business Vintage', value: eligibilityCriteria?.minBusinessVintage },
            { label: 'Min Bureau Score', value: eligibilityCriteria?.minBureauScore },
            { label: 'Document Submission Modes', value: eligibilityCriteria?.documentSubmissionModes?.join(', ') },
            { label: 'Verification Modes', value: eligibilityCriteria?.documentVerificationModes?.join(', ') },
          ]}
        />

        <Section
          title="Credit Bureau Parameters"
          fields={[
            { label: 'Credit Bureau Sources', value: creditBureauConfig?.creditBureauSources?.join(', ') },
            { label: 'Minimum Score Required', value: creditBureauConfig?.minScoreRequired },
            { label: 'Max No. of Active Loans', value: creditBureauConfig?.maxActiveLoans },
            { label: 'Max Credit Utilization Ratio', value: creditBureauConfig?.maxCreditUtilization },
            { label: 'Enquiries Last 6 Months', value: creditBureauConfig?.enquiriesLast6Months },
            { label: 'Delinquency Allowed', value: creditBureauConfig?.loanDelinquencyAllowed },
          ]}
        />

        <Section
          title="Financial Statement Parameters"
          fields={[
            { label: 'Min Monthly Credit', value: financialStatements?.minMonthlyCredit },
            { label: 'Min Average Balance', value: financialStatements?.minAverageBalance },
            { label: 'Bounces in Last 3 Months', value: financialStatements?.bouncesLast3Months },
            { label: 'Cash Deposits Cap (%)', value: financialStatements?.cashDepositsCapPercent },
            { label: 'PDF Parsing Required', value: financialStatements?.pdfParsingRequired ? 'Yes' : 'No' },
          ]}
        />

        <Section
          title="Behavioral & Transaction Data"
          fields={[
            { label: 'Bill Payment History', value: behavioralData?.billPaymentHistory },
            { label: 'Digital Footprint Required', value: behavioralData?.digitalFootprintRequired ? 'Yes' : 'No' },
            { label: 'Repeat Borrower Behavior', value: behavioralData?.repeatBorrowerBehavior },
          ]}
        />

        <Section
          title="Risk & Scoring"
          fields={[
            { label: 'Max DTI Ratio', value: riskScoring?.maxDTI },
            { label: 'Max LTV Ratio', value: riskScoring?.maxLTV },
            { label: 'Co-borrower Required?', value: riskScoring?.coBorrowerRequired ? 'Yes' : 'No' },
          ]}
        />

        <Section
          title="Collateral"
          fields={[
            { label: 'Collateral Type', value: Collateral?.collateralType },
            { label: 'Collateral Value', value: Collateral?.collateralValue },
            { label: 'Collateral Owner', value: Collateral?.collateralOwnerName },
            { label: 'Guarantor Name', value: Collateral?.guarantorName },
            { label: 'Guarantor PAN', value: Collateral?.guarantorPAN },
            { label: 'Guarantor Credit Score', value: Collateral?.guarantorCreditScore },
          ]}
        />
      </Paper>
    </Box>
  );
};

export default ViewProduct;
