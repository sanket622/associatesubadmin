import React from 'react';
import {
    Grid,
    Box,
    Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import Label from '../../subcompotents/Label';
import RHFTextField from '../../subcompotents/RHFTextField';
import FormProvider from '../../subcompotents/FormProvider';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { submitOtherCharges } from '../../../redux/masterproduct/othercharges/otherChargesSlice';

const OtherCharges = ({ tabIndex, setTabIndex, }) => {

  const dispatch = useDispatch();

  const schema = yup.object().shape({
  chequeBounceCharge: yup.number().typeError('Must be a number').required('Required'),
  dublicateNocCharge: yup.number().typeError('Must be a number').required('Required'),
  furnishingCharge: yup.number().typeError('Must be a number').required('Required'),
  chequeSwapCharge: yup.number().typeError('Must be a number').required('Required'),
  revocation: yup.number().typeError('Must be a number').required('Required'),
  documentCopyCharge: yup.number().typeError('Must be a number').required('Required'),
  stampDutyCharge: yup.number().typeError('Must be a number').required('Required'),
  nocCharge: yup.number().typeError('Must be a number').required('Required'),
  incidentalCharge: yup.number().typeError('Must be a number').required('Required'),
});

  // ✅ Setup useForm with validation
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      chequeBounceCharge: '',
      dublicateNocCharge: '',
      furnishingCharge: '',
      chequeSwapCharge: '',
      revocation: '',
      documentCopyCharge: '',
      stampDutyCharge: '',
      nocCharge: '',
      incidentalCharge: '',
    },
  });

  const {
    handleSubmit,
    reset,
  } = methods;

  // ✅ On Submit Handler
  const onSubmit = (data) => {
    dispatch(submitOtherCharges(data, () => {
      // Go to next tab on success
      setTabIndex(prev => prev + 1);
    }));
  };

  const onError = (errors) => {
    console.log("Form validation errors:", errors);
  };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box>
                <Grid container spacing={2}>
                    {/* Row 1 */}
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="chequeBounceCharge">Cheque Bounce Charges</Label>
                        <RHFTextField name="chequeBounceCharge" id="chequeBounceCharge" type='number' />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="dublicateNocCharge">Charges for issuing duplicate termination papers (Duplicate NOC)</Label>
                        <RHFTextField name="dublicateNocCharge" id="dublicateNocCharge" type='number' />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="furnishingCharge">Charges for furnishing statement of account - 2nd time</Label>
                        <RHFTextField name="furnishingCharge" id="furnishingCharge" type='number' />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="chequeSwapCharge">Cheque Swapping Charges</Label>
                        <RHFTextField name="chequeSwapCharge" id="chequeSwapCharge" type='number' />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="revocation">Revocation/changes of ECS/ACH instruction charges</Label>
                        <RHFTextField name="revocation" id="revocation" type='number' />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="documentCopyCharge">Charges for issuing copy of any document at borrowers request</Label>
                        <RHFTextField name="documentCopyCharge" id="documentCopyCharge" type='number' />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="stampDutyCharge">Stamp Duty Charges</Label>
                        <RHFTextField name="stampDutyCharge" id="stampDutyCharge" type='number' />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="nocCharge">NOC Issuance Charges</Label>
                        <RHFTextField name="nocCharge" id="nocCharge" type='number' />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="incidentalCharge">Legal / Collections / Repossession and Incidental Charges</Label>
                        <RHFTextField name="incidentalCharge" id="incidentalCharge" type='number' />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>
                    {tabIndex + 1} / 10
                </Box>
                <Button
                    sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}
                    variant="outlined"
                    onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))}
                    disabled={tabIndex === 0}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}
                    type="submit"
                >
                    Next
                </Button>
            </Box>
        </FormProvider>
    )
}

export default OtherCharges
