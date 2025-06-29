import React from 'react';
import TextFieldComponent from '../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import { Box, Button, Grid } from '@mui/material';
import Label from '../../subcompotents/Label';
import FormProvider from '../../subcompotents/FormProvider';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext, Controller, useForm } from 'react-hook-form';
import { setEditCreditBureauData, submitCreditBureauConfig } from '../../../redux/masterproduct/creditbreuconfig/creditBureauConfigSlice';
import RHFAutocomplete from '../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../subcompotents/RHFTextField';
import { useLocation } from 'react-router';

export const delinquencyOptions = [
    { id: 'NONE', name: 'None' },
    { id: 'LESS_THAN_30_DPD', name: 'Less Than 30 DPD' },
    { id: 'LESS_THAN_60_DPD', name: 'Less Than 60 DPD' },
    { id: 'CUSTOM', name: 'Custom' },
];

export const bureauTypeOptions = [
    { id: 'CIBIL', name: 'CIBIL' },
    { id: 'CRIF_HIGHMARK', name: 'CRIF HIGHMARK' },
    { id: 'EXPERIAN', name: 'EXPERIAN' },
    { id: 'EQUIFAX', name: 'EQUIFAX' },
    { id: 'ANY', name: 'ANY' },
];

export const blacklistFlagOptions = [
    { id: 'WRITE_OFF', name: 'Write Off' },
    { id: 'SETTLEMENT', name: 'Settlement' },
    { id: 'FRAUD', name: 'Fraud' },
    { id: 'DELINQUENCY_OVER_90_DPD', name: 'Delinquency Over 90 DPD' },
    { id: 'WATCHLIST', name: 'Watchlist' },
    { id: 'LOAN_OVERDUES', name: 'Loan Overdues' },
    { id: 'MULTIPLE_ENQUIRIES', name: 'Multiple Enquiries' },
];

