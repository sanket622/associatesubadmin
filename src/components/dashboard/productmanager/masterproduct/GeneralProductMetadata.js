import React, { useEffect } from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import { useFormContext, Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import TextFieldComponent from '../../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../../subcompotents/AutocompleteFieldComponent';
import Label from '../../../subcompotents/Label';
import { fetchProductMetadata } from '../../../../redux/masterproduct/productmetadata/productMetadataSlice';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createGeneralProduct, setEditGeneralProductMetaData, submitMasterProductUpdateRequest } from '../../../../redux/masterproduct/productmetadata/createProductSlice';
import { useSnackbar } from 'notistack';
import FormProvider from '../../../subcompotents/FormProvider';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../../subcompotents/RHFTextField';
import { primaryBtnSx, replaceUnderscore } from '../../../subcompotents/UtilityService';
import { setGeneralMetadata } from '../../../../redux/masterproduct/editmasterproduct/masterProductUpdateSlice';
import {

    updateMasterProductDraft
} from '../../../../redux/masterproduct/masterproductdraftslice/masterproductdraft';

const GeneralProductMetadata = ({ handleTabChange, tabIndex, setTabIndex, totalTabs, handleNext, status, mode: modeProp, onEditSuccess }) => {
    const { enqueueSnackbar } = useSnackbar();
    const mode = modeProp ?? null;
    const dispatch = useDispatch();
    const productDetails = useSelector((state) => state.products.productDetails);
    const { loading } = useSelector(
        state => state.updateMasterProductDraft
    );
    const editGeneralProductMetaData = useSelector((state) => state?.createProduct?.editGeneralProductMetaData);
    const generalProductValidationSchema = yup.object().shape({
        productName: yup.string().required('Product Name is required'),
        productDescription: yup.string().required('Product Description is required'),
        subLoanType: yup.object().required('Product Category is required'),
        loanType: yup.object().required('Loan Type is required'),
        // businessSegment: yup.array().min(1, 'At least one Delivery Channel is required'),
        productType: yup.object().required('Partner/Program Tag is required'),
        // status: yup.object().required('Status is required'),
        partnerCode: yup.array().min(1, 'At least one Purpose Category is required'),
        segmentType: yup.array().min(1, 'At least one Segment Type is required'),
        deliveryChannel: yup.array().min(1, 'At least one Delivery Channel is required'),
        // disbursementModes: yup.array().min(1, 'At least one Disbursement Mode is required'),
        // repaymentModes: yup.array().min(1, 'At least one Repayment Mode is required'),

        location: yup.array(),
    });

    // console.log("editGeneralProductMetaData", productDetails?.MasterProductSegment?.map(d => ({
    //     label: d.productSegment?.name,
    //     value: d.productSegment?.id,
    // })));

    // const productStatusOptions = [
    //     { id: 'Draft', name: 'Draft' },
    //     { id: 'Active', name: 'Active' },
    //     { id: 'Archived', name: 'Archived' },
    // ];



    const defaultValues = (productDetails && mode === "EDIT") ? {
        productCode: editGeneralProductMetaData?.productCode || productDetails?.productCode,
        productName: editGeneralProductMetaData?.productName || productDetails?.productName,
        productDescription: editGeneralProductMetaData?.productDescription || productDetails?.productDescription,
        // status:
        //     editGeneralProductMetaData?.status ??
        //     productStatusOptions.find(
        //         opt => opt.id === productDetails?.status
        //     ) ??
        //     null,
        subLoanType: editGeneralProductMetaData?.subLoanType || productDetails?.productCategory,
        loanType: editGeneralProductMetaData?.loanType || productDetails?.loanType,
        productType: editGeneralProductMetaData?.productType || productDetails?.productPartner,

        deliveryChannel: editGeneralProductMetaData?.deliveryChannel || productDetails?.MasterProductDeliveryChannel?.map(item => item.deliveryChannel) || [],
        segmentType:
            editGeneralProductMetaData?.segmentType ||
            productDetails?.MasterProductSegment?.map(
                item => item.productSegment
            ) ||
            [],

        partnerCode: editGeneralProductMetaData?.purpose || productDetails?.MasterProductPurpose?.map(item => item.productPurpose) || [],
        // disbursementModes: editGeneralProductMetaData?.disbursementModes || productDetails?.FinancialDisbursementMode?.map(item => item.disbursementMode) || [],
        // repaymentModes: editGeneralProductMetaData?.repaymentModes || productDetails?.FinancialRepaymentMode?.map(item => item.RepaymentModes) || [],

    } : {
        productCode: '',
        productName: '',
        productDescription: '',
        // status: null,
        subLoanType: null,
        loanType: null,
        productType: null,
        deliveryChannel: [],
        segmentType: [],
        partnerCode: [],
        // disbursementModes: [],
        // repaymentModes: []
    };

    const methods = useForm({
        resolver: yupResolver(generalProductValidationSchema),
        defaultValues,
    });

    const {
        control,
        reset,
        handleSubmit,
        watch,
        formState: { errors }
    } = methods

    // const values = watch()
    // console.log("values", values);

    useEffect(() => {

        if (productDetails || editGeneralProductMetaData) {
            reset(defaultValues)
        }
    }, [productDetails, editGeneralProductMetaData])


    const {
        productCategories,
        productSegments,
        loanTypes,
        purposeCategories,
        partners,
        // geographyStates,
        repaymentModes,
        disbursementModes,
        deliveryChannels
    } = useSelector((state) => state.productMetadata);

   


    useEffect(() => {
        dispatch(fetchProductMetadata());
    }, [dispatch]);

    // const deliveryChannelOptions = [
    //     { id: 'Mobile_App', name: 'Mobile App' },
    //     { id: 'Field_Agent', name: 'Field Agent' },
    //     { id: 'Call_Center', name: 'Call Center' },
    //     { id: 'Embedded_Api', name: 'Embedded API' },
    //     { id: 'Partner_Portal', name: 'Partner Portal' },
    //     { id: 'Whatsapp_Bot', name: 'WhatsApp Bot' },
    // ];





    const onSubmit = (data) => {
        // console.log("General Product Metadata Data", data);
        const payload = {
            masterProductId: productDetails?.id,
            reason: "testing",
            productCode: data?.productCode,
            productName: data?.productName,
            productDescription: data?.productDescription,

            productCategoryId: data?.subLoanType?.id,
            loanTypeId: data?.loanType?.id,
            partnerId: data.productType.id,

            deliveryChannelIds: data?.deliveryChannel?.map(d => d.id),
            segments: data?.segmentType?.map(s => s.id),
            purposeIds: data?.partnerCode?.map(p => p.id),
            // disbursementModeIds: data?.disbursementModes?.map(d => d.id),
            // repaymentModeIds: data?.repaymentModes?.map(r => r.id),
        };

        if (mode === "EDIT") {
            if (productDetails?.status === 'Active') {
                dispatch(submitMasterProductUpdateRequest(payload, () => {
                    enqueueSnackbar('Update request submitted successfully', { variant: 'success' });
                    onEditSuccess?.();
                }));
            } else {
                dispatch(
                    updateMasterProductDraft({
                        endpoint: 'updateMasterProductDraft',
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
                createGeneralProduct(payload, () => {
                    setTabIndex(prev => prev + 1);
                })
            );
        }
    };






    const onError = (e) => console.log(e)

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="productCode">Product Code</Label>
                    <RHFTextField name="productCode" id="productCode" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="productName">Product Name</Label>
                    <RHFTextField name="productName" id="productName" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="subLoanType">Product Category</Label>
                    <RHFAutocomplete
                        name="subLoanType"
                        id="subLoanType"
                        options={productCategories}
                        getOptionLabel={(option) => option?.categoryName || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="segmentType">Segment Type</Label>
                    <RHFAutocomplete
                        name="segmentType"
                        id="segmentType"
                        multiple
                        options={productSegments}
                        getOptionLabel={(option) => option?.name || ''}

                    />

                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="loanType">Loan Type</Label>
                    <RHFAutocomplete
                        name="loanType"
                        id="loanType"
                        options={loanTypes}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="partnerCode">Purpose Category</Label>
                    <RHFAutocomplete
                        name="partnerCode"
                        id="partnerCode"
                        multiple
                        options={purposeCategories}
                        getOptionLabel={(option) => option?.purpose || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="deliveryChannel">Delivery Channel(S)</Label>
                    <RHFAutocomplete
                        name="deliveryChannel"
                        id="deliveryChannel"
                        multiple
                        options={deliveryChannels}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

                {/* 
                <Grid item xs={12} md={4}>
                    <Label htmlFor="location">Geography</Label>
                    <RHFAutocomplete
                        name="location"
                        id="location"
                        multiple
                        options={geographyStates}
                        getOptionLabel={(option) => option?.stateName || ''}
                    />
                </Grid> */}

                <Grid item xs={12} md={4}>
                    <Label htmlFor="productType">Partner/Program Tag</Label>
                    <RHFAutocomplete
                        name="productType"
                        id="productType"
                        options={partners}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

                {/* <Grid item xs={12} md={4}>
                    <Label htmlFor="disbursementModes">Disbursement Mode</Label>
                    <RHFAutocomplete
                        name="disbursementModes"
                        id="disbursementModes"
                        multiple
                        options={disbursementModes}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="repaymentModes">Repayment Mode</Label>
                    <RHFAutocomplete
                        name="repaymentModes"
                        id="repaymentModes"
                        multiple
                        options={repaymentModes}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid> */}

                {/* <Grid item xs={12} md={4}>
                    <Label htmlFor="status">Status</Label>
                    <RHFAutocomplete
                        name="status"
                        id="status"
                        options={productStatusOptions}
                        getOptionLabel={(option) => option?.name || ''}

                    />
                </Grid> */}

                <Grid item xs={12}>
                    <Label htmlFor="productDescription">Product Description</Label>
                    <RHFTextField
                        name="productDescription"
                        id="productDescription"
                        multiline
                        rows={4}
                    />
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
                    {tabIndex + 1} / {totalTabs}
                </Box>


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
                {/* <Button
                    sx={primaryBtnSx}
                    variant="outlined"
                    onClick={() => setTabIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={tabIndex === 0}
                >
                    Back
                </Button> */}

                <Button
                    variant="contained"
                    sx={primaryBtnSx}
                    type='submit'
                >
                    {mode === "EDIT" ? 'Save' : 'Next'}
                </Button>


            </Box>
        </FormProvider >
    );
};

export default GeneralProductMetadata;
