import React from 'react';
import {
    Grid,
    FormControlLabel,
    Box,
    FormControl,
    RadioGroup,
    Radio,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import TextFieldComponent from '../../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../../subcompotents/AutocompleteFieldComponent';
import Label from '../../../subcompotents/Label';

const options = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' }
];
const CreditEngineConfigurationParameters = () => {
      const { control } = useFormContext();
  return (
      <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="internalScoreVariables">Scoring Engine Type</Label>
                    <Controller
                        name="internalScoreVariables"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="internalScoreVariables"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="weightsForVariables">Decision Rules File Version</Label>
                    <Controller
                        name="weightsForVariables"
                        control={control}
                        render={({ field }) => (
                            <TextFieldComponent {...field} id="weightsForVariables" />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="riskCategoryMapping">Auto Approval Threshold Score</Label>
                    <Controller
                        name="riskCategoryMapping"
                        control={control}
                        render={({ field }) => (
                            <TextFieldComponent {...field} id="riskCategoryMapping" />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxDtiRatioAllowed">Auto Reject Threshold Score</Label>
                    <Controller
                        name="maxDtiRatioAllowed"
                        control={control}
                        render={({ field }) => (
                            <TextFieldComponent {...field} id="maxDtiRatioAllowed" />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxLtvRatioIfSecured">Manual Review Bucket</Label>
                    <Controller
                        name="maxLtvRatioIfSecured"
                        control={control}
                        render={({ field }) => (
                            <TextFieldComponent {...field} id="maxLtvRatioIfSecured" />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="internalScoreVariables">ML Model Used</Label>
                    <Controller
                        name="internalScoreVariables"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="internalScoreVariables"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="riskBasedPricingStrategy">Model Version</Label>
                    <Controller
                        name="riskBasedPricingStrategy"
                        control={control}
                        render={({ field }) => (
                            <TextFieldComponent {...field} id="riskBasedPricingStrategy" />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="riskBasedPricingStrategy">Last Retrained Date</Label>
                    <Controller
                        name="riskBasedPricingStrategy"
                        control={control}
                        render={({ field }) => (
                            <TextFieldComponent type='date' {...field} id="riskBasedPricingStrategy" />
                        )}
                    />
                </Grid>

                 <Grid item xs={12} md={4}>
                    <Label htmlFor="internalScoreVariables">Explainability Engine Enabled</Label>
                    <Controller
                        name="internalScoreVariables"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="internalScoreVariables"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>
                 <Grid item xs={12} md={4}>
                    <Label htmlFor="internalScoreVariables">Approval Time SLA</Label>
                    <Controller
                        name="internalScoreVariables"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="internalScoreVariables"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl component="fieldset">
                        <Label htmlFor="coBorrowerRequiredForLowScore">Manual Override Permission</Label>
                        <Controller
                            name="coBorrowerRequiredForLowScore"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    row
                                    {...field}
                                    id="coBorrowerRequiredForLowScore"
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
  )
}

export default CreditEngineConfigurationParameters
