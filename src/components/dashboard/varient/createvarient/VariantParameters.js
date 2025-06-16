import React from 'react';
import {
    Grid,
    Box,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../../subcompotents/RHFTextField';
import Label from '../../../subcompotents/Label';
import FormProvider from '../../../subcompotents/FormProvider';
import { useDispatch } from 'react-redux';
import { submitVariantProductParameter } from '../../../../redux/varient/submitslice/variantProductParameterSubmitSlice';

const VariantSchema = Yup.object().shape({
    minimumLoanAmount: Yup.string().required('Minimum Loan Amount is required'),
    maximumLoanAmount: Yup.string().required('Maximum Loan Amount is required'),
    interestRateMin: Yup.string().required('Interest Rate Range (Min) is required'),
    interestRateMax: Yup.string().required('Interest Rate Range (Max) is required'),
    processingFeeValue: Yup.mixed().required('Processing Fee Value is required'),
    latePaymentFeeType: Yup.object().required('Late Payment Fee Type is required'),
    latePaymentFeeValue: Yup.string().required('Late Payment Fee Value is required'),
    prepaymentFeeValue: Yup.string().required('Prepayment Fee Value is required'),
    penalInterestRate: Yup.string().required('Penal Interest Rate is required'),
    penalInterestConditions: Yup.string().required('Penal Interest Conditions is required'),
    // coBorrowerRequiredForLowScore: Yup.string().required('Penal Interest Rate Applicable is required'),
    interestRateType: Yup.mixed().required('Interest Rate Type is required'),
    processingFeeType: Yup.mixed().required('Processing Fee Type is required'),
    prepaymentFeeType: Yup.mixed().required('Prepayment Fee Type is required'),
    emiFrequency: Yup.mixed().required('EMI Frequency is required'),
});

const defaultValues = {
    minimumLoanAmount: '',
    maximumLoanAmount: '',
    tenureOptions: null,
    interestRateType: null,
    interestRateMin: '',
    interestRateMax: '',
    processingFeeType: '',
    processingFeeValue: null,
    latePaymentFeeType: '',
    latePaymentFeeValue: '',
    prepaymentFeeType: '',
    prepaymentFeeValue: '',
    emiFrequency: '',
    penalInterestRate: '',
    penalInterestConditions: '',
    coBorrowerRequiredForLowScore: '',
};

const VariantParameters = ({ setTabIndex, tabIndex }) => {

    const interestRateTypes = [
        { id: 'FLAT', name: 'Flat' },
        { id: 'REDUCING', name: 'Reducing' },
        { id: 'ZERO', name: 'Zero' },
        { id: 'CUSTOM', name: 'Custom' },
    ];

    const feeTypes = [
        { id: 'FLAT', name: 'Flat' },
        { id: 'PERCENTAGE', name: 'Percentage' },
        { id: 'NONE', name: 'None' },
    ];

    const emiFrequencies = [
        { id: 'Daily', name: 'Daily' },
        { id: 'Weekly', name: 'Weekly' },
        { id: 'Biweekly', name: 'Biweekly' },
        { id: 'Monthly', name: 'Monthly' },
        { id: 'Custom', name: 'Custom' },
    ];

    const dispatch = useDispatch();

    const methods = useForm({
        resolver: yupResolver(VariantSchema),
        defaultValues,
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = (data) => {
        dispatch(submitVariantProductParameter(data, () => {
            setTabIndex((prev) => prev + 1);
        }));
    };

    const onError = (e) => {
        console.log(e);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="minimumLoanAmount">Minimum Loan Amount</Label>
                        <RHFTextField name="minimumLoanAmount" id="minimumLoanAmount" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="maximumLoanAmount">Maximum Loan Amount</Label>
                        <RHFTextField name="maximumLoanAmount" id="maximumLoanAmount" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="maxTenureMonths">Maximum Tenure Months</Label>
                        <RHFTextField name="maxTenureMonths" id="maxTenureMonths" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="minTenureMonths">Minimum Tenure Months</Label>
                        <RHFTextField name="minTenureMonths" id="minTenureMonths" />
                    </Grid>


                    <Grid item xs={12} md={4}>
                        <Label htmlFor="interestRateType">Interest Rate Type</Label>
                        <RHFAutocomplete
                            name="interestRateType"
                            id="interestRateType"
                            options={interestRateTypes}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="interestRateMin">Interest Rate Range  (Min)</Label>
                        <RHFTextField name="interestRateMin" id="interestRateMin" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="interestRateMax">Interest Rate Range  (Max)</Label>
                        <RHFTextField name="interestRateMax" id="interestRateMax" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="processingFeeType">Processing Fee Type</Label>
                        <RHFAutocomplete
                            name="processingFeeType"
                            id="processingFeeType"
                            options={feeTypes}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="processingFeeValue">Processing Fee Value</Label>
                        <RHFTextField name="processingFeeValue" id="processingFeeValue" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="latePaymentFeeType">Late Payment Fee Type</Label>
                        <RHFAutocomplete name="latePaymentFeeType" id="latePaymentFeeType" options={feeTypes}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="latePaymentFeeValue">Late Payment Fee Value</Label>
                        <RHFTextField name="latePaymentFeeValue" id="latePaymentFeeValue" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="prepaymentFeeType">Prepayment Fee Type</Label>
                        <RHFAutocomplete
                            name="prepaymentFeeType"
                            id="prepaymentFeeType"
                            options={feeTypes}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="prepaymentFeeValue">Prepayment Fee Value</Label>
                        <RHFTextField name="prepaymentFeeValue" id="prepaymentFeeValue" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="emiFrequency">EMI Frequency</Label>
                        <RHFAutocomplete
                            name="emiFrequency"
                            id="emiFrequency"
                            options={emiFrequencies}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="penalInterestRate">Penal Interest Rate (% p.a.)</Label>
                        <RHFTextField name="penalInterestRate" id="penalInterestRate" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="penalInterestConditions">Penal Interest Conditions</Label>
                        <RHFTextField name="penalInterestConditions" id="penalInterestConditions" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="minimumAge">Minimum Age</Label>
                        <RHFTextField name="minimumAge" id="minimumAge" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="maximumAge">Maximum Age</Label>
                        <RHFTextField name="maximumAge" id="maximumAge" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl component="fieldset">
                            <Label htmlFor="penalInterestRateApplicable">Penal Interest Rate Applicable?</Label>
                            <Controller
                                name="penalInterestRateApplicable"
                                control={methods.control}
                                render={({ field }) => (
                                    <RadioGroup
                                        row
                                        {...field}
                                        id="penalInterestRateApplicable"
                                        sx={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                        <FormControlLabel
                                            value="yes"
                                            control={<Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />}
                                            label="Yes"
                                        />
                                        <FormControlLabel
                                            value="no"
                                            control={<Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />}
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
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / 4</Box>
                <Button sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} variant="outlined" onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))} disabled={tabIndex === 0}>Back</Button>
                <Button variant="contained" sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} type="submit">Next</Button>
            </Box>
        </FormProvider>

    )
}

export default VariantParameters
