import React from 'react';
import { Controller, useForm, useFormContext, useWatch } from 'react-hook-form';
import TextFieldComponent from '../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import {
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Box,
    Button,
} from '@mui/material';
import Label from '../../subcompotents/Label';
import * as Yup from 'yup';
import FormProvider from '../../subcompotents/FormProvider';
import RHFTextField from '../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../subcompotents/RHFAutocomplete';
import { submitTimelyRepayment } from '../../../redux/masterproduct/timelyrepayment/timelyRepaymentSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

const dummyOptions = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
];

const TimelyRepaymentIncentives = ({ tabIndex, setTabIndex, }) => {

    const timelyRepaymentSchema = Yup.object().shape({
        penalInterestApplicable: Yup.string().oneOf(['yes', 'no']).required(),

        incentiveType: Yup.object().nullable().when('penalInterestApplicable', {
            is: 'yes',
            then: (schema) => schema.required('Incentive Type is required'),
            otherwise: (schema) => schema.nullable(),
        }),

        incentiveValue: Yup.number()
            .typeError('Must be a number')
            .when('penalInterestApplicable', {
                is: 'yes',
                then: (schema) => schema.required('Value required'),
            }),

        payoutMode: Yup.object().nullable().when('penalInterestApplicable', {
            is: 'yes',
            then: (schema) => schema.required('Payout Mode required'),
            otherwise: (schema) => schema.nullable(),
        }),

        payoutTimeline: Yup.string().when('penalInterestApplicable', {
            is: 'yes',
            then: (schema) => schema.required('Timeline required'),
        }),

        incentiveReversalConditions: Yup.string().when('penalInterestApplicable', {
            is: 'yes',
            then: (schema) => schema.required('Reversal Conditions required'),
        }),
    });

    const timelyRepaymentDefaultValues = {
        penalInterestApplicable: 'no',
        incentiveType: null,
        incentiveValue: '',
        eligibilityCriteria: null,
        payoutMode: null,
        payoutTimeline: '',
        incentiveReversalConditions: '',
    };


    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.timelyRepayment || {});


    const methods = useForm({
        resolver: yupResolver(timelyRepaymentSchema),
        defaultValues: timelyRepaymentDefaultValues,
    });

    const { control, watch, handleSubmit } = methods;
    const penalInterestApplicable = watch('penalInterestApplicable');

    const onSubmit = data => {
        dispatch(submitTimelyRepayment(data));
    };

    const onError = err => console.log('Validation errors', err);


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
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

                </Grid>
                {penalInterestApplicable === 'yes' && (
                    <>
                        <Grid item xs={12} md={4}>
                            <Label htmlFor="incentiveType">Incentive Type</Label>
                            <RHFAutocomplete
                                name="incentiveType"
                                options={dummyOptions}
                                getOptionLabel={opt => opt.name}
                                placeholder="Select..."
                                helperText=""
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="incentiveValue">Incentive Value</Label>
                            <RHFTextField name="incentiveValue" />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="payoutMode">Payout Mode</Label>
                            <RHFAutocomplete
                                name="payoutMode"
                                options={dummyOptions}
                                getOptionLabel={opt => opt.name}
                                placeholder="Select..."
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="payoutTimeline">Payout Timeline</Label>
                            <RHFTextField name="payoutTimeline" />
                        </Grid>

                        <Grid item xs={12}>
                            <Label htmlFor="incentiveReversalConditions">Incentive Reversal Conditions</Label>
                            <RHFTextField
                                name="incentiveReversalConditions"
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

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
                    Submit
                </Button>
            </Box>

        </FormProvider >
    );
};

export default TimelyRepaymentIncentives;
