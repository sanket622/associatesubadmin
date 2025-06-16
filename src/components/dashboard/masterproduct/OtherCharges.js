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
import TextFieldComponent from '../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import Label from '../../subcompotents/Label';

const OtherCharges = () => {
      const { control } = useFormContext();

  return (
     <Box>
            <Grid container spacing={2}>
                {/* Row 1 */}
                <Grid item xs={12} md={4}>
                    <Label htmlFor="minLoanAmount">Cheque Bounce Charges</Label>
                    <Controller name="minLoanAmount" control={control} render={({ field }) => <TextFieldComponent {...field} id="minLoanAmount" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxLoanAmount">Charges for issuing duplicate termination papers (Duplicate NOC)</Label>
                    <Controller name="maxLoanAmount" control={control} render={({ field }) => <TextFieldComponent {...field} id="maxLoanAmount" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxLoanAmount">Charges for furnishing statement of account - 2nd time</Label>
                    <Controller name="maxLoanAmount" control={control} render={({ field }) => <TextFieldComponent {...field} id="maxLoanAmount" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxLoanAmount">Cheque Swapping Charges</Label>
                    <Controller name="maxLoanAmount" control={control} render={({ field }) => <TextFieldComponent {...field} id="maxLoanAmount" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxLoanAmount">Revocation/changes of ECS/ACH instruction charges</Label>
                    <Controller name="maxLoanAmount" control={control} render={({ field }) => <TextFieldComponent {...field} id="maxLoanAmount" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxLoanAmount">Charges for issuing copy of any document at borrowers request</Label>
                    <Controller name="maxLoanAmount" control={control} render={({ field }) => <TextFieldComponent {...field} id="maxLoanAmount" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxLoanAmount">Stamp Duty Charges (As per applicable laws of the State)</Label>
                    <Controller name="maxLoanAmount" control={control} render={({ field }) => <TextFieldComponent {...field} id="maxLoanAmount" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxLoanAmount">NOC Issuance Charges</Label>
                    <Controller name="maxLoanAmount" control={control} render={({ field }) => <TextFieldComponent {...field} id="maxLoanAmount" />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxLoanAmount">Legal / Collections / Repossession and Incidental Charges</Label>
                    <Controller name="maxLoanAmount" control={control} render={({ field }) => <TextFieldComponent {...field} id="maxLoanAmount" />} />
                </Grid>
            </Grid>

            {/* Additional Charges */}
            <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Additional Charges
                </Typography>

                {/* Subscription Section */}
                <Box
                    p={3}
                    mb={2}
                    border="1px solid #ccc"
                    borderRadius="16px"
                    display="flex"
                    flexDirection="column"
                    position="relative"
                >
                    <Box display="flex" justifyContent="space-between">
                        <Grid container spacing={2} sx={{ flex: 1 }}>
                            <Grid item xs={12} md={6}>
                                <Label htmlFor="subscriptionFee">Subscription Period & Fee</Label>
                                <TextFieldComponent
                                    name="subscriptionFee"
                                    id="subscriptionFee"
                                    value=""
                                    onChange={() => { }}
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Label htmlFor="subscriptionGst">Subscription GST</Label>
                                <Controller
                                    name="subscriptionGst"
                                    control={control}
                                    render={({ field }) => (
                                        <TextFieldComponent {...field} id="subscriptionGst" />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Checkbox
                            sx={{
                                alignSelf: 'flex-start',
                                color: '#0000FF',
                                marginLeft: 4,
                                marginTop: -2,
                                marginRight: -2,
                                '&.Mui-checked': {
                                    color: '#0000FF',
                                },
                            }}
                        />
                    </Box>
                </Box>

                {/* Transaction Fee Section */}
                <Box
                    p={3}
                    border="1px solid #ccc"
                    borderRadius="16px"
                    display="flex"
                    flexDirection="column"
                    position="relative"
                >
                    <Box display="flex" justifyContent="space-between">
                        <Grid container spacing={2} sx={{ flex: 1 }}>
                            <Grid item xs={12} md={3}>
                                <Label htmlFor="perTransactionFee">Per Transaction Fee</Label>
                                <AutocompleteFieldComponent
                                    options={[]}
                                    value={null}
                                    onChange={() => { }}
                                    getOptionLabel={(option) => option.name}
                                    id="perTransactionFee"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Label htmlFor="perTransactionAmount">Per Transaction Amount</Label>
                                <TextFieldComponent
                                    value=""
                                    onChange={() => { }}
                                    id="perTransactionAmount"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Label htmlFor="gstOnTransactionFee">GST on Per Transaction Fee</Label>
                                <Controller
                                    name="gstOnTransactionFee"
                                    control={control}
                                    render={({ field }) => (
                                        <TextFieldComponent {...field} id="gstOnTransactionFee" />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Checkbox
                            sx={{
                                alignSelf: 'flex-start',
                                color: '#0000FF',
                                marginLeft: 4,
                                marginTop: -2,
                                marginRight: -2,
                                '&.Mui-checked': {
                                    color: '#0000FF',
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
  )
}

export default OtherCharges
