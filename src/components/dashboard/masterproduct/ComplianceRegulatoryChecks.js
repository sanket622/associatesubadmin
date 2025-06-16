import React from 'react';
import {
    Grid,
    Box
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

const ComplianceRegulatoryChecks = () => {
    const { control } = useFormContext();

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="amlCheckStatus">AML (Anti-Money Laundering) Check Status</Label>
                    <Controller
                        name="amlCheckStatus"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="amlCheckStatus"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="pepCheck">Politically Exposed Person (PEP) Check</Label>
                    <Controller
                        name="pepCheck"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="pepCheck"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="sanctionsListCheck">Sanctions List Check</Label>
                    <Controller
                        name="sanctionsListCheck"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="sanctionsListCheck"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="fraudFlags">Fraud Flags (Internal/External)</Label>
                    <Controller
                        name="fraudFlags"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="fraudFlags"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="kycKybStatus">KYC / KYB Compliance Status</Label>
                    <Controller
                        name="kycKybStatus"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="kycKybStatus"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="kycVerificationMode">KYC Verification Mode</Label>
                    <Controller
                        name="kycVerificationMode"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="kycVerificationMode"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="creditConsentCaptured">Consent Captured for Credit Checks</Label>
                    <Controller
                        name="creditConsentCaptured"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="creditConsentCaptured"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="consentCaptureMethod">Consent Capture Method</Label>
                    <Controller
                        name="consentCaptureMethod"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteFieldComponent
                                {...field}
                                id="consentCaptureMethod"
                                options={options}
                                getOptionLabel={(option) => option.name}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="consentTimestamp">Consent Timestamp</Label>
                    <Controller
                        name="consentTimestamp"
                        control={control}
                        render={({ field }) => (
                            <TextFieldComponent {...field} id="consentTimestamp" />
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ComplianceRegulatoryChecks;
