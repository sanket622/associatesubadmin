import { Box, Button, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmploymentTypes, fetchDocuments, submitEligibilityCriteria,setEditEligibilityData } from '../../../redux/masterproduct/eligibilitycriteria/employmentTypesSlice';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormProvider from '../../subcompotents/FormProvider';
import RHFTextField from '../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../subcompotents/RHFAutocomplete';
import Label from '../../subcompotents/Label';
import { useLocation } from 'react-router';

export const bureauTypeOptions = [
    { id: 'CIBIL', name: 'CIBIL' },
    { id: 'CRIF_HIGHMARK', name: 'CRIF HIGHMARK' },
    { id: 'EXPERIAN', name: 'EXPERIAN' },
    { id: 'EQUIFAX', name: 'EQUIFAX' },
    { id: 'ANY', name: 'ANY' },
];

export const blacklistFlagOptions = [
    { id: 'WRITE_OFF', name: 'WRITE OFF' },
    { id: 'SETTLEMENT', name: 'SETTLEMENT' },
    { id: 'FRAUD', name: 'FRAUD' },
    { id: 'DELINQUENCY_OVER_90_DPD', name: 'DELINQUENCY OVER 90 DPD' },
    { id: 'WATCHLIST', name: 'WATCHLIST' },
    { id: 'LOAN_OVERDUES', name: 'LOAN OVERDUES' },
    { id: 'MULTIPLE_ENQUIRIES', name: 'MULTIPLE ENQUIRIES' },
];

export const submissionModeOptions = [
    { id: 'UPLOAD', name: 'UPLOAD' },
    { id: 'OCR', name: 'OCR' },
    { id: 'WHATSAPP', name: 'WHATSAPP' },
    { id: 'KYC_VIDEO', name: 'KYC VIDEO' },
    { id: 'API_PULL', name: 'API PULL' },
    { id: 'MANUAL_COLLECTION', name: 'MANUAL COLLECTION' },
];

export const verificationModeOptions = [
    { id: 'MANUAL', name: 'MANUAL' },
    { id: 'OCR', name: 'OCR' },
    { id: 'API_BASED', name: 'API BASED' },
    { id: 'AADHAAR_XML', name: 'AADHAAR XML' },
    { id: 'PAN_NSDL', name: 'PAN NSDL' },
    { id: 'BANKING_AGGREGATOR', name: 'BANKING AGGREGATOR' },
    { id: 'VIDEO_KYC', name: 'VIDEO KYC' },
    { id: 'GEO_TAGGING', name: 'GEO TAGGING' },
    { id: 'ESTAMP_VERIFICATION', name: 'ESTAMP VERIFICATION' },
];

// Validation schema
const validationSchema = yup.object().shape({
    minAge: yup.number().typeError('Min Age must be a number').required('Min Age is required'),
    maxAge: yup.number().typeError('Max Age must be a number').required('Max Age is required'),
    minMonthlyIncome: yup.number().typeError('Min Monthly Income must be a number').required('Min Monthly Income is required'),
    minBusinessVintage: yup.number().typeError('Min Business Vintage must be a number').required('Min Business Vintage is required'),
    employmentTypeAllowed: yup.array().min(1, 'Employment Type Allowed is required').required('Employment Type Allowed is required'),
    minBureauScore: yup.number().typeError('Min Bureau Score must be a number').required('Min Bureau Score is required'),
    bureauType: yup.object().nullable().required('Bureau Type is required'),
    blacklistFlags: yup.array().min(1, 'Blacklist Flags are required').required('Blacklist Flags are required'),
    minimumDocumentsRequired: yup.array().min(1, 'Minimum Documents Required is required').required('Minimum Documents Required is required'),
    documentSubmissionMode: yup.object().nullable().required('Document Submission Mode is required'),
    documentVerificationMode: yup.object().nullable().required('Document Verification Mode is required'),
});

