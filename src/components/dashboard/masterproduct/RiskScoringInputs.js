import React, { useEffect } from 'react';
import {
    Grid,
    FormControlLabel,
    Box,
    FormControl,
    RadioGroup,
    Radio,
    Button,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import TextFieldComponent from '../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../subcompotents/AutocompleteFieldComponent';
import Label from '../../subcompotents/Label';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScores } from '../../../redux/masterproduct/riskscoring/riskSlice';
import RHFAutocomplete from '../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../subcompotents/RHFTextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormProvider from '../../subcompotents/FormProvider';
import { setEditRiskScoringData, submitRiskScoringData } from '../../../redux/masterproduct/riskscoring/riskScoringSubmitSlice';
import { useLocation } from 'react-router';

const RiskScoringInputs = ({ tabIndex, setTabIndex }) => {
    const location = useLocation()
    const mode = location?.state?.mode
    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.products.productDetails);
    const editRiskScoringData = useSelector((state) => state.riskSubmit.editRiskScoringData );
    console.log(editRiskScoringData);
    

    const riskScoringSchema = yup.object().shape({
        internalScoreVariables: yup
            .object()
            .required('Internal Score is required'),
        externalScoreInputs: yup
            .object()
            .required('External Score is required'),
        weightsForVariables: yup
            .string()
            .required('Weights are required'),
        riskCategoryMapping: yup
            .number()
            .typeError('Must be a number')
            .required('Risk Category Mapping is required'),
        maxDtiRatioAllowed: yup
            .number()
            .typeError('Must be a number')
            .positive('Must be positive')
            .required('Max DTI Ratio is required'),
        maxLtvRatioIfSecured: yup
            .number()
            .typeError('Must be a number')
            .positive('Must be positive')
            .required('Max LTV Ratio is required'),
        riskBasedPricingStrategy: yup
            .string()
            .required('Pricing Strategy is required'),
        coBorrowerRequiredForLowScore: yup
            .string()
            .oneOf(['yes', 'no'], 'Invalid selection')
            .required('This field is required'),
    });

    const defaultValues = (productDetails && mode === "EDIT") ? {
        internalScoreVariables:
            editRiskScoringData?.internalScoreVariables ||
                productDetails?.riskScoring?.internalScoreVars?.length > 0
                ? {
                    id: productDetails.riskScoring.internalScoreVars[0].scoreId,
                }
                : null,

        externalScoreInputs:
            editRiskScoringData?.externalScoreInputs ||
                productDetails?.riskScoring?.externalScoreInputs?.length > 0
                ? {
                    id: productDetails.riskScoring.externalScoreInputs[0].externalId,
                }
                : null,

        weightsForVariables:
            editRiskScoringData?.weightsForVariables || '',

        riskCategoryMapping:
            editRiskScoringData?.riskCategoryMapping ??
            productDetails?.riskScoring?.riskCategoryMapping ?? '',

        maxDtiRatioAllowed:
            editRiskScoringData?.maxDtiRatioAllowed ??
            productDetails?.riskScoring?.maxDTI ?? '',

        maxLtvRatioIfSecured:
            editRiskScoringData?.maxLtvRatioIfSecured ??
            productDetails?.riskScoring?.maxLTV ?? '',

        riskBasedPricingStrategy:
            editRiskScoringData?.riskBasedPricingStrategy || '',

        coBorrowerRequiredForLowScore:
            editRiskScoringData?.coBorrowerRequiredForLowScore ??
            (productDetails?.riskScoring?.coBorrowerRequired === true
                ? 'yes'
                : productDetails?.riskScoring?.coBorrowerRequired === false
                    ? 'no'
                    : ''),
    } : {

    }

    const methods = useForm({
        resolver: yupResolver(riskScoringSchema),
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
        if (productDetails || editRiskScoringData) {
            reset(defaultValues)
        }
    }, [productDetails, editRiskScoringData])


    const onSubmit = (data) => {
        if (mode === "EDIT") {
            dispatch(setEditRiskScoringData(data))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(submitRiskScoringData(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }
    const onError = (e) => console.log(e)

    const { internalScores, externalScores, loading } = useSelector((state) => state.risk);

    useEffect(() => {
        dispatch(fetchScores());
    }, [dispatch]);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Label> Internal Score Variables</Label>
                        <RHFAutocomplete
                            name="internalScoreVariables"
                            options={internalScores}
                            getOptionLabel={(option) => option.name}
                            loading={loading}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label>External Score Inputs</Label>
                        <RHFAutocomplete
                            name="externalScoreInputs"
                            options={externalScores}
                            getOptionLabel={(option) => option.name}
                            loading={loading}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label>Weights for Variables</Label>
                        <RHFTextField
                            name="weightsForVariables"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label>Risk Category Mapping</Label>
                        <RHFTextField
                            type="number"
                            name="riskCategoryMapping"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label>Max DTI Ratio Allowed</Label>
                        <RHFTextField
                            name="maxDtiRatioAllowed"
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label>Max LTV Ratio (if secured)</Label>
                        <RHFTextField
                            name="maxLtvRatioIfSecured"
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Label> Risk-Based Pricing Strategy</Label>
                        <RHFTextField
                            name="riskBasedPricingStrategy"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl component="fieldset">
                            <Label htmlFor="coBorrowerRequiredForLowScore">Co-borrower Required for Low Score?</Label>
                            <Controller
                                name="coBorrowerRequiredForLowScore"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        row
                                        {...field}
                                        id="coBorrowerRequiredForLowScore"
                                    >
                                        <FormControlLabel
                                            value="yes"
                                            control={<Radio />}
                                            label="Yes"
                                        />
                                        <FormControlLabel
                                            value="no"
                                            control={<Radio />}
                                            label="No"
                                        />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>{tabIndex + 1} / 10</Box>
                <Button sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} variant="outlined" onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))} disabled={tabIndex === 0}>Back</Button>
                <Button variant="contained" sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} type="submit">Next</Button>
            </Box>
        </FormProvider>

    );
};

export default RiskScoringInputs;
