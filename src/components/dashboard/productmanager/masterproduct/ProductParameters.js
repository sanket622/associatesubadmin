import React, { useEffect } from 'react';
import { Controller, useForm, } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, FormControl, RadioGroup, Radio, FormControlLabel, Box, Button } from '@mui/material';
import * as yup from 'yup';
import Label from '../../../subcompotents/Label';
import { fetchRepaymentModes, fetchDisbursementModes, submitFinancialTerms, setEditProductparameter } from '../../../../redux/masterproduct/productparameter/financialTermsSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../../subcompotents/FormProvider';
import RHFTextField from '../../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import { useLocation } from 'react-router';

export const interestRateOptions = [
    { id: 'FLAT', name: 'Flat' },
    { id: 'REDUCING', name: 'Reducing Balance' },
    { id: ' ZERO', name: 'Zero' },
    { id: ' CUSTOM', name: 'Custom' },
    // { id: 'HYBRID', name: 'Hybrid' },
];

export const processingFeeTypeOptions = [
    { id: 'FLAT', name: 'Flat' },
    { id: 'PERCENTAGE', name: 'Percentage' },
    { id: 'NONE', name: 'None' }
];

export const latePaymentFeeTypeOptions = [
    { id: 'FLAT', name: 'Flat' },
    { id: 'PERCENTAGE', name: 'Percentage' },
    { id: 'NONE', name: 'None' }
];

export const prepaymentFeeTypeOptions = [
    { id: 'FLAT', name: 'Flat' },
    { id: 'PERCENTAGE', name: 'Percentage' },
    { id: 'NONE', name: 'None' }
];

// export const disbursementModeOptions = [
//     { id: 'NEFT', name: 'Neft' },
//     { id: 'IMPS', name: 'Imps' },
//     { id: 'UPI', name: 'Upi' },
// ];

// export const repaymentModeOptions = [
//     { id: 'LIEN', name: 'Lien' },
//     { id: 'ENACH', name: 'Enach' },
//     { id: 'SELFPAY', name: 'Selfpay' },
//     { id: 'EMI', name: 'Emi' },
//     { id: 'BNPL', name: 'Bnpl' },
// ];

export const emiFrequencyOptions = [
    { id: 'Daily', name: 'Daily' },
    { id: 'Weekly', name: 'Weekly' },
    { id: 'Biweekly', name: 'Biweekly' },
    { id: 'Monthly', name: 'Monthly' },
    { id: 'Custom', name: 'Custom' },
];

// export const tenureUnitOptions = [
//     { id: 'Days', name: 'Days' },
//     { id: 'Weeks', name: 'Weeks' },
//     { id: 'Months', name: 'Months' },
//     { id: 'PayoutLinked', name: 'Payoutlinked' },
// ];

