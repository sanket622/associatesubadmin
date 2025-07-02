import React, { useState } from 'react';
import {
    Box,
    Grid,
    Tab,
    Tabs,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    InputAdornment,
    Divider,
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import RHFTextField from '../../../subcompotents/RHFTextField';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import Label from '../../../subcompotents/Label';
import { submitEmployerData, verifyPanGst } from '../redux/employeronboarding/employerOnboardingSlice';
import FormProvider from '../../../subcompotents/FormProvider';

const OnboardingSchema = yup.object().shape({
    employerName: yup.string().required('Employer Name is required'),
    adminPhone: yup.string().required('Admin Phone No is required'),
    pan: yup.string().required('PAN is required'),
    legalType: yup.object().required('Legal Entity Type is required'),
    adminEmail: yup.string().email('Invalid email').required('Admin Email ID is required'),
    portal: yup.string().required('Portal is required'),
});

const legalTypeOptions = [
    { label: 'Pvt Ltd', value: 'Pvt_Ltd' },
    { label: 'LLP', value: 'LLP' },
    { label: 'Partnership', value: 'Partnership' },
    { label: 'Govt Org', value: 'Govt_Org' },
    { label: 'Sole Proprietor', value: 'Sole_Proprietor' },
];

export default function EmployerOnboardingTabs() {
    const [tabIndex, setTabIndex] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [formDataPreview, setFormDataPreview] = useState(null);
    const [filePreviews, setFilePreviews] = useState({});

    const dispatch = useDispatch();

    const methods = useForm({
        resolver: yupResolver(OnboardingSchema),
        defaultValues: {
            employerName: '',
            adminPhone: '',
            pan: '',
            cin: '',
            legalType: null,
            adminEmail: '',
            alternateContact: '',
            gstin: '',
            portal: '',
            signedMasterAgreement: null,
            boardResolution: null,
            additionalDoc: null,
            kycDocuments: null,
            onboardingSOP: null,
        },
    });

    const { handleSubmit, getValues, setValue } = methods;

    const handleVerify = (type) => {
        const formData = getValues();
        dispatch(verifyPanGst(formData, type));
    };

    const handleFirstTabSubmit = (data) => {
        console.log('Step 1 data submitted:', data);
        setFormDataPreview(data);
        setTabIndex(1);
    };

    const handleSecondTabSubmit = () => {
        setOpenDialog(true); // just open dialog
    };
    const handleFinalSubmit = () => {
        const allFormData = getValues(); 
        dispatch(submitEmployerData(allFormData, () => {
            setOpenDialog(false);
        }));
    };

    const handleFileChange = (e, name) => {
        const file = e.target.files[0];
        if (file) {
            setValue(name, file); 
            setFilePreviews(prev => ({ ...prev, [name]: file }));
        }
    };

    const renderUploadField = (label, fieldName) => (
        <Box mb={3}>
            <Label>{label}</Label>
            <Box display="flex" alignItems="center" mt={1}>
                {filePreviews[fieldName] && (
                    <Typography variant="body2" sx={{ mr: 2, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filePreviews[fieldName].name}</Typography>
                )}
                <Button variant="outlined" fullWidth component="label" sx={{ height: '40px', bgcolor: '#fff', color: '#0000FF' }}><UploadFile sx={{ mr: 1 }} />Upload<input hidden type="file" onChange={(e) => handleFileChange(e, fieldName)} /></Button>
            </Box>
        </Box>
    );

    const onSubmit = (data) => {
        dispatch(submitEmployerData(data, () => {
        }));
    }
    const onError = (e) => console.log(e)

    const { employerName, adminPhone, adminEmail } = getValues();

    const FieldRow = ({ label, value }) => (
        <Grid item xs={12} md={4}>
            <Typography variant="caption" fontWeight={600} color="textSecondary">
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
                {value || '—'}
            </Typography>
        </Grid>
    );

    return (
        <>
            <h1 className="text-[24px] font-semibold my-3 flex gap-2">Partner Onboarding </h1>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
                <Box sx={{ width: '100%', boxShadow: 3  }}>
                    <Tabs variant="fullWidth" value={tabIndex} onChange={(e, val) => setTabIndex(val)} indicatorColor="primary" scrollButtons="auto" textColor="inherit" sx={{ backgroundColor: '#F5F5FF', '& .MuiTabs-indicator': { backgroundColor: '#0000FF' }, '& .MuiTab-root': { color: '#424242', textTransform: 'capitalize', whiteSpace: 'normal', lineHeight: 1.2, minHeight: 'auto', }, '& .Mui-selected': { color: '#0000FF' } }} >
                        <Tab label="Add Employer Profile" sx={{ fontWeight: 700, fontSize: 16, color: tabIndex === 0 ? '#0000FF' : '#000', textTransform: 'none' }} />
                        <Tab label="Upload Required Documents" sx={{ fontWeight: 700, fontSize: 16, color: tabIndex === 1 ? '#0000FF' : '#000', textTransform: 'none' }} />
                    </Tabs>
                    <Box sx={{ width: '100%', typography: 'body1', p: 3, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, bgcolor: '#fff', color: '#000' }}>
                        {tabIndex === 0 && (
                            <Box mt={3}>
                                <Grid container spacing={2}>
                                    {/* Partner Name */}
                                    <Grid item xs={12} md={6}>
                                        <Label>Partner Name</Label>
                                        <RHFTextField name="employerName" />
                                    </Grid>

                                    {/* Admin Phone No */}
                                    <Grid item xs={12} md={6}>
                                        <Label>Admin Phone No</Label>
                                        <RHFTextField name="adminPhone" />
                                    </Grid>

                                    {/* PAN (Entity) */}
                                    <Grid item xs={12} md={6}>
                                        <Label>PAN (Entity)</Label>
                                        <RHFTextField name="pan" InputProps={{ endAdornment: <InputAdornment position="end"><Button variant="contained" size="small" sx={{ bgcolor: '#0000FF', color: '#fff', height: '25px' }} onClick={() => handleVerify('pan')}>Verify</Button></InputAdornment> }} />

                                    </Grid>

                                    {/* CIN (Optional) */}
                                    <Grid item xs={12} md={6}>
                                        <Label>CIN (Optional)</Label>
                                        <RHFTextField name="cin" />
                                    </Grid>

                                    {/* Legal Entity Type */}
                                    <Grid item xs={12} md={6}>
                                        <Label>Legal Entity Type</Label>
                                        <RHFAutocomplete name="legalType"  options={legalTypeOptions} getOptionLabel={(option) => option?.label || ''} isOptionEqualToValue={(option, value) => option?.value === value?.value} />
                                    </Grid>

                                    {/* Admin Email ID */}
                                    <Grid item xs={12} md={6}>
                                        <Label>Admin Email ID</Label>
                                        <RHFTextField name="adminEmail" InputProps={{ endAdornment: <InputAdornment position="end"><Button variant="contained" size="small" sx={{ bgcolor: '#0000FF', color: '#fff', height: '25px' }}>Verify</Button></InputAdornment> }} />

                                    </Grid>

                                    {/* Alternate Contact (Optional) */}
                                    <Grid item xs={12} md={6}>
                                        <Label>Alternate Contact (Optional)</Label>
                                        <RHFTextField name="alternateContact" />
                                    </Grid>

                                    {/* GSTIN (Optional) */}
                                    <Grid item xs={12} md={6}>
                                        <Label>GSTIN (Optional)</Label>
                                        <RHFTextField name="gstin" InputProps={{ endAdornment: <InputAdornment position="end"><Button variant="contained" size="small" sx={{ bgcolor: '#0000FF', color: '#fff', height: '25px' }} onClick={() => handleVerify('gst')}>Verify</Button></InputAdornment> }} />
                                    </Grid>

                                    {/* Portal */}
                                    <Grid item xs={12} md={6}>
                                        <Label>Portal</Label>
                                        <RHFTextField name="portal" />
                                    </Grid>
                                </Grid>

                                <Box mt={5} display="flex" justifyContent="end">
                                    {/* <Button variant="outlined" sx={{ color: '#0000FF', borderColor: '#0000FF' }}>Save as Draft</Button> */}
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#0000FF' }}
                                        onClick={handleSubmit(handleFirstTabSubmit, (errors) => {
                                            console.log("Validation errors in Tab 0:", errors);
                                        })}
                                    >
                                        Continue
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {tabIndex === 1 && (
                            <Box mt={3}>
                                <Grid container spacing={2}>
                                    {/* Signed Master Agreement */}
                                    <Grid item xs={12} md={6}>
                                        {renderUploadField('Signed Master Agreement', 'signedMasterAgreement')}
                                    </Grid>

                                    {/* Board Resolution */}
                                    <Grid item xs={12} md={6}>
                                        {renderUploadField('Board Resolution (if Pvt Ltd/LLP)', 'boardResolution')}
                                    </Grid>

                                    {/* Additional Docs */}
                                    <Grid item xs={12} md={6}>
                                        {renderUploadField('Additional Docs (Custom tags)', 'additionalDoc')}
                                    </Grid>

                                    {/* Company KYC Documents */}
                                    <Grid item xs={12} md={6}>
                                        {renderUploadField('Company KYC Documents (PAN, GST, etc.)', 'kycDocuments')}
                                    </Grid>

                                    {/* Employee Onboarding SOP */}
                                    <Grid item xs={12} md={6}>
                                        {renderUploadField('Employee Onboarding SOP (optional)', 'onboardingSOP')}
                                    </Grid>
                                </Grid>


                                <Box mt={5} display="flex" justifyContent="end">
                                    {/* <Button variant="outlined" sx={{ color: '#0000FF', borderColor: '#0000FF' }}>Save as Draft</Button> */}
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#0000FF' }}
                                        onClick={handleSubmit(handleSecondTabSubmit)}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                            <DialogTitle sx={{ fontWeight: 'bold', color: '#0000FF', fontSize: 20 }}>Partner & Contact Summary</DialogTitle>
                            <DialogContent>
                                <Box px={2} py={1}>
                                    <Grid container spacing={2}>
                                        <FieldRow label="Partner Name" value={employerName} />
                                        <FieldRow label="Admin Phone" value={adminPhone} />
                                        <FieldRow label="Admin Email" value={adminEmail} />

                                    </Grid>
                                </Box>
                                <Divider sx={{ my: 3 }} />
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button sx={{ textTransform: 'none' }} variant="outlined" color="error" onClick={() => setOpenDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" sx={{ bgcolor: '#0000FF', textTransform: 'none' }} onClick={handleFinalSubmit}>
                                        Send Welcome Email & Activate EMS Account
                                    </Button>
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </Box>
                    </Box>
            </FormProvider>
       
        </>
    );
}