import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Grid,
    Box,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import RHFTextField from '../../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import FormProvider from '../../../subcompotents/FormProvider';
import Label from '../../../subcompotents/Label';
import { useDispatch, useSelector } from 'react-redux';
import { setEditCollateralGuranteeData, submitCollateralData } from '../../../../redux/masterproduct/colateralandgurantee/collateralSubmitSlice';
import { useLocation } from 'react-router';
import { useEffect } from 'react';

export const collateralTypeOptions = [
    { id: 'GOLD', name: 'Gold' },
    { id: 'VEHICLE', name: 'Vehicle' },
    { id: 'PROPERTY', name: 'Property' },
    { id: 'OTHER', name: 'Other' },
];

export const ownershipVerificationOptions = [
    { id: 'YES', name: 'Yes' },
    { id: 'NO', name: 'No' },
    { id: 'PENDING', name: 'Pending' },
];

export const guarantorRelationshipOptions = [
    { id: 'PARENT', name: 'Parent' },
    { id: 'SPOUSE', name: 'Spouse' },
    { id: 'EMPLOYER', name: 'Employer' },
    { id: 'RELATIVE', name: 'Relative' },
    { id: 'BUSINESS_PARTNER', name: 'Business Partner' },
    { id: 'OTHER', name: 'Other' },
];

export const creditBureauOptions = [
    { id: 'CIBIL', name: 'CIBIL' },
    { id: 'EXPERIAN', name: 'Experian' },
    { id: 'CRIF', name: 'CRIF' },
    { id: 'EQUIFAX', name: 'Equifax' },
];

export const incomeProofTypeOptions = [
    { id: 'SALARY_SLIP', name: 'Salary Slip' },
    { id: 'BANK_STATEMENT', name: 'Bank Statement' },
    { id: 'ITR', name: 'ITR' },
    { id: 'PENSION_SLIP', name: 'Pension Slip' },
    { id: 'OTHERS', name: 'Others' },
];

export const guarantorVerificationStatusOptions = [
    { id: 'VERIFIED', name: 'Verified' },
    { id: 'REJECTED', name: 'Rejected' },
    { id: 'PENDING', name: 'Pending' },
];
export const guarantorRequired = [
    { id: 'TRUE', name: 'Yes' },
    { id: 'FALSE', name: 'No' },

];


const schema = yup.object().shape({
    collateralType: yup.object().nullable().required('Collateral Type is required'),
    collateralValue: yup.string().required('Collateral Value is required'),
    collateralValuationDate: yup.string().required('Collateral Valuation Date is required'),
    collateralOwnershipDocs: yup.string().required('Ownership Docs are required'),
    collateralOwnerName: yup.string().required('Owner Name is required'),
    ownershipVerified: yup.object().nullable().required('Ownership Verified is required'),
    guarantorRequired: yup.object().nullable().required('Guarantor requirement is required'),
    guarantorName: yup.string().required('Guarantor Name is required'),
    guarantorRelationship: yup.object().nullable().required('Relationship is required'),
    guarantorPan: yup.string().required('Guarantor PAN is required'),
    guarantorCreditScore: yup.string().required('Credit Score is required'),
    guarantorMonthlyIncome: yup.string().required('Monthly Income is required'),
    guarantorCreditBureau: yup.object().nullable().required('Credit Bureau is required'),
    guarantorIncomeProofType: yup.object().nullable().required('Income Proof Type is required'),
    guarantorVerificationStatus: yup.object().nullable().required('Verification Status is required')
});

