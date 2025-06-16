import React from 'react';
import {
    Grid,
    Switch,
    FormControlLabel,
    Typography,
    Box,
    FormControl,
    RadioGroup,
    Radio,
    Checkbox,
    Button
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import TextFieldComponent from '../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import Label from '../../subcompotents/Label';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import FormProvider from '../../subcompotents/FormProvider';
import RHFTextField from '../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../subcompotents/RHFAutocomplete';
import { setEditBehavioralData, submitBehavioralData } from '../../../redux/masterproduct/behaviraldata/behavioralDataSlice';
import { useLocation } from 'react-router';
import { useEffect } from 'react';



export const billPaymentHistoryOptions = [
    { id: 'BBPS', name: 'BBPS' },
    { id: 'UPI', name: 'UPI' },
    { id: 'WALLET', name: 'Wallet' },
    { id: 'NOT_USED', name: 'Not Used' },
];

export const borrowerBehaviorOptions = [
    { id: 'ONE_PLUS_LOANS_REPAID_ON_TIME', name: '1+ Loans Repaid On Time' },
    { id: 'DELINQUENT_IN_PAST_LOAN', name: 'Delinquent in Past Loan' },
    { id: 'NEW_CUSTOMER', name: 'New Customer' },
    { id: 'ONLY_INTERNAL_HISTORY', name: 'Only Internal History' },
    { id: 'EXTERNAL_HISTORY', name: 'External History' },
];

const BehavioralTransactionDataParameters = ({ tabIndex, setTabIndex }) => {

    const location = useLocation()
    const mode = location?.state?.mode
    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.products.productDetails);
    const editBehavioralData = useSelector((state) => state.createProduct.editBehavioralData);

    const schema = yup.object().shape({
        latePaymentFeeValue: yup
            .number()
            .typeError('Salary Regularity Threshold must be a number')
            .required('This field is required'),

        prepaymentFeeType: yup
            .number()
            .typeError('Spending Consistency must be a number')
            .required('This field is required'),

        overallGst: yup
            .number()
            .typeError('UPI Spend to Income Ratio must be a number')
            .required('This field is required'),

        disbursementMode: yup
            .object()
            .nullable()
            .required('Bill Payment History is required'),

        repaymentMode: yup
            .string()
            .required('Location Consistency is required'),

        emiFrequency: yup
            .object()
            .nullable()
            .required('Repeat Borrower Behavior is required'),

        pdfParsingOrJsonRequired: yup
            .string()
            .required('Please select an option'),
    });

    const behavioralData = editBehavioralData || productDetails?.behavioralData;

    const defaultValues = (productDetails && mode === "EDIT") ? {

  latePaymentFeeValue:
    editBehavioralData?.latePaymentFeeValue ??
    behavioralData?.salaryRegularityThreshold ??
    '',

  prepaymentFeeType:
    editBehavioralData?.prepaymentFeeType ??
    behavioralData?.spendingConsistencyPercent ??
    '',

  overallGst:
    editBehavioralData?.overallGst ??
    behavioralData?.upiSpendToIncomeRatio ??
    '',

  disbursementMode:
    billPaymentHistoryOptions.find(
      option =>
        option.id === editBehavioralData?.disbursementMode ||
        option.id === behavioralData?.billPaymentHistory
    ) ?? null,

  repaymentMode:
    editBehavioralData?.repaymentMode ??
    behavioralData?.locationConsistencyKm?.toString() ??
    '',

  emiFrequency:
    borrowerBehaviorOptions.find(
      option =>
        option.id === editBehavioralData?.emiFrequency ||
        option.id === behavioralData?.repeatBorrowerBehavior
    ) ?? null,

  pdfParsingOrJsonRequired:
    (editBehavioralData?.pdfParsingOrJsonRequired ??
      behavioralData?.digitalFootprintRequired) === true
      ? 'yes'
      : (editBehavioralData?.pdfParsingOrJsonRequired ??
          behavioralData?.digitalFootprintRequired) === false
      ? 'no'
      : '',
} : {

    }

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = methods

    const values = watch()
    console.log("values", values);

    useEffect(() => {
        if (productDetails || editBehavioralData) {
            reset(defaultValues)
        }
    }, [productDetails, editBehavioralData])


    const onSubmit = (data) => {
        if (mode === "EDIT") {
            dispatch(setEditBehavioralData(data))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(submitBehavioralData(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }
    const onError = (e) => console.log(e)
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box>
                <Grid container spacing={2}>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="latePaymentFeeValue">Salary Regularity Threshold</Label>
                        <RHFTextField name="latePaymentFeeValue" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="prepaymentFeeType">Spending Consistency</Label>
                        <RHFTextField name="prepaymentFeeType" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="overallGst">UPI Spend to Income Ratio</Label>
                        <RHFTextField name="overallGst" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="disbursementMode">Bill Payment History</Label>
                        <RHFAutocomplete
                            name="disbursementMode"
                            options={billPaymentHistoryOptions}
                            getOptionLabel={(option) => option.name}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="repaymentMode">Location Consistency</Label>
                        <RHFTextField name="repaymentMode" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="emiFrequency">Repeat Borrower Behavior</Label>
                        <RHFAutocomplete
                            name="emiFrequency"
                            options={borrowerBehaviorOptions}
                            getOptionLabel={(option) => option.name}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl component="fieldset">
                            <Label>Digital Footprint Required?</Label>
                            <Controller
                                name="pdfParsingOrJsonRequired"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup row {...field}>
                                        <FormControlLabel
                                            value="yes"
                                            control={
                                                <Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />
                                            }
                                            label="Yes"
                                        />
                                        <FormControlLabel
                                            value="no"
                                            control={
                                                <Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />
                                            }
                                            label="No"
                                        />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                    </Grid>

                </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / 10</Box>
                <Button sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} variant="outlined" onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))} disabled={tabIndex === 0}>Back</Button>
                <Button variant="contained" sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} type="submit">Next</Button>
            </Box>

        </FormProvider>
    );
};
export default BehavioralTransactionDataParameters
