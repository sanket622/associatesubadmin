import React from 'react';
import {
    Grid,
    Switch,
    FormControlLabel,
    Typography,
    Box,
    FormControl,
    RadioGroup,
    Radio,
    Checkbox
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
const DecisionActionLogging = () => {
    const { control } = useFormContext();
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="prepaymentFeeType">Decision Outcome</Label>
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
                <Grid item xs={12} md={4}>
                    <Label htmlFor="latePaymentFeeValue">Decision DateTime</Label>
                    <Controller name="latePaymentFeeValue" control={control} render={({ field }) => <TextFieldComponent {...field} id="latePaymentFeeValue" />} />
                </Grid>

                {/* Row 4 */}
                <Grid item xs={12} md={4}>
                    <Label htmlFor="prepaymentFeeType">Decision By</Label>
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

                <Grid item xs={12} md={4}>
                    <Label htmlFor="disbursementMode">Reasons for Decision</Label>
                    <Controller
                        name="disbursementMode"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="disbursementMode"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="repaymentMode">Risk Band Assigned</Label>
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
                <Grid item xs={12} md={4}>
                    <Label htmlFor="emiFrequency">Conditions for Approval</Label>
                    <Controller
                        name="emiFrequency"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="emiFrequency"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="emiFrequency">Rejection Reason Codes</Label>
                    <Controller
                        name="emiFrequency"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="emiFrequency"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="latePaymentFeeValue">Decision Duration</Label>
                    <Controller name="latePaymentFeeValue" control={control} render={({ field }) => <TextFieldComponent {...field} id="latePaymentFeeValue" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="latePaymentFeeValue">Override Logs</Label>
                    <Controller name="latePaymentFeeValue" control={control} render={({ field }) => <TextFieldComponent {...field} id="latePaymentFeeValue" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="emiFrequency">Audit Trail</Label>
                    <Controller
                        name="emiFrequency"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="emiFrequency"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Label htmlFor="latePaymentFeeValue">Escalation Notes</Label>
                    <Controller name="latePaymentFeeValue" control={control} render={({ field }) => <TextFieldComponent {...field} id="latePaymentFeeValue" multiline rows={4} />} />
                </Grid>

            </Grid>
        </Box>
    )
}

export default DecisionActionLogging