const CollateralGuaranteeData = ({ setTabIndex, tabIndex, handleNext }) => {

    const location = useLocation()
    const mode = location?.state?.mode
    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.products.productDetails);
    const editCollateralGuranteeData = useSelector((state) => state.collateralsubmit.editCollateralGuranteeData);

    

    const defaultValues = (productDetails && mode === "EDIT") ? {
        // Collateral Type (must match object from collateralTypeOptions)
        collateralType:
            collateralTypeOptions.find(
                (opt) => opt.id === editCollateralGuranteeData?.collateralType ||
                    opt.id === productDetails?.Collateral?.collateralType
            ) || null,

        collateralValue:
            editCollateralGuranteeData?.collateralValue ??
            productDetails?.Collateral?.collateralValue ?? '',

        collateralValuationDate:
            editCollateralGuranteeData?.collateralValuationDate ??
            productDetails?.Collateral?.collateralValuationDate?.slice(0, 10) ?? '',

        // Collateral Ownership Docs - fallback to empty string if not in API
        collateralOwnershipDocs:
            editCollateralGuranteeData?.collateralOwnershipDocs ?? '',

        // Collateral Owner Name
        collateralOwnerName:
            editCollateralGuranteeData?.collateralOwnerName ??
            productDetails?.Collateral?.collateralOwnerName ?? '',

        // Ownership Verified? (from ownershipVerificationOptions)
        ownershipVerified:
            ownershipVerificationOptions.find(
                (opt) => opt.id === editCollateralGuranteeData?.ownershipVerified
            ) || null,

        // Guarantor Required? (boolean to 'TRUE'/'FALSE' mapping)
        guarantorRequired:
            guarantorRequired.find(
                (opt) =>
                    opt.id === editCollateralGuranteeData?.guarantorRequired?.toString().toUpperCase() ||
                    opt.id ===
                    (typeof productDetails?.Collateral?.guarantorRequired === 'boolean'
                        ? productDetails.Collateral.guarantorRequired
                            ? 'TRUE'
                            : 'FALSE'
                        : '')
            ) || null,

        guarantorName:
            editCollateralGuranteeData?.guarantorName ??
            productDetails?.Collateral?.guarantorName ?? '',

        // Relationship to Applicant
        guarantorRelationship:
            guarantorRelationshipOptions.find(
                (opt) =>
                    opt.id === editCollateralGuranteeData?.guarantorRelationship ||
                    opt.id === productDetails?.Collateral?.guarantorRelationship
            ) || null,

        guarantorPan:
            editCollateralGuranteeData?.guarantorPan ??
            productDetails?.Collateral?.guarantorPAN ?? '',

        guarantorCreditScore:
            editCollateralGuranteeData?.guarantorCreditScore ??
            productDetails?.Collateral?.guarantorCreditScore ?? '',

        guarantorMonthlyIncome:
            editCollateralGuranteeData?.guarantorMonthlyIncome ??
            productDetails?.Collateral?.guarantorMonthlyIncome ?? '',

        // Credit Bureau
        guarantorCreditBureau:
            creditBureauOptions.find(
                (opt) =>
                    opt.id === editCollateralGuranteeData?.guarantorCreditBureau ||
                    opt.id === productDetails?.Collateral?.guarantorCreditBureau
            ) || null,

        // Income Proof Type
        guarantorIncomeProofType:
            incomeProofTypeOptions.find(
                (opt) =>
                    opt.id === editCollateralGuranteeData?.guarantorIncomeProofType ||
                    opt.id === productDetails?.Collateral?.guarantorIncomeProofTypes?.[0]
            ) || null,

        // Verification Status
        guarantorVerificationStatus:
            guarantorVerificationStatusOptions.find(
                (opt) =>
                    opt.id === editCollateralGuranteeData?.guarantorVerificationStatus ||
                    opt.id === productDetails?.Collateral?.guarantorVerificationStatus
            ) || null,
    } : {}

    const methods = useForm({
        resolver: yupResolver(schema),
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
        if (productDetails || editCollateralGuranteeData) {
            reset(defaultValues)
        }
    }, [productDetails, editCollateralGuranteeData])


    const onSubmit = (data) => {
        if (mode === "EDIT") {
            dispatch(setEditCollateralGuranteeData(data))
            setTabIndex((prev) => Math.min(prev + 1, 9));
        } else {
            dispatch(submitCollateralData(data, () => {
                setTabIndex((prev) => Math.min(prev + 1, 9));
            }));
        }
    }

    const onError = (e) => console.log(e)

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="collateralType">Collateral Type</Label>
                    <RHFAutocomplete name="collateralType" options={collateralTypeOptions} getOptionLabel={(o) => o.name} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="collateralValue">Collateral Value (*)</Label>
                    <RHFTextField name="collateralValue" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="collateralValuationDate">Collateral Valuation Date</Label>
                    <RHFTextField name="collateralValuationDate" type="date" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="collateralOwnershipDocs">Collateral Ownership Docs</Label>
                    <RHFTextField name="collateralOwnershipDocs" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="collateralOwnerName">Collateral Owner Name</Label>
                    <RHFTextField name="collateralOwnerName" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="ownershipVerified">Ownership Verified?</Label>
                    <RHFAutocomplete name="ownershipVerified" options={ownershipVerificationOptions} getOptionLabel={(o) => o.name} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="guarantorRequired">Guarantor Required?</Label>
                    <RHFAutocomplete name="guarantorRequired" options={guarantorRequired} getOptionLabel={(o) => o.name} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="guarantorName">Guarantor Name</Label>
                    <RHFTextField name="guarantorName" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="guarantorRelationship">Relationship to Applicant</Label>
                    <RHFAutocomplete name="guarantorRelationship" options={guarantorRelationshipOptions} getOptionLabel={(o) => o.name} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="guarantorPan">Guarantor PAN</Label>
                    <RHFTextField name="guarantorPan" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="guarantorCreditScore">Credit Score</Label>
                    <RHFTextField name="guarantorCreditScore" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="guarantorMonthlyIncome">Monthly Income (*)</Label>
                    <RHFTextField name="guarantorMonthlyIncome" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="guarantorCreditBureau">Credit Bureau</Label>
                    <RHFAutocomplete name="guarantorCreditBureau" options={creditBureauOptions} getOptionLabel={(o) => o.name} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="guarantorIncomeProofType">Income Proof Type</Label>
                    <RHFAutocomplete name="guarantorIncomeProofType" options={incomeProofTypeOptions} getOptionLabel={(o) => o.name} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Label htmlFor="guarantorVerificationStatus">Verification Status</Label>
                    <RHFAutocomplete name="guarantorVerificationStatus" options={guarantorVerificationStatusOptions} getOptionLabel={(o) => o.name} />
                </Grid>
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
                    Next
                </Button>
            </Box>
        </FormProvider>
    );
};

export default CollateralGuaranteeData;
