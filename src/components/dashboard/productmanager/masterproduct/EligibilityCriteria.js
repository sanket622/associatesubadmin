import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  submitEligibilityCriteria, setEditEligibilityData } from '../../../../redux/masterproduct/eligibilitycriteria/employmentTypesSlice';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import FormProvider from '../../../subcompotents/FormProvider';
import RHFTextField from '../../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import Label from '../../../subcompotents/Label';
import { setEligibilityCriteria } from '../../../../redux/masterproduct/editmasterproduct/masterProductUpdateSlice';
import { primaryBtnSx } from '../../../subcompotents/UtilityService';
import { submitMasterProductUpdateRequest } from '../../../../redux/masterproduct/productmetadata/createProductSlice';
import {

    updateMasterProductDraft
} from '../../../../redux/masterproduct/masterproductdraftslice/masterproductdraft';


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
    // minMonthlyIncome: yup.number().typeError('Min Monthly Income must be a number').required('Min Monthly Income is required'),
    // minBusinessVintage: yup.number().typeError('Min Business Vintage must be a number').required('Min Business Vintage is required'),
    // minBureauScore: yup.number().typeError('Min Bureau Score must be a number').required('Min Bureau Score is required'),
    coApplicantRequired: yup
        .string()
        .oneOf(['yes', 'no'])
        .required('Co-applicant is required'),

    collateralRequired: yup
        .string()
        .oneOf(['yes', 'no'])
        .required('Collateral is required'),
});

const EligibilityCriteria = ({ tabIndex, setTabIndex, totalTabs, status, mode: modeProp, onEditSuccess }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const mode = modeProp ?? null;
    // const employmentTypes = useSelector((state) => state.employmentTypes.employmentTypes);
    const loading = useSelector((state) => state.employmentTypes.loading);
    const documents = useSelector((state) => state.employmentTypes.documents);
    // const documentLoading = useSelector((state) => state.employmentTypes.loading);
    const editEligibilityData = useSelector((state) => state.employmentTypes.editEligibilityData);
    const productDetails = useSelector((state) => state.products.productDetails);

    const defaultValues = (productDetails && mode === "EDIT") ? {
        minAge: editEligibilityData?.minAge || productDetails?.eligibilityCriteria?.minAge || '',
        maxAge: editEligibilityData?.maxAge || productDetails?.eligibilityCriteria?.maxAge || '',
        // minMonthlyIncome: editEligibilityData?.minMonthlyIncome || productDetails?.eligibilityCriteria?.minMonthlyIncome || '',
        // minBusinessVintage: editEligibilityData?.minBusinessVintage || productDetails?.eligibilityCriteria?.minBusinessVintage || '',
        // minBureauScore: editEligibilityData?.minBureauScore || productDetails?.eligibilityCriteria?.minBureauScore || '',

        coApplicantRequired:
            (editEligibilityData?.coApplicantRequired ??
                productDetails?.eligibilityCriteria?.coApplicantRequired)
                ? 'yes'
                : 'no',

        collateralRequired:
            (editEligibilityData?.collateralRequired ??
                productDetails?.eligibilityCriteria?.collateralRequired)
                ? 'yes'
                : 'no',

    } : {
        minAge: '',
        maxAge: '',
        // minMonthlyIncome: '',
        // minBusinessVintage: '',
        // minBureauScore: '',
        coApplicantRequired: 'no',
        collateralRequired: 'no',
    }


    // useEffect(() => {
    //     dispatch(fetchEmploymentTypes());
    //     dispatch(fetchDocuments());
    // }, [dispatch]);

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
            const payload = {
                masterProductId: productDetails?.id,
                eligibilityCriteria: data,
            };

            if (productDetails?.status === 'Active') {
                const updatePayload = {
                    masterProductId: productDetails?.id,
                    reason: "Product update",
                    productCode: productDetails?.productCode,
                    productName: productDetails?.productName,
                    productDescription: productDetails?.productDescription,
                    productCategoryId: productDetails?.productCategory?.id,
                    loanTypeId: productDetails?.loanType?.id,
                    partnerId: productDetails?.productPartner?.id,
                    deliveryChannelIds: productDetails?.MasterProductDeliveryChannel?.map(d => d.deliveryChannel?.id),
                    segments: productDetails?.MasterProductSegment?.map(s => s.productSegment?.id),
                    purposeIds: productDetails?.MasterProductPurpose?.map(p => p.productPurpose?.id),
                    eligibilityCriteriaUpdate: {
                        minAge: data.minAge,
                        maxAge: data.maxAge,
                        coApplicantRequired: data.coApplicantRequired === 'yes',
                        collateralRequired: data.collateralRequired === 'yes',
                    }
                };
                dispatch(submitMasterProductUpdateRequest(updatePayload, () => {
                    enqueueSnackbar('Update request submitted successfully', { variant: 'success' });
                    onEditSuccess?.();
                }));
            } else {
                dispatch(
                    updateMasterProductDraft({
                        endpoint: 'updateEligibilityCriteriaDraft',
                        payload,
                    })
                )
                    .unwrap()
                    .then((res) => {
                        enqueueSnackbar(
                            res?.message || 'Draft saved successfully',
                            { variant: 'success' }
                        );
                        onEditSuccess?.();
                    })
                    .catch((err) => {
                        enqueueSnackbar(
                            err?.message || 'Failed to save draft',
                            { variant: 'error' }
                        );
                    });
            }
        }
        else {
            dispatch(
                submitEligibilityCriteria(data, () => {
                    setTabIndex(prev => Math.min(prev + 1, 9));
                })
            );
        }
    }
    // useEffect(() => {
    //     console.log('editEligibilityData', editEligibilityData);
    // }, [editEligibilityData]);

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

                {/* <Grid item xs={12} md={4}>
                    <Label htmlFor="minMonthlyIncome">Min Monthly Income</Label>
                    <RHFTextField name="minMonthlyIncome" id="minMonthlyIncome" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="minBusinessVintage">Min Business Vintage (if MSME)</Label>
                    <RHFTextField name="minBusinessVintage" id="minBusinessVintage" />
                </Grid>


                <Grid item xs={12} md={4}>
                    <Label htmlFor="minBureauScore">Min Bureau Score</Label>
                    <RHFTextField name="minBureauScore" id="minBureauScore" />
                </Grid> */}

                <Grid item xs={12} md={4}>
                    <Label>Co-Applicant Required</Label>
                    <Controller
                        name="coApplicantRequired"
                        control={methods.control}
                        render={({ field }) => (
                            <RadioGroup {...field} row>
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label>Collateral Required</Label>
                    <Controller
                        name="collateralRequired"
                        control={methods.control}
                        render={({ field }) => (
                            <RadioGroup {...field} row>
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        )}
                    />
                </Grid>



            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / {totalTabs}</Box>
                {
                    (mode === "EDIT") && (
                        < Button
                            sx={primaryBtnSx}
                            variant="outlined"
                            onClick={() => setTabIndex((prev) => Math.max(prev - 1, 0))}
                            disabled={tabIndex === 0}
                        >
                            Back
                        </Button>
                    )
                }
                <Button variant="contained" sx={primaryBtnSx} type="submit">
                    {mode === "EDIT" ? 'Save' : 'Next'}
                </Button>
            </Box>
        </FormProvider>
    );
};

export default EligibilityCriteria;
