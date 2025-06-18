import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Button, Typography, Divider
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import RHFTextField from '../../subcompotents/RHFTextField'; // Adjust import path as needed
import FormProvider from '../../subcompotents/FormProvider'; // Required for RHFTextField
import { submitArchive } from '../../../redux/varient/archiveVariantSlice';
import Label from '../../subcompotents/Label';
import { useParams } from 'react-router';

const ArchiveDialog = ({ open, onClose, variant }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // ✅ Schema
  const ArchiveSchema = Yup.object().shape({
    reason: Yup.string().required('Archival reason is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ArchiveSchema),
    defaultValues: { reason: '' },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data) => {
  dispatch(submitArchive(
    {
      variantId: variant.id, // ✅ use the actual selected variant id
      reason: data.reason,
      reset,
    },
    {
      enqueueSnackbar,
      onClose,
    }
  ));
};



  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: '#0000FF' }}>Archive</DialogTitle>
      <Divider />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {[
              ['Variant Name', variant.variantName],
              ['Type', variant.variantType],
              ['Code', variant.variantCode],
              ['Product Type', variant.productType],
            ].map(([label, value]) => (
              <Grid item xs={12} md={6} key={label}>
                <Typography fontWeight={600} fontSize="14px" color="#000" mb={0.5}>
                  {label}
                </Typography>
                <Typography fontSize="14px" color="#A0A0A0">
                  {value || '—'}
                </Typography>
              </Grid>
            ))}

            <Grid item xs={12} mt={2}>
                <Label>Reason</Label>
              <RHFTextField
                name="reason"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'green', color: 'white' }}
            type="submit"
          >
            Archive
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default ArchiveDialog;
