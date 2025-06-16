import React from 'react';
import {
    Grid,
    Box,
    FormControl,
    RadioGroup,
    Radio,
    FormControlLabel,
    FormGroup,
    Checkbox
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import TextFieldComponent from '../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import Label from '../../subcompotents/Label';

const options = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' }
];
const UserSystemInteractionLogs = () => {
    const { control } = useFormContext();
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="latePaymentFeeValue">Time Taken for Each Assessment Step (in seconds)</Label>
                    <Controller name="latePaymentFeeValue" control={control} render={({ field }) => <TextFieldComponent {...field} id="latePaymentFeeValue" />} />
                </Grid>

                {/* Row 4 */}
                <Grid item xs={12} md={4}>
                    <Label htmlFor="prepaymentFeeType">Assessment Steps</Label>
                    <Controller
                        name="prepaymentFeeType"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="prepaymentFeeType"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                {/* Row 5 */}
                <Grid item xs={12} md={4}>
                    <Label htmlFor="overallGst">Number of Credit Assessments Done per Applicant</Label>
                    <Controller name="overallGst" control={control} render={({ field }) => <TextFieldComponent {...field} id="overallGst" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="overallGst">Last Assessment Timestamp</Label>
                    <Controller name="overallGst" control={control} render={({ field }) => <TextFieldComponent {...field} id="overallGst" />} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="overallGst">System Version</Label>
                    <Controller name="overallGst" control={control} render={({ field }) => <TextFieldComponent {...field} id="overallGst" />} />
                </Grid>
                 <Grid item xs={12} md={4}>
                    <Label htmlFor="repaymentMode">User Role Logging the Action</Label>
                    <Controller
                        name="repaymentMode"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="repaymentMode"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Label htmlFor="overallGst">Underwriter Comments</Label>
                    <Controller name="overallGst" control={control} render={({ field }) => <TextFieldComponent  {...field} id="overallGst" multiline rows={4} />} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Label htmlFor="overallGst">Manual Override Notes</Label>
                    <Controller name="overallGst" control={control} render={({ field }) => <TextFieldComponent  {...field} id="overallGst" multiline rows={4} />} />
                </Grid>

               

                <Grid item xs={12} md={12}>
                    <FormControl component="fieldset">
                        <Label>System Alerts or Warnings</Label>
                        <Controller
                            name="systemAlerts"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <FormGroup row sx={{ flexWrap: 'wrap' }}>
                                    {[
                                        'Low Credit Score',
                                        'High DTI',
                                        'Missing Docs',
                                        'Fraud Risk',
                                        'AML Flag',
                                        'Others (specify)',
                                    ].map((option) => (
                                        <FormControlLabel
                                            key={option}
                                            control={
                                                <Checkbox

                                                    name={option}
                                                    checked={field.value.includes(option)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const value = e.target.name;
                                                        if (checked) {
                                                            field.onChange([...field.value, value]);
                                                        } else {
                                                            field.onChange(field.value.filter((item) => item !== value));
                                                        }
                                                    }}
                                                    sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }}
                                                />
                                            }
                                            label={option}
                                        />
                                    ))}
                                </FormGroup>
                            )}
                        />
                    </FormControl>
                </Grid>

            </Grid>
        </Box>
    )
}

export default UserSystemInteractionLogs