const CreditBureauParametersConfiguration = ({ handleTabChange, tabIndex, setTabIndex, handleNext }) => {
    const location = useLocation()
    const mode = location?.state?.mode
    const dispatch = useDispatch();

    const editCreditBureauData = useSelector((state) => state.creditBureauConfig.editCreditBureauData);
    const productDetails = useSelector((state) => state.products.productDetails);
    console.log(editCreditBureauData);
    

    
    const findOption = (options, id) => options.find(option => option.id === id) || null;

    const defaultValues = (productDetails && mode === "EDIT") ? {
        creditBureauSource: editCreditBureauData?.creditBureauSource
            || findOption(bureauTypeOptions, productDetails?.creditBureauConfig?.creditBureauSources?.[0])
            || [],

        minScoreRequired: editCreditBureauData?.minScoreRequired
            || productDetails?.creditBureauConfig?.minScoreRequired,

        maxActiveLoans: editCreditBureauData?.maxActiveLoans
            || productDetails?.creditBureauConfig?.maxActiveLoans,

        maxCreditUtilRatio: editCreditBureauData?.maxCreditUtilRatio
            || productDetails?.creditBureauConfig?.maxCreditUtilization,

        enquiriesLast6Months: editCreditBureauData?.enquiriesLast6Months
            || productDetails?.creditBureauConfig?.enquiriesLast6Months,

        loanDelinquencyAllowed: editCreditBureauData?.loanDelinquencyAllowed
            || findOption(delinquencyOptions,productDetails?.creditBureauConfig?.loanDelinquencyAllowed,)|| [],

        bureauFreshnessDays: editCreditBureauData?.bureauDataFreshnessDays
            || productDetails?.creditBureauConfig?.bureauDataFreshnessDays,

        customBureauFlags: editCreditBureauData?.customBureauFlags
            || findOption(blacklistFlagOptions,productDetails?.creditBureauConfig?.customBureauFlags?.[0])
            || [],

        scoreDecayTolerance: editCreditBureauData?.scoreDecayTolerance
            || productDetails?.creditBureauConfig?.scoreDecayTolerance,
    } : {

    }

    const validationSchema = yup.object().shape({
        creditBureauSource: yup.object().nullable().required('Credit Bureau Source is required'),
        minScoreRequired: yup
            .number()
            .typeError('Minimum Score must be a number')
            .min(0, 'Minimum Score must be positive')
            .required('Minimum Score is required'),
        maxActiveLoans: yup
            .number()
            .typeError('Max Active Loans must be a number')
            .required('Max Active Loans is required'),
        maxCreditUtilRatio: yup
            .number()
            .typeError('Credit Utilization Ratio must be a number')
            .required('Credit Utilization Ratio is required'),
        enquiriesLast6Months: yup
            .number()
            .typeError('Enquiries must be a number')
            .required('Number of Enquiries is required'),
        bureauFreshnessDays: yup
            .number()
            .typeError('Freshness Days must be a number')
            .required('Freshness is required'),
        loanDelinquencyAllowed: yup.object().nullable().required('Loan Delinquency option is required'),
        customBureauFlags: yup.object().nullable().required('Custom Bureau Flag is required'),
        scoreDecayTolerance: yup
            .number()
            .typeError('Score Decay Tolerance must be a number')
            .required('Score Decay Tolerance is required'),
    });


    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = methods

    const onSubmit = (data) => {
        if (mode === "EDIT") {
            dispatch(setEditCreditBureauData(data))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(submitCreditBureauConfig(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }

    const onError = (e) => console.log(e);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="creditBureauSource">Credit Bureau Source</Label>
                    <RHFAutocomplete
                        name="creditBureauSource"
                        id="creditBureauSource"
                        options={bureauTypeOptions}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="minScoreRequired">Minimum Score Required</Label>
                    <RHFTextField name="minScoreRequired" id="minScoreRequired" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxActiveLoans">Max No. of Active Loans</Label>
                    <RHFTextField name="maxActiveLoans" id="maxActiveLoans" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxCreditUtilRatio">Max Credit Utilization Ratio</Label>
                    <RHFTextField name="maxCreditUtilRatio" id="maxCreditUtilRatio" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="enquiriesLast6Months">No. of Enquiries in Last 6 Months</Label>
                    <RHFTextField name="enquiriesLast6Months" id="enquiriesLast6Months" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="bureauFreshnessDays">Bureau Data Freshness (in days)</Label>
                    <RHFTextField name="bureauFreshnessDays" id="bureauFreshnessDays" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="loanDelinquencyAllowed">Loan Delinquency History Allowed</Label>
                    <RHFAutocomplete
                        name="loanDelinquencyAllowed"
                        id="loanDelinquencyAllowed"
                        options={delinquencyOptions}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="customBureauFlags">Custom Bureau Flags</Label>
                    <RHFAutocomplete
                        name="customBureauFlags"
                        id="customBureauFlags"
                        options={blacklistFlagOptions}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="scoreDecayTolerance">Score Decay Tolerance</Label>
                    <RHFTextField name="scoreDecayTolerance" id="scoreDecayTolerance" type="number" />
                </Grid>

            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box
                    sx={{
                        border: '2px solid #6B6B6B',
                        borderRadius: '12px',
                        px: 2,
                        py: 1,
                        minWidth: 60,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#6B6B6B',
                    }}
                >
                    {tabIndex + 1} / 10
                </Box>


                <Button
                    sx={{
                        background: "#0000FF",
                        color: "white",
                        px: 6,
                        py: 1,
                        borderRadius: 2,
                        fontSize: "16px",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": { background: "#0000FF" },
                    }}
                    variant="outlined"
                    onClick={() => setTabIndex((prev) => Math.max(prev - 1, 0))}

                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        background: "#0000FF",
                        color: "white",
                        px: 6,
                        py: 1,
                        borderRadius: 2,
                        fontSize: "16px",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": { background: "#0000FF" },
                    }}
                    type='submit'
                >
                    Next
                </Button>


            </Box>
        </FormProvider>
    );
};

export default CreditBureauParametersConfiguration;
