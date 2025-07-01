import React from 'react';
import { Controller, useForm, useFormContext, useWatch } from 'react-hook-form';
import TextFieldComponent from '../../../subcompotents/TextFieldComponent';
import AutocompleteFieldComponent from '../../../subcompotents/AutocompleteFieldComponent';
import {
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Box,
    Button,
} from '@mui/material';
import Label from '../../../subcompotents/Label';
import * as Yup from 'yup';
import FormProvider from '../../../subcompotents/FormProvider';
import RHFTextField from '../../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import { submitTimelyRepayment } from '../../../../redux/masterproduct/timelyrepayment/timelyRepaymentSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { submitEditMasterProductSubmit } from '../../../../redux/masterproduct/editmasterproduct/EditMasterProduct';

const dummyOptions = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
];

const TimelyRepaymentIncentives = ({ tabIndex, setTabIndex, }) => {
    const location = useLocation()
    const mode = location?.state?.mode

    const productDetails = useSelector((state) => state.products.productDetails);

    const editGeneralProductMetaData = useSelector((state) => state.createProduct.editGeneralProductMetaData);
    const editProductparameter = useSelector((state) => state.financialTerms?.editProductparameter);
    const editBehavioralData = useSelector((state) => state.behavioralData.editBehavioralData);
    const editCollateralGuranteeData = useSelector((state) => state.collateralsubmit.editCollateralGuranteeData);
    const editCreditBureauData = useSelector((state) => state.creditBureauConfig.editCreditBureauData);
    const editEligibilityData = useSelector((state) => state.employmentTypes.editEligibilityData);
    const editFinancialData = useSelector((state) => state.financialStatement.editFinancialData);
    const editRiskScoringData = useSelector((state) => state.riskSubmit.editRiskScoringData);

    const timelyRepaymentSchema = Yup.object().shape({
        penalInterestApplicable: Yup.string().oneOf(['yes', 'no']).required(),

        incentiveType: Yup.object().nullable().when('penalInterestApplicable', {
            is: 'yes',
            then: (schema) => schema.required('Incentive Type is required'),
            otherwise: (schema) => schema.nullable(),
        }),

        incentiveValue: Yup.number()
            .typeError('Must be a number')
            .when('penalInterestApplicable', {
                is: 'yes',
                then: (schema) => schema.required('Value required'),
            }),

        payoutMode: Yup.object().nullable().when('penalInterestApplicable', {
            is: 'yes',
            then: (schema) => schema.required('Payout Mode required'),
            otherwise: (schema) => schema.nullable(),
        }),

        payoutTimeline: Yup.string().when('penalInterestApplicable', {
            is: 'yes',
            then: (schema) => schema.required('Timeline required'),
        }),

        incentiveReversalConditions: Yup.string().when('penalInterestApplicable', {
            is: 'yes',
            then: (schema) => schema.required('Reversal Conditions required'),
        }),
    });

    const timelyRepaymentDefaultValues = {
        penalInterestApplicable: 'no',
        incentiveType: null,
        incentiveValue: 0,
        eligibilityCriteria: null,
        payoutMode: null,
        payoutTimeline: '',
        incentiveReversalConditions: '',
    };

    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.timelyRepayment || {});

    const methods = useForm({
        resolver: yupResolver(timelyRepaymentSchema),
        defaultValues: timelyRepaymentDefaultValues,
    });

    const { control, watch, handleSubmit } = methods;
    const penalInterestApplicable = watch('penalInterestApplicable');
    console.log(editCollateralGuranteeData?.collateralOwnershipDocs);



    const onSubmit = (data,) => {
        if (mode === "EDIT") {
            const payload = {
                masterProductId: localStorage.getItem('createdProductId'),
                productName: editGeneralProductMetaData.productName,
                productDescription: editGeneralProductMetaData.productDescription,
                productCode: editGeneralProductMetaData.productCode,
                productCategoryId: editGeneralProductMetaData.subLoanType?.id,
                loanTypeId: editGeneralProductMetaData.loanType?.id,
                deliveryChannel: editGeneralProductMetaData.businessSegment?.[0]?.id || '',
                partnerId: editGeneralProductMetaData.productType?.id,
                status: editGeneralProductMetaData.status?.id,
                purposeIds: editGeneralProductMetaData.partnerCode?.map(item => item.id),
                segmentIds: editGeneralProductMetaData.segmentType?.map(item => item.id),

                financialTermsUpdate: {
                    minLoanAmount: Number(editProductparameter.minLoanAmount),
                    maxLoanAmount: Number(editProductparameter.maxLoanAmount),
                    minTenureMonths: Number(editProductparameter.minTenureMonths),
                    maxTenureMonths: Number(editProductparameter.maxTenureMonths),
                    interestRateType: editProductparameter.interestRateType?.id,
                    interestRateMin: Number(editProductparameter.interestMin),
                    interestRateMax: Number(editProductparameter.interestMax),
                    processingFeeType: editProductparameter.processingFeeType?.id,
                    processingFeeValue: Number(editProductparameter.processingFeeValue),
                    latePaymentFeeType: editProductparameter.latePaymentFeeType?.id,
                    latePaymentFeeValue: Number(editProductparameter.latePaymentFeeValue),
                    prepaymentAllowed: editProductparameter.prepaymentRulesAllowed === 'yes',
                    prepaymentFeeType: editProductparameter.prepaymentFeeType?.id,
                    prepaymentFeeValue: Number(editProductparameter.prepaymentFeeValue),
                    emiFrequency: editProductparameter.emiFrequency?.id,
                    disbursementModeIds: editProductparameter.disbursementMode ? [editProductparameter.disbursementMode.id] : [],
                    repaymentModeIds: editProductparameter.repaymentMode ? [editProductparameter.repaymentMode.id] : [],
                },

                eligibilityCriteriaUpdate: {
                    minAge: Number(editEligibilityData.minAge),
                    maxAge: Number(editEligibilityData.maxAge),
                    minMonthlyIncome: Number(editEligibilityData.minMonthlyIncome),
                    minBusinessVintage: Number(editEligibilityData.minBusinessVintage),
                    employmentIds: Array.isArray(editEligibilityData.employmentTypeAllowed)
                        ? editEligibilityData.employmentTypeAllowed.map(item => typeof item === 'string' ? item : item.id)
                        : editEligibilityData.employmentTypeAllowed
                            ? [typeof editEligibilityData.employmentTypeAllowed === 'string' ? editEligibilityData.employmentTypeAllowed : editEligibilityData.employmentTypeAllowed.id]
                            : [],
                    minBureauScore: Number(editEligibilityData.minBureauScore),
                    bureauType: typeof editEligibilityData.bureauType === 'string' ? editEligibilityData.bureauType : editEligibilityData.bureauType?.id || '',
                    blacklistFlags: editEligibilityData.blacklistFlags || [],
                    documentIds: editEligibilityData.documentList?.map(doc => doc.id) || [],
                    documentSubmissionModes: editEligibilityData.documentSubmissionMode
                        ? [typeof editEligibilityData.documentSubmissionMode === 'string' ? editEligibilityData.documentSubmissionMode : editEligibilityData.documentSubmissionMode.id]
                        : [],
                    documentVerificationModes: editEligibilityData.documentVerificationMode
                        ? [typeof editEligibilityData.documentVerificationMode === 'string' ? editEligibilityData.documentVerificationMode : editEligibilityData.documentVerificationMode.id]
                        : [],
                },

                creditBureauConfigUpdate: {
                    creditBureauSources: Array.isArray(editCreditBureauData.creditBureauSource)
                        ? editCreditBureauData.creditBureauSource.map(item => item.id || item)
                        : [editCreditBureauData.creditBureauSource?.id || editCreditBureauData.creditBureauSource],
                    minScoreRequired: Number(editCreditBureauData.minScoreRequired),
                    maxActiveLoans: Number(editCreditBureauData.maxActiveLoans),
                    maxCreditUtilization: Number(editCreditBureauData.maxCreditUtilRatio),
                    enquiriesLast6Months: Number(editCreditBureauData.enquiriesLast6Months),
                    loanDelinquencyAllowed: editCreditBureauData.loanDelinquencyAllowed?.id || editCreditBureauData.loanDelinquencyAllowed,
                    bureauDataFreshnessDays: Number(editCreditBureauData.bureauFreshnessDays),
                    customBureauFlags: Array.isArray(editCreditBureauData.customBureauFlags)
                        ? editCreditBureauData.customBureauFlags.map(flag => flag.id || flag)
                        : [editCreditBureauData.customBureauFlags?.id || editCreditBureauData.customBureauFlags],
                    scoreDecayTolerance: Number(editCreditBureauData.scoreDecayTolerance),
                },

                financialStatementsUpdate: {
                    minMonthlyCredit: Number(editFinancialData.minimumMonthlyCredit),
                    minAverageBalance: Number(editFinancialData.minimumAverageBalance),
                    salaryCreditPattern: editFinancialData.salaryPattern?.id,
                    bouncesLast3Months: Number(editFinancialData.bouncesOrCharges),
                    netIncomeRecognition: editFinancialData.incomeRecognitionMethod?.id,
                    cashDepositsCapPercent: Number(editFinancialData.cashDepositsCap),
                    statementSources: [editFinancialData.statementSource?.id],
                    accountTypes: [editFinancialData.accountType?.id],
                    pdfParsingRequired: editFinancialData.pdfParsingOrJsonRequired === 'yes',
                },

                behavioralDataUpdate: {
                    salaryRegularityThreshold: Number(editBehavioralData.salaryRegularityThreshold),
                    spendingConsistencyPercent: Number(editBehavioralData.spendingConsistencyPercent),
                    upiSpendToIncomeRatio: Number(editBehavioralData.upiSpendToIncomeRatio),
                    billPaymentHistory: editBehavioralData.billPaymentHistory?.id || editBehavioralData.billPaymentHistory,
                    digitalFootprintRequired: editBehavioralData.pdfParsingOrJsonRequired === 'yes',
                    locationConsistencyKm: Number(editBehavioralData.locationConsistencyKm),
                    repeatBorrowerBehavior: editBehavioralData.repeatBorrowerBehavior?.id,
                },

                riskScoringUpdate: {
                    scoreVariableIds: editRiskScoringData.internalScoreVariables ? [editRiskScoringData.internalScoreVariables.id] : [],
                    externalScoreIds: editRiskScoringData.externalScoreInputs ? [editRiskScoringData.externalScoreInputs.id] : [],
                    riskCategoryMapping: Number(editRiskScoringData.riskCategoryMapping),
                    maxDTI: Number(editRiskScoringData.maxDtiRatioAllowed),
                    maxLTV: Number(editRiskScoringData.maxLtvRatioIfSecured),
                    coBorrowerRequired: editRiskScoringData.coBorrowerRequiredForLowScore === 'yes',
                },

                collateralUpdate: {
                    collateralType: editCollateralGuranteeData.collateralType?.id || null,
                    collateralValue: Number(editCollateralGuranteeData.collateralValue),
                    collateralValuationDate: editCollateralGuranteeData.collateralValuationDate,
                    documentIds: editCollateralGuranteeData?.collateralOwnershipDocs
                        ? [editCollateralGuranteeData.collateralOwnershipDocs]
                        : [],
                    collateralOwnerName: editCollateralGuranteeData.collateralOwnerName,
                    ownershipVerified: editCollateralGuranteeData.ownershipVerified?.id || null,
                    guarantorRequired: editCollateralGuranteeData.guarantorRequired?.id === 'TRUE',
                    guarantorName: editCollateralGuranteeData.guarantorName,
                    guarantorRelationship: editCollateralGuranteeData.guarantorRelationship?.id || null,
                    guarantorPAN: editCollateralGuranteeData.guarantorPan,
                    guarantorCreditBureau: editCollateralGuranteeData.guarantorCreditBureau?.id || null,
                    guarantorCreditScore: Number(editCollateralGuranteeData.guarantorCreditScore),
                    guarantorMonthlyIncome: Number(editCollateralGuranteeData.guarantorMonthlyIncome),
                    guarantorIncomeProofTypes: editCollateralGuranteeData.guarantorIncomeProofType ? [editCollateralGuranteeData.guarantorIncomeProofType.id] : [],
                    guarantorVerificationStatus: editCollateralGuranteeData.guarantorVerificationStatus?.id || null,
                },

                "otherChargesUpdate": {
                    "chequeBounceCharge": 350,
                    "dublicateNocCharge": 150,
                    "furnishingCharge": 500,
                    "chequeSwapCharge": 200,
                    "revocation": 300,
                    "documentCopyCharge": 100,
                    "stampDutyCharge": 250,
                    "nocCharge": 120,
                    "incidentalCharge": 450
                },
                "repaymentUpdate": {
                    "penalInterestApplicable": true,
                    "incentiveType": "CASHBACK",
                    "incentiveValue": 500,
                    "payoutMode": "ONLINE",
                    "incentiveReversalConditions": "Late EMI"
                }
            };
            dispatch(submitEditMasterProductSubmit(payload))
        } else {
            dispatch(submitTimelyRepayment(data, () => {
            }));
        }
    }

    const onError = err => console.log('Validation errors', err);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Label>Penal Interest Rate Applicable?</Label>

                    <Controller
                        name="penalInterestApplicable"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup row {...field}>
                                <FormControlLabel
                                    value="yes"
                                    control={<Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    value="no"
                                    control={<Radio sx={{ color: '#0000FF', '&.Mui-checked': { color: '#0000FF' } }} />}
                                    label="No"
                                />
                            </RadioGroup>
                        )}
                    />

                </Grid>
                {penalInterestApplicable === 'yes' && (
                    <>
                        <Grid item xs={12} md={4}>
                            <Label htmlFor="incentiveType">Incentive Type</Label>
                            <RHFAutocomplete
                                name="incentiveType"
                                options={dummyOptions}
                                getOptionLabel={opt => opt.name}
                                placeholder="Select..."
                                helperText=""
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="incentiveValue">Incentive Value</Label>
                            <RHFTextField name="incentiveValue" />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="payoutMode">Payout Mode</Label>
                            <RHFAutocomplete
                                name="payoutMode"
                                options={dummyOptions}
                                getOptionLabel={opt => opt.name}
                                placeholder="Select..."
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label htmlFor="payoutTimeline">Payout Timeline</Label>
                            <RHFTextField name="payoutTimeline" />
                        </Grid>

                        <Grid item xs={12}>
                            <Label htmlFor="incentiveReversalConditions">Incentive Reversal Conditions</Label>
                            <RHFTextField
                                name="incentiveReversalConditions"
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 6, gap: 4 }}>
                <Box sx={{ border: '2px solid #6B6B6B', borderRadius: '12px', px: 2, py: 1, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: '#6B6B6B' }}>
                    {tabIndex + 1} / 10
                </Box>
                <Button
                    sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}
                    variant="outlined"
                    onClick={() => setTabIndex(prev => Math.max(prev - 1, 0))}
                    disabled={tabIndex === 0}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    sx={{ background: "#0000FF", color: "white", px: 6, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}
                    type="submit"
                >
                    Submit
                </Button>
            </Box>

        </FormProvider >
    );
};

export default TimelyRepaymentIncentives;
