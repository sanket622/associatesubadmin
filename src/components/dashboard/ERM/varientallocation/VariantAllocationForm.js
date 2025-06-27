// VariantAllocationForm.jsx
import React, { useEffect } from 'react';
import { Grid, Button, Typography, Box, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPartners,
  fetchContractTypes,
  fetchContractCombinations,
  fetchRuleBooks,
  fetchAssignedVariants,
} from '../redux/varientallocation/featuresSlice';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import FormProvider from '../../../subcompotents/FormProvider';
import Label from '../../../subcompotents/Label';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { submitProductAllocation } from '../redux/varientallocation/productAllocationSlice';

export default function VariantAllocationForm({ onClose }) {
  const VariantAllocationSchema = yup.object().shape({
    employer: yup.object().required('Employer is required'),
    contractType: yup.object().required('Contract type is required'),
    contractPaymentCombo: yup.object().required('Contract-Payment Combo is required'),
    businessLogicRule: yup.object().required('Business Logic Rule is required'),
    variant: yup.object().required('Variant is required'),
  });


  const methods = useForm({
    resolver: yupResolver(VariantAllocationSchema),
  });

  const { watch, handleSubmit, onError } = methods;

  const dispatch = useDispatch();

  const employer = watch('employer');
  const contractType = watch('contractType');
  const combo = watch('contractPaymentCombo');

  const partners = useSelector((state) => state.features.partners);
  const contractTypes = useSelector((state) => state.features.contractTypes);
  const combinations = useSelector((state) => state.features.combinations);
  const ruleBooks = useSelector((state) => state.features.ruleBooks);
  const variants = useSelector((state) => state.features.variants);

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
    const payload = {
      employerId: data.employer?.value,
      contractTypeId: data.contractType?.value,
      contractCombinationId: data.contractPaymentCombo?.value,
      ruleBookId: data.businessLogicRule?.value,
      productVariantId: data.variant?.value,
    };

    dispatch(submitProductAllocation(payload, () => {
      if (onClose) onClose(); 
    }));
  };


  return (   
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
      <Box p={3}>
        <Typography variant="h5" fontWeight={600} color="#0000FF">
          Variant Allocation
        </Typography>

        <Paper sx={{ p: 3, mt: 2, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} color="#0000FF" mb={2}>
            Select Allocation Context
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Label>Employer</Label>
              <RHFAutocomplete
                name="employer"
                options={partners}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Label>Contract Type</Label>
              <RHFAutocomplete
                name="contractType"
                options={contractTypes}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Label>Contract-Payment Cycle Combo</Label>
              <RHFAutocomplete
                name="contractPaymentCombo"
                options={combinations}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Label>Business Logic Rule ID</Label>
              <RHFAutocomplete
                name="businessLogicRule"
                options={ruleBooks}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mt: 2, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} color="#0000FF" mb={2}>
            Map Products and Variants
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Label>Select Variant</Label>
              <RHFAutocomplete
                name="variant"
                options={variants}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box mt={5} display="flex" justifyContent="space-between">
          <Button onClick={onClose} variant="outlined" sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}
            onClick={methods.handleSubmit(onSubmit)}
          >
            Submit Allocation
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}
