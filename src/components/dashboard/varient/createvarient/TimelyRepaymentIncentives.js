import React from 'react';
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
import { useDispatch } from 'react-redux';
import { submitVariantRepayment } from '../../../../redux/varient/submitslice/variantProductRepaymentSubmit';


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

// Default form values
const defaultValues = {
    penalInterestApplicable: 'no',
    incentiveType: null,
    incentiveValue: '',
    eligibilityCriteria: null,
    payoutMode: null,
    payoutTimeline: '',
    incentiveReversalConditions: '',
};

const TimelyRepaymentIncentives = ({ tabIndex, setTabIndex }) => {
    const dispatch = useDispatch();

    const methods = useForm({
        resolver: yupResolver(TimelyRepaymentSchema),
        defaultValues,
    });

    const { control, handleSubmit } = methods;

    const penalInterestApplicable = useWatch({
        control,
        name: 'penalInterestApplicable',
        defaultValue: 'no',
    });

    const onSubmit = (data) => {
        dispatch(submitVariantRepayment(data, () => {
        }));
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
                {penalInterestApplicable === 'yes' && (
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
