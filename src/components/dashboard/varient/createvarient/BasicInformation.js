import React from 'react';
import {
    Grid,
    Box,
    Button
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import TextFieldComponent from '../../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../../subcompotents/AutocompleteFieldComponent';
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
import { fetchProducts } from '../../../../redux/masterproduct/tableslice/productsSlice';
import { submitVariantProduct } from '../../../../redux/varient/submitslice/variantProductSubmitSlice';

 
const BasicInformation = ({ setTabIndex, tabIndex }) => {
    const dispatch = useDispatch();

    const { partners } = useSelector((state) => state.productMetadata);
    const { products } = useSelector((state) => state.products);

    const productType = [
    { id: 'SECURED', name: 'Secured' },
    { id: 'UNSECURED', name: 'Unsecured' },
    { id: 'NA', name: 'Na' },
];

    const BasicInfoSchema = Yup.object().shape({
        linkedProductId: Yup.object().required('Linked Product Master ID is required'),
        productType: Yup.object().required('Product Type is required'),
        variantName: Yup.string().required('Variant Name is required'),
        variantCode: Yup.string().required('Variant Code is required'),
        variantType: Yup.string().required('Variant Type is required'),
        partner: Yup.object().nullable(), // Optional
        remarks: Yup.string().optional(),
    });
    const defaultValues = {
        linkedProductId: null,
        productType: '',
        variantName: '',
        variantCode: '',
        variantType: '',
        partner: null,
        remarks: '',
    };

    useEffect(() => {
        dispatch(fetchProductMetadata());
        dispatch(fetchProducts());
    }, [dispatch]);

    

    const methods = useForm({
        resolver: yupResolver(BasicInfoSchema),
        defaultValues,
    });

    const onSubmit = (data) => {
        dispatch(submitVariantProduct(data, () => {
            setTabIndex(prev => prev + 1);
        }));
    };

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
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="productType">Product Type</Label>
                           <RHFAutocomplete name="productType" options={productType} getOptionLabel={(option) => option.name} />
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
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Label htmlFor="remarks">Remarks</Label>
                            <RHFTextField name="remarks" id="remarks" multiline rows={4} />
                        </Grid>
                    </Grid>

                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                    <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / 4</Box>
                    <Button sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} variant="outlined" onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))} disabled={tabIndex === 0}>Back</Button>
                    <Button variant="contained" sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} type="submit">Next</Button>
                </Box>
            </FormProvider>
        </>
    )
}

export default BasicInformation
