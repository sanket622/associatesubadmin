import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import TextFieldComponent from '../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import {
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
} from '@mui/material';
import Label from '../../subcompotents/Label';

const dummyOptions = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
];

const TimelyRepaymentIncentives = () => {
    const { control } = useFormContext();

    const penalInterestApplicable = useWatch({
        control,
        name: 'penalInterestApplicable',
        defaultValue: 'no', // ensures it is selected by default
    });

    return (
        <Grid container spacing={2}>
            {/* Radio Group */}
            <Grid item xs={12} md={4}>
                <FormControl component="fieldset">
                    <Label>Penal Interest Rate Applicable?</Label>
                    <Controller
                        name="penalInterestApplicable"
                        control={control}
                        defaultValue="no"
                        render={({ field }) => (
                            <RadioGroup row {...field} id="penalInterestApplicable">
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

            {/* Conditionally show these only if "Yes" is selected */}
            {penalInterestApplicable === 'yes' && (
                <>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="incentiveType">Incentive Type</Label>
                        <Controller
                            name="incentiveType"
                            control={control}
                            render={({ field }) => (
                                <AutocompleteFieldComponent
                                    {...field}
                                    id="incentiveType"
                                    options={dummyOptions}
                                    getOptionLabel={(option) => option.name}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="incentiveValue">Incentive Value</Label>
                        <Controller
                            name="incentiveValue"
                            control={control}
                            render={({ field }) => (
                                <TextFieldComponent {...field} id="incentiveValue" />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                        <Controller
                            name="eligibilityCriteria"
                            control={control}
                            render={({ field }) => (
                                <AutocompleteFieldComponent
                                    {...field}
                                    id="eligibilityCriteria"
                                    options={dummyOptions}
                                    getOptionLabel={(option) => option.name}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="payoutMode">Payout Mode</Label>
                        <Controller
                            name="payoutMode"
                            control={control}
                            render={({ field }) => (
                                <AutocompleteFieldComponent
                                    {...field}
                                    id="payoutMode"
                                    options={dummyOptions}
                                    getOptionLabel={(option) => option.name}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label htmlFor="payoutTimeline">Payout Timeline</Label>
                        <Controller
                            name="payoutTimeline"
                            control={control}
                            render={({ field }) => (
                                <TextFieldComponent {...field} id="payoutTimeline" />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Label htmlFor="incentiveReversalConditions">Incentive Reversal Conditions</Label>
                        <Controller
                            name="incentiveReversalConditions"
                            control={control}
                            render={({ field }) => (
                                <TextFieldComponent {...field} id="incentiveReversalConditions" multiline rows={4} />
                            )}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default TimelyRepaymentIncentives;
