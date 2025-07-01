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
import { createGeneralProduct, setEditGeneralProductMetaData } from '../../../../redux/masterproduct/productmetadata/createProductSlice';
import { useSnackbar } from 'notistack';
import FormProvider from '../../../subcompotents/FormProvider';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../../subcompotents/RHFTextField';
import { useLocation } from 'react-router';
import { replaceUnderscore } from '../../../subcompotents/UtilityService';


const GeneralProductMetadata = ({ handleTabChange, tabIndex, setTabIndex, handleNext }) => {
    const location = useLocation()
    const mode = location?.state?.mode
    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.products.productDetails);
    const editGeneralProductMetaData = useSelector((state) => state.createProduct.editGeneralProductMetaData);

    const generalProductValidationSchema = yup.object().shape({
        productName: yup.string().required('Product Name is required'),
        productDescription: yup.string().required('Product Description is required'),
        subLoanType: yup.object().required('Product Category is required'),
        loanType: yup.object().required('Loan Type is required'),
        businessSegment: yup.array().min(1, 'At least one Delivery Channel is required'),
        productType: yup.object().required('Partner/Program Tag is required'),
        status: yup.object().required('Status is required'),
        partnerCode: yup.array().min(1, 'At least one Purpose Category is required'),
        segmentType: yup.array().min(1, 'At least one Segment Type is required'),
        location: yup.array(),
    });

    const defaultValues = (productDetails && mode === "EDIT") ? {
        productCode: editGeneralProductMetaData?.productCode || productDetails?.productCode,
        productName: editGeneralProductMetaData?.productName || productDetails?.productName,
        productDescription: editGeneralProductMetaData?.productDescription || productDetails?.productDescription,
        subLoanType: editGeneralProductMetaData?.subLoanType || productDetails?.productCategory,
        loanType: editGeneralProductMetaData?.loanType || productDetails?.loanType,
        businessSegment: editGeneralProductMetaData?.businessSegment || [{ id: productDetails?.deliveryChannel, name: replaceUnderscore(productDetails?.deliveryChannel) },] || [],
        productType: editGeneralProductMetaData?.productType || productDetails?.productPartner,
        status: editGeneralProductMetaData?.status || { id: productDetails?.status, name: productDetails?.status },
        partnerCode: editGeneralProductMetaData?.partnerCode || productDetails?.MasterProductPurpose?.map(item => item?.productPurpose) || [],
        segmentType: editGeneralProductMetaData?.segmentType || productDetails?.MasterProductSegment?.map(item => item?.productSegment) || [],
        location: editGeneralProductMetaData?.location || []
    } : {
        partnerCode: [],
        segmentType: [],
        businessSegment: [],
        location: []
    }

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

    const values = watch()
    console.log("values", values);
    
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
        geographyStates,
    } = useSelector((state) => state.productMetadata);

    useEffect(() => {
        dispatch(fetchProductMetadata());
    }, [dispatch]);

    const deliveryChannelOptions = [
        { id: 'Mobile_App', name: 'Mobile App' },
        { id: 'Field_Agent', name: 'Field Agent' },
        { id: 'Call_Center', name: 'Call Center' },
        { id: 'Embedded_Api', name: 'Embedded API' },
        { id: 'Partner_Portal', name: 'Partner Portal' },
        { id: 'Whatsapp_Bot', name: 'WhatsApp Bot' },
    ];

    const productStatusOptions = [
        { id: 'Draft', name: 'Draft' },
        { id: 'Active', name: 'Active' },
        { id: 'Archived', name: 'Archived' },
    ];


    const onSubmit = (data) => {
        if (mode === "EDIT") {
            dispatch(setEditGeneralProductMetaData(data))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(createGeneralProduct(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }
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
                    <Label htmlFor="businessSegment">Delivery Channel</Label>
                    <RHFAutocomplete
                        name="businessSegment"
                        id="businessSegment"
                        multiple
                        options={deliveryChannelOptions}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="location">Geography</Label>
                    <RHFAutocomplete
                        name="location"
                        id="location"
                        multiple
                        options={geographyStates}
                        getOptionLabel={(option) => option?.stateName || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="productType">Partner/Program Tag</Label>
                    <RHFAutocomplete
                        name="productType"
                        id="productType"
                        options={partners}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Label htmlFor="status">Status</Label>
                    <RHFAutocomplete
                        name="status"
                        id="status"
                        options={productStatusOptions}
                        getOptionLabel={(option) => option?.name || ''}
                    />
                </Grid>

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
                    disabled={tabIndex === 0}
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

export default GeneralProductMetadata;
