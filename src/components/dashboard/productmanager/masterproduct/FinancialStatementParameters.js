import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TextFieldComponent from '../../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../../subcompotents/AutocompleteFieldComponent';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Box,
    Button
} from '@mui/material';
import Label from '../../../subcompotents/Label';
import { useDispatch, useSelector } from 'react-redux';
import FormProvider from '../../../subcompotents/FormProvider';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../../subcompotents/RHFTextField';
import { setEditFinancialData, submitFinancialStatement } from '../../../../redux/masterproduct/financialstatement/financialStatementSlice';
import { useLocation } from 'react-router';

export const salaryPatternOptions = [
    { id: 'MONTHLY', name: 'Monthly' },
    { id: 'WEEKLY', name: 'Weekly' },
    { id: 'BIWEEKLY', name: 'Biweekly' },
    { id: 'IRREGULAR', name: 'Irregular' },
    { id: 'SEASONAL', name: 'Seasonal' },
];

export const incomeRecognitionMethodOptions = [
    { id: 'INFLOWS_MINUS_OUTFLOWS', name: 'Inflows Minus Outflows' },
    { id: 'AVG_MONTHLY_SURPLUS', name: 'Avg Monthly Surplus' },
    { id: 'CUSTOM_FORMULA', name: 'Custom Formula' },
];

export const statementSourceOptions = [
    { id: 'MANUAL_UPLOAD', name: 'Manual Upload' },
    { id: 'ACCOUNT_AGGREGATOR', name: 'Account Aggregator' },
    { id: 'BANK_SCRAPING', name: 'Bank Scraping' },
    { id: 'UPI_PARSING', name: 'UPI Parsing' },
];

export const accountTypeOptions = [
    { id: 'SAVINGS', name: 'Savings' },
    { id: 'CURRENT', name: 'Current' },
    { id: 'WALLET', name: 'Wallet' },
    { id: 'OD_ACCOUNT', name: 'OD Account' },
];

