import React from 'react';
import {
    Grid,
    Typography,
    Box,
    Checkbox,
    Button,
} from '@mui/material';
import { useFormContext, Controller, useForm } from 'react-hook-form';
import TextFieldComponent from '../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import Label from '../../subcompotents/Label';
import RHFTextField from '../../subcompotents/RHFTextField';
import FormProvider from '../../subcompotents/FormProvider';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { submitOtherCharges, setEditOtherChargesData } from '../../../redux/masterproduct/othercharges/otherChargesSlice';


const OtherCharges = ({ tabIndex, setTabIndex, }) => {

    const dispatch = useDispatch();
    const mode = "CREATE"; // or get from props/context
    const editOtherChargesData = useSelector((state) => state.otherCharges.editOtherChargesData);
    const productDetails = {}; // if needed, pass this from parent or Redux

    const validationSchema = yup.object().shape({
        chequeBounceCharge: yup.number().typeError('Required').min(0, 'Must be positive').required('Required'),
        dublicateNocCharge: yup.number().typeError('Required').min(0, 'Must be positive').required('Required'),
        furnishingCharge: yup.number().typeError('Required').min(0, 'Must be positive').required('Required'),
        chequeSwapCharge: yup.number().typeError('Required').min(0, 'Must be positive').required('Required'),
        revocation: yup.number().typeError('Required').min(0, 'Must be positive').required('Required'),
        documentCopyCharge: yup.number().typeError('Required').min(0, 'Must be positive').required('Required'),
        stampDutyCharge: yup.number().typeError('Required').min(0, 'Must be positive').required('Required'),
        nocCharge: yup.number().typeError('Required').min(0, 'Must be positive').required('Required'),
        incidentalCharge: yup.number().typeError('Required').min(0, 'Must be positive').required('Required'),
        subscriptionGst: yup.string().nullable(),
        gstOnTransactionFee: yup.string().nullable(),
    });

    const defaultValues = {
        chequeBounceCharge: '',
        dublicateNocCharge: '',
        furnishingCharge: '',
        chequeSwapCharge: '',
        revocation: '',
        documentCopyCharge: '',
        stampDutyCharge: '',
        nocCharge: '',
        incidentalCharge: '',
        subscriptionGst: '',
        gstOnTransactionFee: '',
    };

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues
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
            reset(editOtherChargesData || defaultValues);
        }
    }, [productDetails, editOtherChargesData, reset]);



    const onSubmit = (data) => {
        if (mode === "EDIT") {
            // if editing, use PUT or appropriate endpoint
            console.log("Edit mode: submit edit logic here");
        } else {
            dispatch(submitOtherCharges(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    };

    const onError = (errors) => {
        console.log("Validation Errors:", errors);
    };

    useEffect(() => {
        console.log('editEligibilityData');
    }, []);

    useEffect(() => {
        if (editOtherChargesData) {
            reset(editOtherChargesData);
        } else {
            reset(defaultValues);
        }
    }, [editOtherChargesData, reset]);


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
                        <RHFTextField name="dublicateNocCharge" id="dublicateNocCharge" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="furnishingCharge">Charges for furnishing statement of account - 2nd time</Label>
                        <RHFTextField name="furnishingCharge" id="furnishingCharge" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="chequeSwapCharge">Cheque Swapping Charges</Label>
                        <RHFTextField name="chequeSwapCharge" id="chequeSwapCharge" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="revocation">Revocation/changes of ECS/ACH instruction charges</Label>
                        <RHFTextField name="revocation" id="revocation" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="documentCopyCharge">Charges for issuing copy of any document at borrowers request</Label>
                        <RHFTextField name="documentCopyCharge" id="documentCopyCharge" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="stampDutyCharge">Stamp Duty Charges</Label>
                        <RHFTextField name="stampDutyCharge" id="stampDutyCharge" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="nocCharge">NOC Issuance Charges</Label>
                        <RHFTextField name="nocCharge" id="nocCharge" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="incidentalCharge">Legal / Collections / Repossession and Incidental Charges</Label>
                        <RHFTextField name="incidentalCharge" id="incidentalCharge" />
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
