import React, { useEffect } from 'react';
import {
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Box,
    Button,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import RHFTextField from '../../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import Label from '../../../subcompotents/Label';
import FormProvider from '../../../subcompotents/FormProvider';
import { useDispatch, useSelector } from 'react-redux';
import { submitVariantRepayment } from '../../../../redux/varient/submitslice/variantProductRepaymentSubmit';
import { useLocation } from 'react-router';
import { submitEditVariantSubmit } from '../../../../redux/varient/editvarient/EditVarientSlice';

const TimelyRepaymentIncentives = ({ tabIndex, setTabIndex }) => {
    const location = useLocation()
    const mode = location?.state?.mode
    const dispatch = useDispatch();

    const variantDetail = useSelector((state) => state.variantSingle.variantDetail);
    const editTimelyRepaymentData = useSelector((state) => state.variantProductRepaymentSubmit.editTimelyRepaymentData);
    const editVarientBasicData = useSelector((state) => state.variantProductSubmit.editVarientBasicData);
    const editVarientOtherChargesData = useSelector((state) => state.variantProductOtherChargesSubmit.editVarientOtherChargesData);
    const editVarientParameterData = useSelector((state) => state.variantProductParameterSubmit.editVarientParameterData);

    console.log(editVarientOtherChargesData);
    

    // Dummy dropdown options
    const dummyOptions = [
        { id: '1', name: 'Option 1' },
        { id: '2', name: 'Option 2' },
        { id: '3', name: 'Option 3' },
    ];

    const TimelyRepaymentSchema = Yup.object().shape({
        penalInterestApplicable: Yup.string().required('Please select an option'),

        incentiveType: Yup.mixed().nullable().when('penalInterestApplicable', {
            is: 'yes',
            then: schema => schema.required('Incentive Type is required'),
        }),

        incentiveValue: Yup.string().when('penalInterestApplicable', {
            is: 'yes',
            then: schema => schema.required('Incentive Value is required'),
        }),

        payoutMode: Yup.mixed().nullable().when('penalInterestApplicable', {
            is: 'yes',
            then: schema => schema.required('Payout Mode is required'),
        }),

        payoutTimeline: Yup.string().when('penalInterestApplicable', {
            is: 'yes',
            then: schema => schema.required('Payout Timeline is required'),
        }),

        incentiveReversalConditions: Yup.string().when('penalInterestApplicable', {
            is: 'yes',
            then: schema => schema.required('Reversal Conditions are required'),
        }),
    });

    const defaultValues = (mode === 'EDIT' && variantDetail?.VariantProductRepayment) ? {
        penalInterestApplicable: editTimelyRepaymentData?.penalInterestApplicable ??
            (variantDetail.VariantProductRepayment.penalInterestApplicable ? 'yes' : 'no'),

        incentiveType: editTimelyRepaymentData?.incentiveType ??
            variantDetail.VariantProductRepayment.incentiveType ?? null,

        incentiveValue: editTimelyRepaymentData?.incentiveValue ??
            variantDetail.VariantProductRepayment.incentiveValue?.toString() ?? '',

        payoutMode: editTimelyRepaymentData?.payoutMode ??
            variantDetail.VariantProductRepayment.payoutMode ?? null,

        payoutTimeline: editTimelyRepaymentData?.payoutTimeline ??
            variantDetail.VariantProductRepayment.payoutTimeline ?? '',

        incentiveReversalConditions: editTimelyRepaymentData?.incentiveReversalConditions ??
            variantDetail.VariantProductRepayment.incentiveReversalConditions ?? '',
    } : {
        penalInterestApplicable: 'no',
        incentiveType: null,
        incentiveValue: '',
        payoutMode: null,
        payoutTimeline: '',
        incentiveReversalConditions: '',
    };

    const methods = useForm({
        resolver: yupResolver(TimelyRepaymentSchema),
        defaultValues,
    });

    const { control, handleSubmit, reset, watch } = methods;

    const values = watch()


    // useEffect(() => {
    //     if (variantDetail || editTimelyRepaymentData) {
    //         reset(defaultValues)
    //     }
    // }, [variantDetail, editTimelyRepaymentData])

    const onSubmit = (data) => {
        if (mode === "EDIT") {
            const payload = {
                variantProductId: localStorage.getItem('createdVariantId'),

                productType: editVarientBasicData?.productType || '',
                variantName: editVarientBasicData?.variantName || '',
                variantType: editVarientBasicData?.variantType || '',
                partnerId: editVarientBasicData?.partnerId?.id || '',
                remark: editVarientBasicData?.remark || '',
                rejectionReason: editVarientBasicData?.rejectionReason || '',

                parameterUpdate: {
                    minLoanAmount: Number(editVarientParameterData?.minLoanAmount),
                    maxLoanAmount: Number(editVarientParameterData?.maxLoanAmount),
                    minTenureMonths: Number(editVarientParameterData?.minTenureMonths),
                    maxTenureMonths: Number(editVarientParameterData?.maxTenureMonths),
                    interestRateType: editVarientParameterData?.interestRateType?.id || '',
                    interestRateMin: Number(editVarientParameterData?.interestMin),
                    interestRateMax: Number(editVarientParameterData?.interestMax),
                    processingFeeType: editVarientParameterData?.processingFeeType?.id || '',
                    processingFeeValue: Number(editVarientParameterData?.processingFeeValue),
                    latePaymentFeeType: editVarientParameterData?.latePaymentFeeType?.id || '',
                    latePaymentFeeValue: Number(editVarientParameterData?.latePaymentFeeValue),
                    penalInterestApplicable: data?.penalInterestApplicable === 'yes',
                    emiFrequency: editVarientParameterData?.emiFrequency?.id || '',
                    prepaymentFeeType: editVarientParameterData?.prepaymentFeeType?.id || '',
                    prepaymentFeeValue: Number(editVarientParameterData?.prepaymentFeeValue),
                    penalInterestRate: Number(editVarientParameterData?.penalInterestRate),
                    minAge: Number(editVarientParameterData?.minAge),
                    maxAge: Number(editVarientParameterData?.maxAge),
                },

                otherChargesUpdate: {
                    chequeBounceCharge: Number(editVarientOtherChargesData?.chequeBounceCharges),
                    dublicateNocCharge: Number(editVarientOtherChargesData?.duplicateNocCharges),
                    furnishingCharge: Number(editVarientOtherChargesData?.furnishingCharges),
                    chequeSwapCharge: Number(editVarientOtherChargesData?.chequeSwappingCharges),
                    revocation: Number(editVarientOtherChargesData?.revocation),
                    documentCopyCharge: Number(editVarientOtherChargesData?.documentCopyCharges),
                    stampDutyCharge: Number(editVarientOtherChargesData?.stampDutyCharges),
                    nocCharge: Number(editVarientOtherChargesData?.nocCharge),
                    incidentalCharge: Number(editVarientOtherChargesData?.incidentalCharges),
                },

                repaymentUpdate: {
                    penalInterestApplicable: data?.penalInterestApplicable === 'yes',
                    incentiveType: data?.incentiveType?.name || '',
                    incentiveValue: Number(data?.incentiveValue),
                    payoutMode: data?.payoutMode?.name || '',
                    incentiveReversalConditions: data?.incentiveReversalConditions || '',
                }
            };

            dispatch(submitEditVariantSubmit(payload)); 
            console.log("Final Payload", payload); 
          
        } else {
            dispatch(submitVariantRepayment(data, () => {
            }));
        }
    };


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                {/* Radio Group: Penal Interest Applicable */}
                <Grid item xs={12} md={4}>
                    <FormControl component="fieldset">
                        <Label>Penal Interest Rate Applicable?</Label>
                        <Controller
                            name="penalInterestApplicable"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup row {...field}>
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

                {/* Conditionally rendered fields */}
                {values["penalInterestApplicable"] === 'yes' && (
                    <>
                        <Grid item xs={12} md={4}>
                            <Label htmlFor="incentiveType">Incentive Type</Label>
                            <RHFAutocomplete
                                name="incentiveType"
                                options={dummyOptions}
                                getOptionLabel={(option) => option.name}
                                id="incentiveType"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="incentiveValue">Incentive Value</Label>
                            <RHFTextField name="incentiveValue" id="incentiveValue" />
                        </Grid>

                        {/* <Grid item xs={12} md={4}>
                            <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                            <RHFAutocomplete
                                name="eligibilityCriteria"
                                options={dummyOptions}
                                getOptionLabel={(option) => option.name}
                                id="eligibilityCriteria"
                            />
                        </Grid> */}

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="payoutMode">Payout Mode</Label>
                            <RHFAutocomplete
                                name="payoutMode"
                                options={dummyOptions}
                                getOptionLabel={(option) => option.name}
                                id="payoutMode"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="payoutTimeline">Payout Timeline</Label>
                            <RHFTextField name="payoutTimeline" id="payoutTimeline" />
                        </Grid>

                        <Grid item xs={12}>
                            <Label htmlFor="incentiveReversalConditions">Incentive Reversal Conditions</Label>
                            <RHFTextField
                                name="incentiveReversalConditions"
                                id="incentiveReversalConditions"
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / 4</Box>
                <Button sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} variant="outlined" onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))} disabled={tabIndex === 0}>Back</Button>
                <Button variant="contained" sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} type="submit">Submit</Button>
            </Box>
        </FormProvider>
    );
};

export default TimelyRepaymentIncentives;