const EligibilityCriteria = ({ tabIndex, setTabIndex }) => {
    const dispatch = useDispatch();
    const location = useLocation()
    const mode = location?.state?.mode
    const employmentTypes = useSelector((state) => state.employmentTypes.employmentTypes);
    const loading = useSelector((state) => state.employmentTypes.loading);
    const documents = useSelector((state) => state.employmentTypes.documents);
    const documentLoading = useSelector((state) => state.employmentTypes.loading);
    const editEligibilityData = useSelector((state) => state.employmentTypes.editEligibilityData);
    const productDetails = useSelector((state) => state.products.productDetails);

    const defaultValues = (productDetails && mode === "EDIT") ? {
        minAge: editEligibilityData?.minAge || productDetails?.eligibilityCriteria?.minAge || '',
        maxAge: editEligibilityData?.maxAge || productDetails?.eligibilityCriteria?.maxAge || '',
        minMonthlyIncome: editEligibilityData?.minMonthlyIncome || productDetails?.eligibilityCriteria?.minMonthlyIncome || '',
        minBusinessVintage: editEligibilityData?.minBusinessVintage || productDetails?.eligibilityCriteria?.minBusinessVintage || '',
        minBureauScore: editEligibilityData?.minBureauScore || productDetails?.eligibilityCriteria?.minBureauScore || '',

        employmentTypeAllowed:
            editEligibilityData?.employmentTypeAllowed ||
            productDetails?.eligibilityCriteria?.employmentTypesAllowed?.map(item => ({
                id: item.employmentId,
                name: employmentTypes.find(item => item.id === item.employmentId)?.name || item.employmentId
            })) || [],

        blacklistFlags:
            editEligibilityData?.blacklistFlags ||
            productDetails?.eligibilityCriteria?.blacklistFlags?.map(flag => ({
                id: flag,
                name: blacklistFlagOptions.find(opt => opt.id === flag)?.name || flag
            })) || [],

        minimumDocumentsRequired:
            editEligibilityData?.minimumDocumentsRequired ||
            productDetails?.eligibilityCriteria?.minDocumentsRequired?.map(doc => ({
                id: doc.documentId,
                name: documents.find(d => d.id === doc.documentId)?.name || doc.documentId
            })) || [],

        documentSubmissionMode:
            submissionModeOptions.find(opt =>
                opt.id === editEligibilityData?.documentSubmissionMode?.id
                || opt.id === productDetails?.eligibilityCriteria?.documentSubmissionModes?.[0]
            ) || null,

        documentVerificationMode:
            verificationModeOptions.find(opt =>
                opt.id === editEligibilityData?.documentVerificationMode?.id
                || opt.id === productDetails?.eligibilityCriteria?.documentVerificationModes?.[0]
            ) || null,
    } : {
        minAge: '',
        maxAge: '',
        minMonthlyIncome: '',
        minBusinessVintage: '',
        minBureauScore: '',
        employmentTypeAllowed: [],
        blacklistFlags: [],
        minimumDocumentsRequired: [],
        bureauType: null,
        documentSubmissionMode: null,
        documentVerificationMode: null,
    }


    useEffect(() => {
        dispatch(fetchEmploymentTypes());
        dispatch(fetchDocuments());
    }, [dispatch]);

    const methods = useForm({
        resolver: yupResolver(validationSchema),
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
        if (productDetails || editEligibilityData) {
            reset(defaultValues)
        }
    }, [productDetails, editEligibilityData])



    const onSubmit = (data) => {
        if (mode === "EDIT") {
            dispatch(setEditEligibilityData(data))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(submitEligibilityCriteria(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }
    useEffect(() => {
        console.log('editEligibilityData', editEligibilityData);
    }, [editEligibilityData]);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="minAge">Min Age</Label>
                    <RHFTextField name="minAge" id="minAge" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="maxAge">Max Age</Label>
                    <RHFTextField name="maxAge" id="maxAge" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="minMonthlyIncome">Min Monthly Income</Label>
                    <RHFTextField name="minMonthlyIncome" id="minMonthlyIncome" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="minBusinessVintage">Min Business Vintage (if MSME)</Label>
                    <RHFTextField name="minBusinessVintage" id="minBusinessVintage" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="employmentTypeAllowed">Employment Type Allowed</Label>
                    <RHFAutocomplete
                        name="employmentTypeAllowed"
                        id="employmentTypeAllowed"
                        options={employmentTypes}
                        loading={loading}
                        multiple
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="minBureauScore">Min Bureau Score</Label>
                    <RHFTextField name="minBureauScore" id="minBureauScore" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="bureauType">Bureau Type</Label>
                    <RHFAutocomplete
                        name="bureauType"
                        id="bureauType"
                        options={bureauTypeOptions}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="blacklistFlags">Blacklist Flags</Label>
                    <RHFAutocomplete
                        name="blacklistFlags"
                        id="blacklistFlags"
                        options={blacklistFlagOptions}
                        multiple
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="minimumDocumentsRequired">Minimum Documents Required</Label>
                    <RHFAutocomplete
                        name="minimumDocumentsRequired"
                        id="minimumDocumentsRequired"
                        options={documents}
                        loading={documentLoading}
                        multiple
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="documentSubmissionMode">Document Submission Mode</Label>
                    <RHFAutocomplete
                        name="documentSubmissionMode"
                        id="documentSubmissionMode"
                        options={submissionModeOptions}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="documentVerificationMode">Document Verification Mode</Label>
                    <RHFAutocomplete
                        name="documentVerificationMode"
                        id="documentVerificationMode"
                        options={verificationModeOptions}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
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

export default EligibilityCriteria;
