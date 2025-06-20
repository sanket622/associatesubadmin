// VariantAllocationForm.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography, Box, Paper } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import RHFAutocomplete from './RHFAutocomplete';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPartners,
  fetchContractTypes,
  fetchContractCombinations,
  fetchRuleBooks,
  fetchAssignedVariants
} from '../redux/actions';

export default function VariantAllocationForm() {
  const methods = useForm();
  const { watch, setValue } = methods;
  const dispatch = useDispatch();

  const employer = watch('employer');
  const contractType = watch('contractType');
  const combo = watch('contractPaymentCombo');

  const partners = useSelector(state => state.partner.partners);
  const contractTypes = useSelector(state => state.contract.contractTypes);
  const combinations = useSelector(state => state.contract.combinations);
  const ruleBooks = useSelector(state => state.contract.ruleBooks);
  const variants = useSelector(state => state.variant.variants);

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  useEffect(() => {
    if (employer?.value) {
      dispatch(fetchContractTypes(employer.value));
      dispatch(fetchAssignedVariants(employer.value));
    }
  }, [employer, dispatch]);

  useEffect(() => {
    if (contractType?.value) {
      dispatch(fetchContractCombinations(contractType.value));
    }
  }, [contractType, dispatch]);

  useEffect(() => {
    if (combo?.value) {
      dispatch(fetchRuleBooks(combo.value));
    }
  }, [combo, dispatch]);

  const onSubmit = (data) => {
    console.log('Submit:', data);
  };

  return (
    <FormProvider {...methods}>
      <Box p={3}>
        <Typography variant="h5" fontWeight={600} color="#1E1E99">Variant Allocation</Typography>
        <Paper sx={{ p: 3, mt: 2, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} color="#1E1E99" mb={2}>Select Allocation Context</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete
                name="employer"
                label="Employer"
                options={partners}
                getOptionLabel={(option) => option?.name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete
                name="contractType"
                label="Contract Type"
                options={contractTypes}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete
                name="contractPaymentCombo"
                label="Contract-Payment Cycle Combo"
                options={combinations.map(i => ({ label: i.uniqueId, value: i.id }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete
                name="businessLogicRule"
                label="Business Logic Rule ID"
                options={ruleBooks.map(i => ({ label: i.ruleBookId, value: i.id }))}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mt: 2, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} color="#1E1E99" mb={2}>Map Products and Variants</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete
                name="variant"
                label="Select Variant"
                options={variants.map(i => ({ label: i.variantProduct.variantName, value: i.id }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete
                name="repaymentMechanism"
                label="Repayment Mechanism"
                options={[]} // Replace with actual options if available
              />
            </Grid>
          </Grid>
        </Paper>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="inherit" size="large">Cancel</Button>
          <Button variant="contained" size="large" sx={{ bgcolor: '#0000FF' }} onClick={methods.handleSubmit(onSubmit)}>
            Submit Allocation
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}
