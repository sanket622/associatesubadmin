import React, { useState } from 'react';
import {
    Grid,
    Box,
    Button
} from '@mui/material';
import Label from '../../../subcompotents/Label';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../../subcompotents/RHFTextField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider from '../../../subcompotents/FormProvider';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchProductMetadata } from '../../../../redux/masterproduct/productmetadata/productMetadataSlice';
import { fetchProducts, fetchProductDetails } from '../../../../redux/masterproduct/tableslice/productsSlice';
import { setEditVarientBasicData, submitVariantProduct } from '../../../../redux/varient/submitslice/variantProductSubmitSlice';
import { fetchGeographies } from
    '../../../../redux/varient/geographySlice';
import { updateVariantProductDraft } from '../../../../redux/varient/variantdraftupdateslice/variantdraftupdateslice';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { primaryBtnSx } from '../../../subcompotents/UtilityService';


const BasicInformation = ({ setTabIndex, tabIndex, totalTabs, variant }) => {
    const location = useLocation()
    const { enqueueSnackbar } = useSnackbar();
    const mode = location?.state?.mode
    const productIdFromState = location?.state?.productId
    const dispatch = useDispatch();
    const { partners } = useSelector((state) => state.productMetadata);
    const { products, productDetails } = useSelector((state) => state.products);
    const { geographies } = useSelector((state) => state.geography);
    const variantDetail = useSelector((state) => state.variantSingle.variantDetail);
    const editVarientBasicData = useSelector((state) => state.variantProductSubmit.editVarientBasicData);

    const productType = [
        { id: 'SECURED', name: 'Secured' },
        { id: 'UNSECURED', name: 'Unsecured' },
        { id: 'NA', name: 'Na' },
    ];





    const BasicInfoSchema = Yup.object().shape({
        linkedProductId: Yup.object().required('Linked Product Master ID is required'),
        productType: Yup.object().required('Product Type is required'),
        variantName: Yup.string().required('Variant Name is required'),
        // variantCode: Yup.string().required('Variant Code is required'),
        variantType: Yup.string().required('Variant Type is required'),
        partner: Yup.object().nullable(),
        geography: Yup.array()
            .of(Yup.object())
            .min(1, 'At least one Geography is required')
            .required(),
        remarks: Yup.string().optional(),
    });

    const defaultValues = (mode === "EDIT" && variantDetail) ? {
        linkedProductId:
            editVarientBasicData?.linkedProductId ||
            products?.find(p => p.id === variantDetail?.masterProductId) ||
            null,

        productType:
            editVarientBasicData?.productType ||
            productType?.find(p => p.id === variantDetail?.productType) ||
            null,

        variantName:
            editVarientBasicData?.variantName ||
            variantDetail?.variantName || '',

        variantCode:
            editVarientBasicData?.variantCode ||
            variantDetail?.variantCode || '',

        variantType:
            editVarientBasicData?.variantType ||
            variantDetail?.variantType || '',

        partner:
            editVarientBasicData?.partner ||
            partners?.find(p => p.id === variantDetail?.partnerId) ||
            null,
        geography:
            editVarientBasicData?.geography ||
            variantDetail?.VariantProductGeography?.map(vpg => vpg.geography) ||
            [],

        remarks:
            editVarientBasicData?.remarks ||
            variantDetail?.remark || '',

    } : {
        linkedProductId: productDetails,
        productType: productType.find(
            p => p.name === productDetails?.loanType?.name
        ) || null,
        variantName: '',
        variantCode: '',
        variantType: '',
        partner:
            partners?.find(
                p => p.id === productDetails?.productPartner?.id
            ) || null,
        geography: [],
        remarks: '',
    };
    useEffect(() => {
        if (productIdFromState) {
            dispatch(fetchProductDetails(productIdFromState));
        }
    }, [dispatch, productIdFromState]);

    useEffect(() => {
        dispatch(fetchProductMetadata());
        dispatch(fetchProducts());
        dispatch(fetchGeographies());
    }, [dispatch]);

    const methods = useForm({
        resolver: yupResolver(BasicInfoSchema),
        defaultValues,
    });

    useEffect(() => {
        if (variantDetail || editVarientBasicData || productIdFromState) {
            reset(defaultValues)
        }
    }, [variantDetail, editVarientBasicData, products, productIdFromState, geographies, partners])

    // console.log(mode, status);

    const onSubmit = (data) => {

        const payload = {
            ...data,
            geographyIds: data.geography.map(g => g.id),
        };
        delete payload.geography;

        if (mode === "EDIT" && variantDetail.status === "Draft") {
            dispatch(
                updateVariantProductDraft({
                    endpoint: 'updateVariantProductDraft',
                    payload: {
                        variantProductId: localStorage.getItem('createdVariantId'),
                        variantName: data.variantName,
                        remark: data.remarks,
                        partnerId: data.partner?.id || '',
                        geographyIds: data.geography.map(g => g.id),
                    },
                })
            )
                .unwrap()
                .then((res) => {
                    enqueueSnackbar(
                        res?.message || 'Draft saved successfully',
                        { variant: 'success' }
                    );
                    setTabIndex(prev => Math.min(prev + 1, 9));
                })
                .catch((err) => {
                    enqueueSnackbar(
                        err?.message || 'Failed to save draft',
                        { variant: 'error' }
                    );
                });
        }
        else if (mode === "EDIT") {
            dispatch(setEditVarientBasicData(payload))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(submitVariantProduct(payload, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }

    const {
        control,
        reset,
        handleSubmit,
        watch,
        formState: { errors }
    } = methods

    const onError = (e) => console.log(e)

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Label htmlFor="linkedProductId">Linked Product Master ID</Label>
                            <RHFAutocomplete
                                name="linkedProductId"
                                options={products || []}
                                getOptionLabel={(option) => option?.productName || ''}
                                id="linkedProductId"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="productType">Product Type</Label>
                            <RHFAutocomplete name="productType" options={productType} getOptionLabel={(option) => option.name} disabled />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="variantName">Variant Name</Label>
                            <RHFTextField name="variantName" id="variantName" />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="variantCode">Variant Code (System ID)</Label>
                            <RHFTextField name="variantCode" id="variantCode" />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="variantType">Variant Type</Label>
                            <RHFTextField name="variantType" id="variantType" />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="partner">Partner (if specific)</Label>
                            <RHFAutocomplete
                                name="partner"
                                options={partners || []}
                                getOptionLabel={(option) => option?.name || ''}
                                id="partner"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="geography">Geography</Label>
                            <RHFAutocomplete
                                name="geography"
                                options={geographies || []}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                multiple
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Label htmlFor="remarks">Remarks</Label>
                            <RHFTextField name="remarks" id="remarks" multiline rows={4} />
                        </Grid>
                    </Grid>

                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                    <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / {totalTabs}</Box>
                    {
                        (mode === "EDIT") && (

                            <Button sx={primaryBtnSx} variant="outlined" onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))} disabled={tabIndex === 0}>Back</Button>
                        )
                    }
                    <Button variant="contained" sx={primaryBtnSx} type="submit">Next</Button>
                </Box>
            </FormProvider>
        </>
    )
}

export default BasicInformation
