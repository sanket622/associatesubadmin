
import { Grid, Box, Button } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Label from '../../../subcompotents/Label';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../../subcompotents/RHFTextField';
import FormProvider from '../../../subcompotents/FormProvider';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import {
    setCreditCriteria,
    resetMasterProductUpdate
} from '../../../../redux/masterproduct/editmasterproduct/masterProductUpdateSlice';

import { submitMasterProductUpdateRequest } from
    '../../../../redux/masterproduct/productmetadata/createProductSlice';
import { submitCreditCriteria } from '../../../../redux/masterproduct/creditCriteria.js/creditCriteriaSlice';
import { primaryBtnSx } from '../../../subcompotents/UtilityService';
import {

    updateMasterProductDraft
} from '../../../../redux/masterproduct/masterproductdraftslice/masterproductdraft';

const CreditCriteria = ({ setTabIndex, tabIndex, totalTabs, status, mode: modeProp, onEditSuccess }) => {
    const { enqueueSnackbar } = useSnackbar();
    const mode = modeProp ?? null;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [creditManagers, setCreditManagers] = useState([]);

    const productDetails = useSelector(
        (state) => state.products.productDetails
    );
    const { loading } = useSelector(
        state => state.updateMasterProductDraft
    );
    const masterProductUpdate = useSelector(
        (state) => state.masterProductUpdate
    );


    useEffect(() => {
        const fetchCreditManagers = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/associate/associateSubAdmin/getAssociateSubAdminsByRole?roleKey=CREDIT`
                );
                const json = await res.json();

                const managers = json?.data?.data?.map(item => ({
                    roleName: item.role?.roleName,
                }));
                setCreditManagers(managers);


                setCreditManagers(managers);
            } catch (error) {
                console.error('Failed to load credit managers', error);
            }
        };

        fetchCreditManagers();
    }, []);


    const getAvailableCreditManagers = (currentIndex) => {
        const rules = getValues('rules');
        const currentValue = rules[currentIndex]?.creditManager;

        const selectedValues = rules
            .map((r, i) => (i !== currentIndex ? r.creditManager : null))
            .filter(Boolean);

        return creditManagers
            .map(cm => cm.roleName)
            .filter(
                role =>
                    role === currentValue || !selectedValues.includes(role)
            );
    };


    const CreditCriteriaSchema = Yup.object().shape({
        rules: Yup.array().of(
            Yup.object().shape({
                creditManager: Yup.string().required('Required'),
                minCreditScore: Yup.number().required().min(300).max(900),
                maxCreditScore: Yup.number()
                    .required()
                    .min(Yup.ref('minCreditScore'), 'Max < Min')
                    .max(900),
            })
        ),
    });

    // const defaultValues = {
    //     creditManager: null,
    //     minCreditScore: '',
    //     maxCreditScore: '',
    // };

    // console.log("creditManagers", creditManagers);

    const buildDefaultRules = () => {
        if (mode !== 'EDIT') return null;

        const rules = productDetails?.ProductCreditAssignmentRule;
        if (!rules?.length) return null;

        return rules.map(r => ({
            creditManager: String(r.creditRole),
            minCreditScore: r.minScore,
            maxCreditScore: r.maxScore,
        }));
    };


    const methods = useForm({
        resolver: yupResolver(CreditCriteriaSchema),
        defaultValues: {
            rules: buildDefaultRules() || [
                {
                    creditManager: null,
                    minCreditScore: '',
                    maxCreditScore: '',
                },
            ],
        },
    });

    const { reset } = methods;
    useEffect(() => {
        if (
            mode === 'EDIT' &&
            productDetails?.ProductCreditAssignmentRule?.length &&
            creditManagers.length
        ) {
            const rules = buildDefaultRules();
            if (rules) {
                reset({ rules });
            }
        }
    }, [mode, productDetails, creditManagers, reset]);


    const {
        handleSubmit,
        control,
        trigger,
        getValues,
        formState: { errors },
    } = methods;
    const handleAddRow = async () => {
        const rules = getValues('rules');
        const lastIndex = rules.length - 1;

        const isValid = await trigger([
            `rules.${lastIndex}.creditManager`,
            `rules.${lastIndex}.minCreditScore`,
            `rules.${lastIndex}.maxCreditScore`,
        ]);

        if (!isValid) return;

        append({
            creditManager: '',
            minCreditScore: '',
            maxCreditScore: '',
        });
    };


    const { fields, append, remove } = useFieldArray({
        control,
        name: 'rules',
    });


    const onSubmit = (data) => {

        if (mode === "EDIT") {
            const payload = {
                masterProductId: productDetails?.id,
                creditAssignmentRules: data.rules.map(r => ({
                    creditRole: r.creditManager,
                    minScore: Number(r.minCreditScore),
                    maxScore: Number(r.maxCreditScore),
                })),
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
                    creditAssignmentRulesUpdate: data.rules.map(r => ({
                        creditRole: r.creditManager,
                        minScore: Number(r.minCreditScore),
                        maxScore: Number(r.maxCreditScore),
                    }))
                };
                dispatch(submitMasterProductUpdateRequest(updatePayload, () => {
                    enqueueSnackbar('Update request submitted successfully', { variant: 'success' });
                    if (onEditSuccess) onEditSuccess();
                    else navigate('/product-manager');
                }));
            } else {
                dispatch(
                    updateMasterProductDraft({
                        endpoint: 'updateProductCreditAssignmentRuleDraft',
                        payload,
                    })
                )
                    .unwrap()
                    .then((res) => {
                        enqueueSnackbar(
                            res?.message || 'Draft saved successfully',
                            { variant: 'success' }
                        );
                        if (onEditSuccess) onEditSuccess();
                        else navigate('/product-manager');
                    })
                    .catch((err) => {
                        enqueueSnackbar(
                            err?.message || 'Failed to save draft',
                            { variant: 'error' }
                        );
                    });
            }
        } else {
            const payload = {
                masterProductId: localStorage.getItem('createdProductId'),
                rules: data.rules.map(r => ({
                    creditRole: r.creditManager,
                    minScore: Number(r.minCreditScore),
                    maxScore: Number(r.maxCreditScore),
                })),
            };

            dispatch(submitCreditCriteria(payload))
                .then(() => navigate('/product-manager'))
                .catch(() => { });
        }

    };



    const onError = (e) => console.log(e);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box>

                {fields.map((item, index) => (
                    <Grid container spacing={2} key={item.id} sx={{ mb: 2 }}>

                        <Grid item xs={12} md={4}>
                            <Label>Credit Manager</Label>
                            <RHFAutocomplete
                                name={`rules.${index}.creditManager`}
                                options={getAvailableCreditManagers(index)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                            />



                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Label>Minimum Credit Score</Label>
                            <RHFTextField
                                name={`rules.${index}.minCreditScore`}
                                type="number"
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Label>Maximum Credit Score</Label>
                            <RHFTextField
                                name={`rules.${index}.maxCreditScore`}
                                type="number"
                            />
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            {fields.length > 1 && (
                                <Button
                                    color="error"
                                    onClick={() => remove(index)}
                                >
                                    Remove
                                </Button>
                            )}
                        </Grid>

                    </Grid>
                ))}

                <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={handleAddRow}
                >
                    + Add Row
                </Button>


            </Box>

            {/* FOOTER – unchanged */}
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{
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
                    color: '#6B6B6B'
                }}>
                    {tabIndex + 1}/{totalTabs}
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

                <Button sx={primaryBtnSx} variant="contained" type="submit">
                    Save
                </Button>
            </Box>
        </FormProvider>

    );
};

export default CreditCriteria;