const ProductParameters = ({ handleTabChange, tabIndex, setTabIndex, handleNext }) => {
    const dispatch = useDispatch();
    const location = useLocation()
    const mode = location?.state?.mode
    const repaymentModes = useSelector(state => state.financialTerms?.repaymentModes || []);
    const disbursementModes = useSelector(state => state.financialTerms?.disbursementModes || []);
    const editProductparameter = useSelector((state) => state.financialTerms?.editProductparameter);
    const productDetails = useSelector((state) => state.products.productDetails);
    const findOption = (options, id) => options.find(option => option.id === id) || null;

    const productParameterValidationSchema = yup.object({
        minTenureMonths: yup.number().positive().required('Minimum Tenure is required'),
        maxTenureMonths: yup.number().positive().required('Maximum Tenure is required'),
        minLoanAmount: yup.number().positive().required('Minimum Loan Amount is required'),
        maxLoanAmount: yup.number().positive().required('Maximum Loan Amount is required'),
        interestRateType: yup.object().required('Interest Rate Type is required'),
        interestMin: yup.number().min(0, 'Min interest rate must be at least 0').required('Interest Min is required'),
        interestMax: yup.number().min(yup.ref('interestMin'), 'Max interest rate must be greater than Min').required('Interest Max is required'),
        processingFeeType: yup.object().required('Processing Fee Type is required'),
        processingFeeValue: yup.number().min(0, 'Processing Fee Value must be at least 0').required('Processing Fee Value is required'),
        latePaymentFeeType: yup.object().required('Late Payment Fee Type is required'),
        latePaymentFeeValue: yup.number().min(0, 'Late Payment Fee Value must be at least 0').required('Late Payment Fee Value is required'),
        prepaymentFeeType: yup.object().required('Prepayment Fee Type is required'),
        prepaymentFeeValue: yup.number().min(0, 'Prepayment Fee Value must be at least 0').required('Prepayment Fee Value is required'),
        prepaymentRulesAllowed: yup.string().oneOf(['yes', 'no'], 'Please select Yes or No').required('Prepayment Allowed is required'),
        emiFrequency: yup.object().required('EMI Frequency is required'),
        disbursementMode: yup.object().required('Disbursement Mode is required'),
        repaymentMode: yup.object().required('Repayment Mode is required')
    });

    const defaultValues = (productDetails && mode === "EDIT") ? {
        minLoanAmount: editProductparameter?.minLoanAmount || productDetails?.financialTerms?.minLoanAmount,
        maxLoanAmount: editProductparameter?.maxLoanAmount || productDetails?.financialTerms?.maxLoanAmount,
        minTenureMonths: editProductparameter?.minTenureMonths || productDetails?.financialTerms?.minTenureMonths,
        maxTenureMonths: editProductparameter?.maxTenureMonths || productDetails?.financialTerms?.maxTenureMonths,

        interestRateType: findOption(
            interestRateOptions,
            editProductparameter?.interestRateType?.id || productDetails?.financialTerms?.interestRateType
        ),
        interestMin: editProductparameter?.interestRateMin || productDetails?.financialTerms?.interestRateMin,
        interestMax: editProductparameter?.interestRateMax || productDetails?.financialTerms?.interestRateMax,

        processingFeeType: findOption(
            processingFeeTypeOptions,
            editProductparameter?.processingFeeType?.id || productDetails?.financialTerms?.processingFeeType
        ),
        processingFeeValue: editProductparameter?.financialTerms?.processingFeeValue || productDetails?.financialTerms?.processingFeeValue,

        latePaymentFeeType: findOption(
            latePaymentFeeTypeOptions,
            editProductparameter?.latePaymentFeeType?.id || productDetails?.financialTerms?.latePaymentFeeType
        ),
        latePaymentFeeValue: editProductparameter?.latePaymentFeeValue || productDetails?.financialTerms?.latePaymentFeeValue,

        prepaymentFeeType: findOption(
            prepaymentFeeTypeOptions,
            editProductparameter?.prepaymentFeeType?.id || productDetails?.financialTerms?.prepaymentFeeType
        ),
        prepaymentFeeValue: editProductparameter?.prepaymentFeeValue || productDetails?.financialTerms?.prepaymentFeeValue,

        prepaymentRulesAllowed: (editProductparameter?.prepaymentAllowed ?? productDetails?.financialTerms?.prepaymentAllowed) ? 'yes' : 'no',

        emiFrequency: findOption(
            emiFrequencyOptions,
            editProductparameter?.emiFrequency?.id || productDetails?.financialTerms?.emiFrequency
        ),

        disbursementMode: null,
        repaymentMode: null
    } : {};

    console.log(editProductparameter)

    const methods = useForm({
        resolver: yupResolver(productParameterValidationSchema),
        defaultValues,
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = methods;

    useEffect(() => {
        dispatch(fetchRepaymentModes());
        dispatch(fetchDisbursementModes());
    }, [dispatch]);

    useEffect(() => {
        reset(defaultValues)
    }, [repaymentModes, disbursementModes, editProductparameter, mode]);


    const onSubmit = (data) => {
        if (mode === "EDIT") {
            dispatch(setEditProductparameter(data))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(submitFinancialTerms(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }
    const onError = (e) => console.log(e);

    return (

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box>
                <Grid container spacing={2}>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="minTenureMonths">Minimum Tenure (Months)</Label>
                        <RHFTextField name="minTenureMonths" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="maxTenureMonths">Maximum Tenure (Months)</Label>
                        <RHFTextField name="maxTenureMonths" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="minLoanAmount">Minimum Loan Amount</Label>
                        <RHFTextField name="minLoanAmount" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="maxLoanAmount">Maximum Loan Amount</Label>
                        <RHFTextField name="maxLoanAmount" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="interestRateType">Interest Rate Type</Label>
                        <RHFAutocomplete name="interestRateType" options={interestRateOptions} getOptionLabel={(option) => option.name} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="interestMin">Interest Rate Range (Min)</Label>
                        <RHFTextField name="interestMin" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="interestMax">Interest Rate Range (Max)</Label>
                        <RHFTextField name="interestMax" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="processingFeeType">Processing Fee Type</Label>
                        <RHFAutocomplete name="processingFeeType" options={processingFeeTypeOptions} getOptionLabel={(option) => option.name} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="processingFeeValue">Processing Fee Value</Label>
                        <RHFTextField name="processingFeeValue" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="latePaymentFeeType">Late Payment Fee Type</Label>
                        <RHFAutocomplete name="latePaymentFeeType" options={latePaymentFeeTypeOptions} getOptionLabel={(option) => option.name} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="latePaymentFeeValue">Late Payment Fee Value</Label>
                        <RHFTextField name="latePaymentFeeValue" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="prepaymentFeeType">Prepayment Fee Type</Label>
                        <RHFAutocomplete name="prepaymentFeeType" options={prepaymentFeeTypeOptions} getOptionLabel={(option) => option.name} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="prepaymentFeeValue">Prepayment Fee Value</Label>
                        <RHFTextField name="prepaymentFeeValue" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label>Prepayment Allowed</Label>
                        <FormControl error={!!errors.prepaymentRulesAllowed}>
                            <Controller
                                name="prepaymentRulesAllowed"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup {...field} row>
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="emiFrequency">EMI Frequency</Label>
                        <RHFAutocomplete name="emiFrequency" options={emiFrequencyOptions} getOptionLabel={(option) => option.name} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="disbursementMode">Disbursement Mode</Label>
                        <RHFAutocomplete name="disbursementMode" options={disbursementModes} getOptionLabel={(option) => option.name} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="repaymentMode">Repayment Mode</Label>
                        <RHFAutocomplete name="repaymentMode" options={repaymentModes} getOptionLabel={(option) => option.name} />
                    </Grid>

                </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box
                    sx={{
                        border: '2px solid #6B6B6B',
                        borderRadius: '12px',
                        px: 2,
                        py: 1,
                        minWidth: 60,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#6B6B6B',
                    }}
                >
                    {tabIndex + 1} / 10
                </Box>


                <Button
                    sx={{
                        background: "#0000FF",
                        color: "white",
                        px: 6,
                        py: 1,
                        borderRadius: 2,
                        fontSize: "16px",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": { background: "#0000FF" },
                    }}
                    variant="outlined"
                    onClick={() => setTabIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={tabIndex === 0}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        background: "#0000FF",
                        color: "white",
                        px: 6,
                        py: 1,
                        borderRadius: 2,
                        fontSize: "16px",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": { background: "#0000FF" },
                    }}
                    type='submit'
                >
                    Next
                </Button>


            </Box>
        </FormProvider>
    );
};

export default ProductParameters;
