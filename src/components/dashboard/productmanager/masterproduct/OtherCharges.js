import React from 'react';
import {
    Grid,
    Box,
    Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import Label from '../../../subcompotents/Label';
import RHFTextField from '../../../subcompotents/RHFTextField';
import FormProvider from '../../../subcompotents/FormProvider';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { setEditOtherChargesData, submitOtherCharges } from '../../../../redux/masterproduct/othercharges/otherChargesSlice';
import { useLocation } from 'react-router-dom';
import { setOtherCharges } from '../../../../redux/masterproduct/editmasterproduct/masterProductUpdateSlice';
import { primaryBtnSx } from '../../../subcompotents/UtilityService';
import {

    updateMasterProductDraft
} from '../../../../redux/masterproduct/masterproductdraftslice/masterproductdraft';
const OtherCharges = ({ tabIndex, setTabIndex, totalTabs, status }) => {
    const location = useLocation()
    const mode = location?.state?.mode
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const productDetails = useSelector((state) => state.products.productDetails);
    const editOtherChargesData = useSelector((state) => state.otherCharges.editOtherChargesData);

    const schema = yup.object().shape({
        bounceCharge: yup.number().typeError('Must be a number').required('Required'),
        // dublicateNocCharge: yup.number().typeError('Must be a number').required('Required'),
        furnishingCharge: yup.number().typeError('Must be a number').required('Required'),
        // chequeSwapCharge: yup.number().typeError('Must be a number').required('Required'),
        revocation: yup.number().typeError('Must be a number').required('Required'),
        documentCharge: yup.number().typeError('Must be a number').required('Required'),
        stampDutyCharge: yup.number().typeError('Must be a number').required('Required'),
        nocCharge: yup.number().typeError('Must be a number').required('Required'),
        incidentalCharge: yup.number().typeError('Must be a number').required('Required'),
    });

    const masterProductOtherCharges = productDetails?.masterProductOtherCharges;

    const defaultValues = (productDetails && mode === "EDIT") ? {
        bounceCharge: editOtherChargesData?.bounceCharge ?? masterProductOtherCharges?.bounceCharge ?? '',
        // dublicateNocCharge: editOtherChargesData?.dublicateNocCharge ?? masterProductOtherCharges?.dublicateNocCharge ?? '',
        furnishingCharge: editOtherChargesData?.furnishingCharge ?? masterProductOtherCharges?.furnishingCharge ?? '',
        // chequeSwapCharge: editOtherChargesData?.chequeSwapCharge ?? masterProductOtherCharges?.chequeSwapCharge ?? '',
        revocation: editOtherChargesData?.revocation ?? masterProductOtherCharges?.revocation ?? '',
        documentCharge: editOtherChargesData?.documentCharge ?? masterProductOtherCharges?.documentCharge ?? '',
        stampDutyCharge: editOtherChargesData?.stampDutyCharge ?? masterProductOtherCharges?.stampDutyCharge ?? '',
        nocCharge: editOtherChargesData?.nocCharge ?? masterProductOtherCharges?.nocCharge ?? '',
        incidentalCharge: editOtherChargesData?.incidentalCharge ?? masterProductOtherCharges?.incidentalCharge ?? '',
    } : {
        bounceCharge: '',
        // dublicateNocCharge: '',
        furnishingCharge: '',
        // chequeSwapCharge: '',
        revocation: '',
        documentCharge: '',
        stampDutyCharge: '',
        nocCharge: '',
        incidentalCharge: '',
    };

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const {
        control,
        reset,
        handleSubmit,
        watch,
        formState: { errors }
    } = methods

    const values = watch()
    console.log("values", values);

    useEffect(() => {
        if (productDetails || editOtherChargesData) {
            reset(defaultValues);
        }
    }, [productDetails, editOtherChargesData])


    const onSubmit = (data) => {
        if (mode === "EDIT" && status === "Draft") {
            dispatch(
                updateMasterProductDraft({
                    endpoint: 'updateMasterProductOtherChargesDraft',
                    payload: {
                        masterProductId: productDetails?.id,
                        otherCharges: data,
                    },
                })
            )
                .unwrap()
                .then((res) => {
                    enqueueSnackbar(
                        res?.message || 'Draft saved successfully',
                        { variant: 'success' }
                    );


                    setTabIndex(prev => Math.min(prev + 1, 9));
                })
                .catch((err) => {
                    enqueueSnackbar(
                        err?.message || 'Failed to save draft',
                        { variant: 'error' }
                    );
                });
        }
        else if (mode === "EDIT") {
            dispatch(setOtherCharges(data));
            setTabIndex(prev => Math.min(prev + 1, 9));
        }
        else {
            dispatch(
                submitOtherCharges(data, () => {
                    setTabIndex(prev => Math.min(prev + 1, 9));
                })
            );
        }
    }
    const onError = (e) => console.log(e)

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box>
                <Grid container spacing={2}>
                    {/* Row 1 */}
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="bounceCharge">Cheque Bounce Charges</Label>
                        <RHFTextField name="bounceCharge" id="bounceCharge" type='number' />
                    </Grid>

                    {/* <Grid item xs={12} md={4}>
                        <Label htmlFor="dublicateNocCharge">Charges for issuing duplicate termination papers (Duplicate NOC)</Label>
                        <RHFTextField name="dublicateNocCharge" id="dublicateNocCharge" type='number' />
                    </Grid> */}

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="furnishingCharge">Charges for furnishing statement of account - 2nd time</Label>
                        <RHFTextField name="furnishingCharge" id="furnishingCharge" type='number' />
                    </Grid>

                    {/* <Grid item xs={12} md={4}>
                        <Label htmlFor="chequeSwapCharge">Cheque Swapping Charges</Label>
                        <RHFTextField name="chequeSwapCharge" id="chequeSwapCharge" type='number' />
                    </Grid> */}

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="revocation">Revocation/changes of ECS/ACH instruction charges</Label>
                        <RHFTextField name="revocation" id="revocation" type='number' />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="documentCharge">Charges for issuing copy of any document at borrowers request</Label>
                        <RHFTextField name="documentCharge" id="documentCharge" type='number' />
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
                    {tabIndex + 1} / {totalTabs}
                </Box>
                {
                    (mode === "EDIT") && (
                        < Button
                            sx={primaryBtnSx}
                            variant="outlined"
                            onClick={() => setTabIndex((prev) => Math.max(prev - 1, 0))}
                            disabled={tabIndex === 0}
                        >
                            Back
                        </Button>
                    )
                }
                <Button
                    variant="contained"
                    sx={primaryBtnSx}
                    type="submit"
                >
                    Next
                </Button>
            </Box>
        </FormProvider>
    )
}

export default OtherCharges
