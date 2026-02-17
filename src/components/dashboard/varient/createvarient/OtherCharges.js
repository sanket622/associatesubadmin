import React, { useEffect } from 'react';
import {
    Grid,
    Box,
    Button,
    Typography,
    Checkbox,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider from '../../../subcompotents/FormProvider';
import RHFTextField from '../../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import Label from '../../../subcompotents/Label';
import { seteditVarientOtherChargesData, submitVariantOtherCharges } from '../../../../redux/varient/submitslice/variantProductOtherChargesSubmitSlice';
import { useDispatch, useSelector } from 'react-redux';
// import { setEditVarientParameterData } from '../../../../redux/varient/submitslice/variantProductParameterSubmitSlice';
import { updateVariantProductDraft } from '../../../../redux/varient/variantdraftupdateslice/variantdraftupdateslice';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitEditVariantSubmit } from '../../../../redux/varient/editvarient/EditVarientSlice';
import { useSnackbar } from 'notistack';
import { primaryBtnSx } from '../../../subcompotents/UtilityService';

const OtherCharges = ({ setTabIndex, tabIndex, totalTabs, status }) => {
    const location = useLocation()
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { productDetails } = useSelector((state) => state.products);
    const mode = location?.state?.mode
    const dispatch = useDispatch();
    const editVarientBasicData = useSelector((state) => state.variantProductSubmit.editVarientBasicData);
    const variantDetail = useSelector((state) => state.variantSingle.variantDetail);
    const editVarientParameterData = useSelector((state) => state.variantProductParameterSubmit.editVarientParameterData);
    const editVarientOtherChargesData = useSelector((state) => state.variantProductOtherChargesSubmit.editVarientOtherChargesData);
    const requiredNumber = () =>
        Yup.number().typeError('Must be a number').required('Required');

    const OtherChargesSchema = Yup.object().shape({
        chequeBounceCharges: requiredNumber(),
        statementCharges: requiredNumber(),
        ecsCharges: requiredNumber(),
        documentCharge: requiredNumber(),
        stampDutyCharges: requiredNumber(),
        nocIssuanceCharges: requiredNumber(),
        legalCharges: requiredNumber(),
    });
    console.log(productDetails);


    const defaultValues = (mode === "EDIT" && variantDetail) ? {
        chequeBounceCharges: editVarientOtherChargesData?.chequeBounceCharges ?? variantDetail?.VariantProductOtherCharges?.bounceCharge ?? '',
        statementCharges: editVarientOtherChargesData?.statementCharges ?? variantDetail?.VariantProductOtherCharges?.furnishingCharge ?? '',
        ecsCharges: editVarientOtherChargesData?.ecsCharges ?? variantDetail?.VariantProductOtherCharges?.revocation ?? '',
        documentCharge: editVarientOtherChargesData?.documentCharge ?? variantDetail?.VariantProductOtherCharges?.documentCharge ?? '',
        stampDutyCharges: editVarientOtherChargesData?.stampDutyCharges ?? variantDetail?.VariantProductOtherCharges?.stampDutyCharge ?? '',
        nocIssuanceCharges: editVarientOtherChargesData?.nocIssuanceCharges ?? variantDetail?.VariantProductOtherCharges?.nocCharge ?? '',
        legalCharges: editVarientOtherChargesData?.legalCharges ?? variantDetail?.VariantProductOtherCharges?.incidentalCharge ?? '',
    } : {
        chequeBounceCharges: productDetails?.masterProductOtherCharges?.bounceCharge ?? '',
        statementCharges: productDetails?.masterProductOtherCharges?.furnishingCharge ?? '',
        ecsCharges: productDetails?.masterProductOtherCharges?.revocation ?? '',
        documentCharge: productDetails?.masterProductOtherCharges?.documentCharge ?? '',
        stampDutyCharges: productDetails?.masterProductOtherCharges?.stampDutyCharge ?? '',
        nocIssuanceCharges: productDetails?.masterProductOtherCharges?.nocCharge ?? '',
        legalCharges: productDetails?.masterProductOtherCharges?.incidentalCharge ?? '',
    };

    const methods = useForm({
        resolver: yupResolver(OtherChargesSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = methods;

    useEffect(() => {
        if (variantDetail || editVarientOtherChargesData) {
            reset(defaultValues)
        }
    }, [variantDetail, editVarientOtherChargesData])

    const onSubmit = (data) => {
        const payload = {
            variantProductId: localStorage.getItem('createdVariantId'),
            reason: "Updated fees and charges",
            productType: editVarientBasicData?.productType?.id || '',
            variantName: editVarientBasicData?.variantName || '',
            variantType: editVarientBasicData?.variantType || '',
            partnerId: editVarientBasicData?.partner?.id || '',
            remark: editVarientBasicData?.remarks || '',
            rejectionReason: editVarientBasicData?.rejectionReason || '',

            parameterUpdate: {
                minLoanAmount: Number(editVarientParameterData?.minimumLoanAmount || 0),
                maxLoanAmount: Number(editVarientParameterData?.maximumLoanAmount || 0),
                minTenure: Number(editVarientParameterData?.minTenure || 0),
                maxTenure: Number(editVarientParameterData?.maxTenure|| 0),
                interestRateMin: Number(editVarientParameterData?.interestRateMin || 0),
                interestRateMax: Number(editVarientParameterData?.interestRateMax || 0),
                processingFeeValue: Number(editVarientParameterData?.processingFeeValue || 0),
                processingFeeType: editVarientParameterData?.processingFeeType?.id || '',
                latePaymentFeeType: editVarientParameterData?.latePaymentFeeType?.id || '',
                latePaymentFeeValue: Number(editVarientParameterData?.latePaymentFeeValue || 0),
                penalInterestApplicable: editVarientParameterData?.penalInterestRateApplicable === 'yes',
                prepaymentFeeValue: Number(editVarientParameterData?.prepaymentFeeValue || 0),
                penalInterestRate: Number(editVarientParameterData?.penalInterestRate || 0),
                minAge: Number(editVarientParameterData?.minimumAge || 0),
                maxAge: Number(editVarientParameterData?.maximumAge || 0),
                interestRateType: editVarientParameterData?.interestRateType?.id || '',
                prepaymentFeeType: editVarientParameterData?.prepaymentFeeType?.id || '',
                emiFrequency: editVarientParameterData?.emiFrequency?.id || '',
            },

            otherChargesUpdate: {
                bounceCharge: Number(data?.chequeBounceCharges || 0),
                furnishingCharge: Number(data?.statementCharges || 0),
                revocation: Number(data?.ecsCharges || 0),
                documentCharge: Number(data?.documentCharge || 0),
                stampDutyCharge: Number(data?.stampDutyCharges || 0),
                nocCharge: Number(data?.nocIssuanceCharges || 0),
                incidentalCharge: Number(data?.legalCharges || 0),
            },
        };

        if (mode === "EDIT" && variantDetail.status === "Draft") {
            const variantId = localStorage.getItem('createdVariantId');
            const masterProductId = variantDetail?.masterProductId || editVarientBasicData?.productType?.id;
            dispatch(
                updateVariantProductDraft({
                    endpoint: 'updateVariantProductOtherChargesDraft',
                    payload: {
                        variantProductId: variantId,
                        otherCharges: {
                            bounceCharge: Number(data?.chequeBounceCharges || 0),
                            furnishingCharge: Number(data?.statementCharges || 0),
                            revocation: Number(data?.ecsCharges || 0),
                            documentCharge: Number(data?.documentCharge || 0),
                            stampDutyCharge: Number(data?.stampDutyCharges || 0),
                            nocCharge: Number(data?.nocIssuanceCharges || 0),
                            incidentalCharge: Number(data?.legalCharges || 0),
                        },
                    },
                })
            )
                .unwrap()
                .then((res) => {
                    enqueueSnackbar(
                        res?.message || 'Draft saved successfully',
                        { variant: 'success' }
                    );
                    navigate(`/varient-details/${masterProductId}`);
                })
                .catch((err) => {
                    enqueueSnackbar(
                        err?.message || 'Failed to save draft',
                        { variant: 'error' }
                    );
                });
        }
        else if (mode === "EDIT") {
            const masterProductId = variantDetail?.masterProductId || editVarientBasicData?.productType?.id;
            dispatch(submitEditVariantSubmit(payload, () => {
                navigate(`/varient-details/${masterProductId}`);
            }));
        } else {
            const masterProductId = productDetails?.id;
            dispatch(submitVariantOtherCharges(data, () => {
                navigate(`/varient-details/${masterProductId}`);
            }));
        }
    };



    const onError = (err) => {
        console.log('Validation Errors:', err);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="chequeBounceCharges">Cheque Bounce Charges</Label>
                        <RHFTextField name="chequeBounceCharges" id="chequeBounceCharges" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="statementCharges">Statement Charges - 2nd Time</Label>
                        <RHFTextField name="statementCharges" id="statementCharges" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="ecsCharges">Revocation of ECS/ACH Charges</Label>
                        <RHFTextField name="ecsCharges" id="ecsCharges" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="documentCharge">Document Charges</Label>
                        <RHFTextField name="documentCharge" id="documentCharge" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="stampDutyCharges">Stamp Duty Charges</Label>
                        <RHFTextField name="stampDutyCharges" id="stampDutyCharges" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="nocIssuanceCharges">NOC Issuance Charges</Label>
                        <RHFTextField name="nocIssuanceCharges" id="nocIssuanceCharges" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Label htmlFor="legalCharges">Legal / Repossession Charges</Label>
                        <RHFTextField name="legalCharges" id="legalCharges" />
                    </Grid>
                </Grid>

                {/* Additional Charges */}
                {/* <Box mt={4}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Additional Charges
                    </Typography>
                  
                    <Box
                        p={3}
                        mb={2}
                        border="1px solid #ccc"
                        borderRadius="16px"
                        display="flex"
                        flexDirection="column"
                    >
                        
                        <Box display="flex" justifyContent="flex-end">
                            <Checkbox
                                sx={{
                                    color: '#0000FF',
                                    '&.Mui-checked': {
                                        color: '#0000FF',
                                    },
                                }}
                            />
                        </Box>

                       
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Label htmlFor="subscriptionFee">Subscription Period & Fee</Label>
                                <RHFTextField name="subscriptionFee" id="subscriptionFee" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Label htmlFor="subscriptionGst">Subscription GST</Label>
                                <RHFTextField name="subscriptionGst" id="subscriptionGst" />
                            </Grid>
                        </Grid>
                    </Box>

                   
                    <Box
                        p={3}
                        border="1px solid #ccc"
                        borderRadius="16px"
                        display="flex"
                        flexDirection="column"
                    >
                       
                        <Box display="flex" justifyContent="flex-end">
                            <Checkbox
                                sx={{
                                    color: '#0000FF',
                                    '&.Mui-checked': {
                                        color: '#0000FF',
                                    },
                                }}
                            />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <Label htmlFor="perTransactionFee">Per Transaction Fee</Label>
                                <RHFAutocomplete
                                    name="perTransactionFee"
                                    options={[]}
                                    getOptionLabel={(option) => option.name || ''}
                                    id="perTransactionFee"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Label htmlFor="perTransactionAmount">Per Transaction Amount</Label>
                                <RHFTextField name="perTransactionAmount" id="perTransactionAmount" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Label htmlFor="gstOnTransactionFee">GST on Per Transaction Fee</Label>
                                <RHFTextField name="gstOnTransactionFee" id="gstOnTransactionFee" />
                            </Grid>
                        </Grid>
                    </Box>

                </Box> */}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / {totalTabs}</Box>

                {
                    (mode === "EDIT") && (

                        <Button sx={primaryBtnSx} variant="outlined" onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))} disabled={tabIndex === 0}>Back</Button>
                    )
                }
                <Button variant="contained" sx={primaryBtnSx} type="submit">Save</Button>
            </Box>
        </FormProvider>
    )
}

export default OtherCharges