const FinancialStatementParameters = ({ tabIndex, setTabIndex }) => {

    const location = useLocation()
    const mode = location?.state?.mode
    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.products.productDetails);
    const editFinancialData = useSelector((state) => state.financialStatement.editFinancialData);
    console.log(editFinancialData);
    


    const financialStatementSchema = yup.object().shape({
        minimumMonthlyCredit: yup
            .number()
            .typeError('Minimum Monthly Credit must be a number')
            .required('Minimum Monthly Credit is required'),

        minimumAverageBalance: yup
            .number()
            .typeError('Minimum Average Balance must be a number')
            .required('Minimum Average Balance is required'),

        salaryPattern: yup
            .object()
            .nullable()
            .required('Salary Credit Pattern is required'),

        bouncesOrCharges: yup
            .number()
            .typeError('Bounces/Charges must be a number')
            .required('This field is required'),

        cashDepositsCap: yup
            .number()
            .typeError('Cash Deposits Cap must be a number')
            .required('This field is required'),

        incomeRecognitionMethod: yup
            .object()
            .nullable()
            .required('Income Recognition Method is required'),

        statementSource: yup
            .object()
            .nullable()
            .required('Statement Source is required'),

        accountType: yup
            .object()
            .nullable()
            .required('Account Type is required'),

        pdfParsingOrJsonRequired: yup
            .string()
            .required('Please select an option'),
    });

    const defaultValues = (productDetails && mode === "EDIT") ? {

        minimumMonthlyCredit: editFinancialData?.minimumMonthlyCredit
            || productDetails?.financialStatements?.minMonthlyCredit
            || '',

        minimumAverageBalance: editFinancialData?.minimumAverageBalance
            || productDetails?.financialStatements?.minAverageBalance
            || '',

        bouncesOrCharges: editFinancialData?.bouncesOrCharges
            || productDetails?.financialStatements?.bouncesLast3Months
            || '',

        cashDepositsCap: editFinancialData?.cashDepositsCap
            || productDetails?.financialStatements?.cashDepositsCapPercent
            || '',

        salaryPattern:
            salaryPatternOptions.find(
                option =>
                    option.id === editFinancialData?.salaryPattern
                    || option.id === productDetails?.financialStatements?.salaryPattern
            ) || null,

        incomeRecognitionMethod:
            incomeRecognitionMethodOptions.find(
                option =>
                    option.id === editFinancialData?.incomeRecognitionMethod
                    || option.id === productDetails?.financialStatements?.netIncomeRecognition
            ) || null,

        statementSource:
            statementSourceOptions.find(
                option =>
                    option.id === editFinancialData?.statementSource?.[0]
                    || option.id === productDetails?.financialStatements?.statementSources?.[0]
            ) || null,

        accountType:
            accountTypeOptions.find(
                option =>
                    option.id === editFinancialData?.accountType?.[0]
                    || option.id === productDetails?.financialStatements?.accountTypes?.[0]
            ) || null,

        pdfParsingOrJsonRequired: editFinancialData?.pdfParsingOrJsonRequired || (productDetails?.financialStatements?.pdfParsingRequired === true ? "yes" : "no")
    } : {
        minimumMonthlyCredit: '',
        minimumAverageBalance: '',
        bouncesOrCharges: '',
        cashDepositsCap: '',
        salaryPattern: null,
        incomeRecognitionMethod: null,
        statementSource: null,
        accountType: null,
        pdfParsingOrJsonRequired: '',
    }

    const methods = useForm({
        resolver: yupResolver(financialStatementSchema),
        defaultValues
    });

    const {
        control,
        reset,
        handleSubmit,
        watch,
        formState: { errors }
    } = methods

    const values = watch()
    console.log("values", values);

    useEffect(() => {
        if (productDetails || editFinancialData) {
            reset(defaultValues)
        }
    }, [productDetails, editFinancialData])

    const onSubmit = (data) => {
        if (mode === "EDIT") {
            dispatch(setEditFinancialData(data))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(submitFinancialStatement(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }


    const onError = (e) => console.log(e)

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="minimumMonthlyCredit">Minimum Monthly Credit</Label>
                    <RHFTextField name="minimumMonthlyCredit" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="minimumAverageBalance">Minimum Average Balance</Label>
                    <RHFTextField name="minimumAverageBalance" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="salaryPattern">Salary Credit Pattern</Label>
                    <RHFAutocomplete
                        name="salaryPattern"
                        options={salaryPatternOptions}
                        getOptionLabel={(option) => option.name}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="bouncesOrCharges">No. of Bounces/Charges in Last 3 Months</Label>
                    <RHFTextField name="bouncesOrCharges" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="cashDepositsCap">Cash Deposits % Cap</Label>
                    <RHFTextField name="cashDepositsCap" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="incomeRecognitionMethod">Net Income Recognition Method</Label>
                    <RHFAutocomplete
                        name="incomeRecognitionMethod"
                        options={incomeRecognitionMethodOptions}
                        getOptionLabel={(option) => option.name}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="statementSource">Source of Statement</Label>
                    <RHFAutocomplete
                        name="statementSource"
                        options={statementSourceOptions}
                        getOptionLabel={(option) => option.name}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="accountType">Account Type</Label>
                    <RHFAutocomplete
                        name="accountType"
                        options={accountTypeOptions}
                        getOptionLabel={(option) => option.name}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl component="fieldset">
                        <Label>PDF Parsing or JSON Required?</Label>
                        <Controller
                            name="pdfParsingOrJsonRequired"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup row {...field}>
                                    <FormControlLabel
                                        value="yes"
                                        control={
                                            <Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />
                                        }
                                        label="Yes"
                                    />
                                    <FormControlLabel
                                        value="no"
                                        control={
                                            <Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />
                                        }
                                        label="No"
                                    />
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / 10</Box>
                <Button sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} variant="outlined" onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))} disabled={tabIndex === 0}>Back</Button>
                <Button variant="contained" sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} type="submit">Next</Button>
            </Box>
        </FormProvider>

    );
};

export default FinancialStatementParameters;
