import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
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
import { useLocation } from 'react-router-dom';
import { setProductParameters } from '../../../../redux/masterproduct/editmasterproduct/masterProductUpdateSlice';
import { primaryBtnSx } from '../../../subcompotents/UtilityService';
import {
    updateMasterProductDraft
} from '../../../../redux/masterproduct/masterproductdraftslice/masterproductdraft';

export const interestRateOptions = [
    { id: 'FLAT', name: 'Flat' },
    { id: 'REDUCING', name: 'Reducing' },
    {id:'BULLET',name:'Bullet'},
    // { id: ' ZERO', name: 'Zero' },
    // { id: ' CUSTOM', name: 'Custom' },
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
    // { id: 'Biweekly', name: 'Biweekly' },
    { id: 'Monthly', name: 'Monthly' },
    // { id: 'Custom', name: 'Custom' },
];

// export const tenureUnitOptions = [
//     { id: 'Days', name: 'Days' },
//     { id: 'Weeks', name: 'Weeks' },
//     { id: 'Months', name: 'Months' },
//     { id: 'PayoutLinked', name: 'Payoutlinked' },
// ];

const ProductParameters = ({ handleTabChange, tabIndex, setTabIndex, totalTabs, handleNext, status }) => {
    const dispatch = useDispatch();
    const location = useLocation()
    const { enqueueSnackbar } = useSnackbar();
    const mode = location?.state?.mode
    const repaymentModes = useSelector(state => state.financialTerms?.repaymentModes || []);
    const disbursementModes = useSelector(state => state.financialTerms?.disbursementModes || []);
    const editProductparameter = useSelector((state) => state.financialTerms?.editProductparameter);
    const { loading } = useSelector(
        state => state.updateMasterProductDraft
    );
    const productDetails = useSelector((state) => state.products.productDetails);
    const findOption = (options, id) => options.find(option => option.id === id) || null;
    const num = () =>
        yup
            .number()
            .transform((value, originalValue) =>
                originalValue === '' ? undefined : Number(originalValue)
            );
    const productParameterValidationSchema = yup.object({
        minLoanAmount: num().positive().required('Minimum Loan Amount is required'),
        maxLoanAmount: num().positive().required('Maximum Loan Amount is required'),

        minTenure: num().positive().required('Minimum Tenure is required'),
        maxTenure: num().positive().required('Maximum Tenure is required'),

        interestRateType: yup.object().required('Interest Rate Type is required'),

        interestMin: num().min(0).required('Interest Min is required'),
        interestMax: num()
            .moreThan(yup.ref('interestMin'), 'Max interest must be greater than Min')
            .required('Interest Max is required'),

        processingFeeType: yup.object().required('Processing Fee Type is required'),
        processingFeeValue: num().min(0).required('Processing Fee Value is required'),

        latePaymentFeeType: yup.object().required('Late Payment Fee Type is required'),
        latePaymentFeeValue: num().min(0).required('Late Payment Fee Value is required'),

        prepaymentFeeType: yup.object().required('Prepayment Fee Type is required'),
        prepaymentFeeValue: num().min(0).required('Prepayment Fee Value is required'),

        // prepaymentRulesAllowed: yup
        //     .string()
        //     .oneOf(['yes', 'no'])
        //     .required('Prepayment Allowed is required'),

        emiFrequency: yup.object().required('EMI Frequency is required'),

        // overallGst: num().min(0).required('GST is required'),

        // penalApplicable: yup.string().oneOf(['yes', 'no']).required(),

        // penalRate: num().when('penalApplicable', {
        //     is: 'yes',
        //     then: schema => schema.min(0).required('Penal Rate is required'),
        //     otherwise: schema => schema.notRequired(),
        // }),

        gracePeriod: num().min(0).required('Grace Period is required'),

        // renewalFee: num().min(0).required('Renewal Fee is required'),
    });


    const defaultValues = (productDetails && mode === "EDIT") ? {
        minLoanAmount: editProductparameter?.minLoanAmount || productDetails?.financialTerms?.minLoanAmount,
        maxLoanAmount: editProductparameter?.maxLoanAmount || productDetails?.financialTerms?.maxLoanAmount,
        minTenure: editProductparameter?.minTenure || productDetails?.financialTerms?.minTenure,
        maxTenure: editProductparameter?.maxTenure || productDetails?.financialTerms?.maxTenure,

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

        // prepaymentRulesAllowed: (editProductparameter?.prepaymentAllowed ?? productDetails?.financialTerms?.prepaymentAllowed) ? 'yes' : 'no',

        emiFrequency: findOption(
            emiFrequencyOptions,
            editProductparameter?.emiFrequency?.id || productDetails?.financialTerms?.emiFrequency
        ),

        disbursementMode: null,
        repaymentMode: null,

        // overallGst:
        //     editProductparameter?.overallGst ??
        //     productDetails?.financialTerms?.overallGst ??
        //     18,

        // penalApplicable:
        //     (editProductparameter?.penalApplicable ??
        //         productDetails?.financialTerms?.penalApplicable)
        //         ? 'yes'
        //         : 'no',

        // penalRate:
        //     editProductparameter?.penalRate ??
        //     productDetails?.financialTerms?.penalRate ??
        //     0,

        gracePeriod:
            editProductparameter?.gracePeriod ??
            productDetails?.financialTerms?.gracePeriod ??
            0,

        // renewalFee:
        //     editProductparameter?.renewalFee ??
        //     productDetails?.financialTerms?.renewalFee ??
        //     0,

    } : {};

    // console.log(editProductparameter)

    const methods = useForm({
        resolver: yupResolver(productParameterValidationSchema),
        defaultValues,
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors }
    } = methods;

    useEffect(() => {
        dispatch(fetchRepaymentModes());
        dispatch(fetchDisbursementModes());
    }, [dispatch]);




    useEffect(() => {
        if (productDetails || editProductparameter) {
            reset(defaultValues);
        }
    }, [productDetails, editProductparameter]);



    const onSubmit = (data) => {
        if (mode === "EDIT" && status === "Draft") {
            dispatch(
                updateMasterProductDraft({
                    endpoint: 'updateFinancialTermsDraft',
                    payload: {
                        masterProductId: productDetails?.id,
                        financialTerms: data,
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
            dispatch(setProductParameters(data));
            setTabIndex(prev => Math.min(prev + 1, 9));
        }
        else {
            dispatch(
                submitFinancialTerms(data, () => {
                    setTabIndex(prev => Math.min(prev + 1, 9));
                })
            );
        }
    }
    const onError = (e) => console.log(e);

    return (

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="minLoanAmount">Minimum Loan Amount</Label>
                        <RHFTextField name="minLoanAmount" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="maxLoanAmount">Maximum Loan Amount</Label>
                        <RHFTextField name="maxLoanAmount" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="minTenure">Minimum Tenure (Months)</Label>
                        <RHFTextField name="minTenure" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="maxTenure">Maximum Tenure (Months)</Label>
                        <RHFTextField name="maxTenure" />
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
                        Processing Fee Value{watch('processingFeeType')?.id === 'PERCENTAGE' ? ' (%)' : ''}
                        <RHFTextField name="processingFeeValue" disabled={watch('processingFeeType')?.id === 'NONE'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="latePaymentFeeType">Late Payment Fee Type</Label>
                        <RHFAutocomplete name="latePaymentFeeType" options={latePaymentFeeTypeOptions} getOptionLabel={(option) => option.name} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        Late Payment Fee Value{watch('latePaymentFeeType')?.id === 'PERCENTAGE' ? ' (%)' : ''}
                        <RHFTextField name="latePaymentFeeValue" disabled={watch('latePaymentFeeType')?.id === 'NONE'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="prepaymentFeeType">Prepayment Fee Type</Label>
                        <RHFAutocomplete name="prepaymentFeeType" options={prepaymentFeeTypeOptions} getOptionLabel={(option) => option.name} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        Prepayment Fee Value{watch('prepaymentFeeType')?.id === 'PERCENTAGE' ? ' (%)' : ''}
                        <RHFTextField name="prepaymentFeeValue" disabled={watch('prepaymentFeeType')?.id === 'NONE'}/>
                    </Grid>

                    {/* <Grid item xs={12} md={4}>
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
                    </Grid> */}

                    {/* <Grid item xs={12} md={4}>
                        <Label>Overall GST (%)</Label>
                        <RHFTextField name="overallGst" />
                    </Grid> */}

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="emiFrequency">EMI Frequency</Label>
                        <RHFAutocomplete name="emiFrequency" options={emiFrequencyOptions} getOptionLabel={(option) => option.name} />
                    </Grid>

                    {/* <Grid item xs={12} md={4}>
                        <Label>Penal Applicable</Label>
                        <Controller
                            name="penalApplicable"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup {...field} row>
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                            )}
                        />
                    </Grid> */}
                    {/* <Grid item xs={12} md={4}>
                        <Label>Penal Rate (%)</Label>
                        <RHFTextField name="penalRate" />
                    </Grid> */}
                    <Grid item xs={12} md={4}>
                        <Label>Grace Period (Days)</Label>
                        <RHFTextField name="gracePeriod" />
                    </Grid>
                    {/* <Grid item xs={12} md={4}>
                        <Label>Renewal Fee</Label>
                        <RHFTextField name="renewalFee" />
                    </Grid> */}




                    {/* <Grid item xs={12} md={4}>
                        <Label htmlFor="disbursementMode">Disbursement Mode</Label>
                        <RHFAutocomplete name="disbursementMode" options={disbursementModes} getOptionLabel={(option) => option.name} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="repaymentMode">Repayment Mode</Label>
                        <RHFAutocomplete name="repaymentMode" options={repaymentModes} getOptionLabel={(option) => option.name} />
                    </Grid> */}

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
                    type='submit'
                >
                    Next
                </Button>


            </Box>
        </FormProvider>
    );
};

export default ProductParameters;
