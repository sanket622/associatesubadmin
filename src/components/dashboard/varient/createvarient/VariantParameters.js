import React, { useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setEditVarientParameterData, submitVariantProductParameter } from '../../../../redux/varient/submitslice/variantProductParameterSubmitSlice';
import { updateVariantProductDraft } from '../../../../redux/varient/variantdraftupdateslice/variantdraftupdateslice';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { primaryBtnSx } from '../../../subcompotents/UtilityService';



const VariantParameters = ({ setTabIndex, tabIndex, totalTabs }) => {
    const location = useLocation()
    const { enqueueSnackbar } = useSnackbar();
    const mode = location?.state?.mode
    const productIdFromState = location?.state?.productId
    const dispatch = useDispatch();
    const { productDetails } = useSelector((state) => state.products);
    const variantDetail = useSelector((state) => state?.variantSingle?.variantDetail);
    const editVarientParameterData = useSelector((state) => state?.variantProductParameterSubmit?.editVarientParameterData);

    // console.log(variantDetail.VariantProductParameter.processingFeeValue, editVarientParameterData?.processingFeeValue);

    const interestRateTypes = [
        { id: 'FLAT', name: 'Flat' },
        { id: 'REDUCING', name: 'Reducing' },
        { id: 'ZERO', name: 'Zero' },
        { id: 'CUSTOM', name: 'Custom' },
        {id:'BULLET',name:'Bullet'}
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

    const VariantSchema = Yup.object().shape({
        minimumLoanAmount: Yup.number()
            .typeError('Minimum Loan Amount must be a number')
            .required('Minimum Loan Amount is required')
            .positive(),

        maximumLoanAmount: Yup.number()
            .typeError('Maximum Loan Amount must be a number')
            .required('Maximum Loan Amount is required')
            .positive()
            .when('minimumLoanAmount', (min, schema) =>
                min
                    ? schema.min(
                        min,
                        'Maximum Loan Amount cannot be less than Minimum Loan Amount'
                    )
                    : schema
            ),
        interestRateMin: Yup.string().required('Interest Rate Range (Min) is required'),
        interestRateMax: Yup.string().required('Interest Rate Range (Max) is required'),
        processingFeeValue: Yup.mixed().required('Processing Fee Value is required'),
        latePaymentFeeType: Yup.object().required('Late Payment Fee Type is required'),
        latePaymentFeeValue: Yup.string().required('Late Payment Fee Value is required'),
        prepaymentFeeValue: Yup.string().required('Prepayment Fee Value is required'),
        penalInterestRate: Yup.string().required('Penal Interest Rate is required'),
        // penalInterestConditions: Yup.string().required('Penal Interest Conditions is required'),
        // coBorrowerRequiredForLowScore: Yup.string().required('Penal Interest Rate Applicable is required'),
        interestRateType: Yup.mixed().required('Interest Rate Type is required'),
        processingFeeType: Yup.mixed().required('Processing Fee Type is required'),
        prepaymentFeeType: Yup.mixed().required('Prepayment Fee Type is required'),
        emiFrequency: Yup.mixed().required('EMI Frequency is required'),
    });

    const findOption = (options, value, key = 'id') =>
        options?.find(option => option?.[key] === value) || null;

    const defaultValues = (mode === 'EDIT' && variantDetail?.VariantProductParameter) ? {
        minimumLoanAmount: editVarientParameterData?.minimumLoanAmount || variantDetail?.VariantProductParameter?.minLoanAmount || '',
        maximumLoanAmount: editVarientParameterData?.maximumLoanAmount || variantDetail?.VariantProductParameter?.maxLoanAmount || '',
        minTenure: editVarientParameterData?.minTenure || variantDetail?.VariantProductParameter?.minTenure || '',
        maxTenure: editVarientParameterData?.maxTenure || variantDetail?.VariantProductParameter?.maxTenure || '',

        interestRateType:
            editVarientParameterData?.interestRateType ||
            findOption(interestRateTypes, variantDetail?.VariantProductParameter?.interestRateType, 'id') ||
            null,

        interestRateMin: editVarientParameterData?.interestRateMin || variantDetail?.VariantProductParameter?.interestRateMin || '',
        interestRateMax: editVarientParameterData?.interestRateMax || variantDetail?.VariantProductParameter?.interestRateMax || '',

        processingFeeType:
            editVarientParameterData?.processingFeeType ||
            findOption(feeTypes, variantDetail?.VariantProductParameter?.processingFeeType, 'id') ||
            null,

        processingFeeValue: editVarientParameterData?.processingFeeValue || variantDetail?.VariantProductParameter?.processingFeeValue || "0",

        latePaymentFeeType:
            editVarientParameterData?.latePaymentFeeType ||
            findOption(feeTypes, variantDetail?.VariantProductParameter?.latePaymentFeeType, 'id') ||
            null,

        latePaymentFeeValue: editVarientParameterData?.latePaymentFeeValue || variantDetail?.VariantProductParameter?.latePaymentFeeValue || '0',

        prepaymentFeeType:
            editVarientParameterData?.prepaymentFeeType ||
            findOption(feeTypes, variantDetail?.VariantProductParameter?.prepaymentFeeType, 'id') ||
            null,

        prepaymentFeeValue: editVarientParameterData?.prepaymentFeeValue || variantDetail?.VariantProductParameter?.prepaymentFeeValue || '0',

        emiFrequency:
            editVarientParameterData?.emiFrequency ||
            findOption(emiFrequencies, variantDetail?.VariantProductParameter?.emiFrequency, 'id') ||
            null,

        penalInterestRate: editVarientParameterData?.penalInterestRate || variantDetail?.VariantProductParameter?.penalInterestRate || '',
        // penalInterestConditions: editVarientParameterData?.penalInterestConditions || variantDetail?.VariantProductParameter?.penalInterestConditions || '',

        minimumAge: editVarientParameterData?.minimumAge || variantDetail?.VariantProductParameter?.minAge || '',
        maximumAge: editVarientParameterData?.maximumAge || variantDetail?.VariantProductParameter?.maxAge || '',

        penalInterestRateApplicable:
            editVarientParameterData?.penalInterestRateApplicable ??
            (variantDetail?.VariantProductParameter?.penalInterestApplicable ? 'yes' : 'no'),
    } : {
        minimumLoanAmount: productDetails?.financialTerms?.minLoanAmount,
        maximumLoanAmount: productDetails?.financialTerms?.maxLoanAmount,
        minTenure: productDetails?.financialTerms?.minTenure,
        maxTenure: productDetails?.financialTerms?.maxTenure,
        interestRateType: interestRateTypes.find(i => i.id === productDetails?.financialTerms?.interestRateType) || null,
        interestRateMin: productDetails?.financialTerms?.interestRateMin,
        interestRateMax: '',
        processingFeeType: feeTypes.find(i => i.id === productDetails?.financialTerms?.processingFeeType) || null,
        processingFeeValue: productDetails?.financialTerms?.processingFeeValue,
        latePaymentFeeType: feeTypes.find(i => i.id === productDetails?.financialTerms?.latePaymentFeeType) || null,
        latePaymentFeeValue: productDetails?.financialTerms?.latePaymentFeeValue,
        prepaymentFeeType: feeTypes.find(i => i.id === productDetails?.financialTerms?.prepaymentFeeType) || null,
        prepaymentFeeValue: productDetails?.financialTerms?.prepaymentFeeValue,
        emiFrequency: emiFrequencies.find(i => i.id === productDetails?.financialTerms?.emiFrequency) || null,
        penalInterestRate: productDetails?.financialTerms?.penalRate,
        // penalInterestConditions: '',
        minimumAge: productDetails?.eligibilityCriteria?.minAge,
        maximumAge: productDetails?.eligibilityCriteria?.maxAge,
        penalInterestRateApplicable: productDetails?.financialTerms?.penalApplicable ? 'yes' : 'no',
    };


    const methods = useForm({
        resolver: yupResolver(VariantSchema),
        defaultValues,
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = methods;

    console.log(watch());


    useEffect(() => {
        if (mode === 'EDIT' && variantDetail?.VariantProductParameter || productIdFromState) {
            reset(defaultValues);
        }
    }, [variantDetail, editVarientParameterData, productIdFromState]);




    const onSubmit = (data) => {

        if (mode === "EDIT" && variantDetail.status === "Draft") {
            dispatch(
                updateVariantProductDraft({
                    endpoint: 'updateVariantProductParameterDraft',
                    payload: {
                        ...data,
                        variantProductId: localStorage.getItem('createdVariantId')
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
            dispatch(setEditVarientParameterData(data))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(submitVariantProductParameter(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }

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
                        <Label htmlFor="maxTenure">Maximum Tenure Months</Label>
                        <RHFTextField name="maxTenure" id="maxTenure" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="minTenure">Minimum Tenure Months</Label>
                        <RHFTextField name="minTenure" id="minTenure" />
                    </Grid>


                    <Grid item xs={12} md={4}>
                        <Label htmlFor="interestRateType">Interest Rate Type</Label>
                        <RHFAutocomplete
                            name="interestRateType"
                            id="interestRateType"
                            options={interestRateTypes}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            disabled
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
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="processingFeeValue">
                            Processing Fee Value{watch('processingFeeType')?.id === 'PERCENTAGE' ? ' (%)' : ''}
                        </Label>
                        <RHFTextField name="processingFeeValue" id="processingFeeValue" disabled={watch('processingFeeType')?.id === 'NONE'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="latePaymentFeeType">Late Payment Fee Type</Label>
                        <RHFAutocomplete name="latePaymentFeeType" id="latePaymentFeeType" options={feeTypes}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id} disabled />

                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="latePaymentFeeValue">
                            Late Payment Fee Value{watch('latePaymentFeeType')?.id === 'PERCENTAGE' ? ' (%)' : ''}
                        </Label>
                        <RHFTextField name="latePaymentFeeValue" disabled={watch('latePaymentFeeType')?.id === 'NONE'}/>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="prepaymentFeeType">Prepayment Fee Type</Label>
                        <RHFAutocomplete
                            name="prepaymentFeeType"
                            id="prepaymentFeeType"
                            options={feeTypes}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="prepaymentFeeValue">
                            Prepayment Fee Value{watch('prepaymentFeeType')?.id === 'PERCENTAGE' ? ' (%)' : ''}
                        </Label>
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
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="penalInterestRate">Penal Interest Rate (% p.a.)</Label>
                        <RHFTextField name="penalInterestRate" id="penalInterestRate" />
                    </Grid>

                    {/* <Grid item xs={12} md={4}>
                        <Label htmlFor="penalInterestConditions">Penal Interest Conditions</Label>
                        <RHFTextField name="penalInterestConditions" id="penalInterestConditions" />
                    </Grid> */}
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
                                            disabled
                                        />
                                        <FormControlLabel
                                            value="no"
                                            control={<Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />}
                                            label="No"
                                            disabled
                                        />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / {totalTabs}</Box>

                {
                    (mode === "EDIT") && (

                        <Button sx={primaryBtnSx} variant="outlined" onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))} disabled={tabIndex === 0}>Back</Button>
                    )
                }
                <Button variant="contained" sx={primaryBtnSx} type="submit">Next</Button>
            </Box>
        </FormProvider>

    )
}

export default VariantParameters
