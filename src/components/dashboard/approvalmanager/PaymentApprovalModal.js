import { useState } from 'react';
import {
    Dialog,
    Box,
    Button,
    Typography,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const steps = ['Bank Details', 'Fee & Deduction', 'Disbursement'];

const PaymentApprovalModal = ({ open, onClose, loanData, loanId }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { LoanBankDetails, LoanCharges, LoanDisbursalSummary } = loanData;
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBackOrClose = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        } else {
            onClose();
        }
    };


    const StepProgress = ({ activeStep }) => {
        return (
            <Box display="flex" gap={1} mb={3}>
                {[0, 1, 2].map((step) => (
                    <Box
                        key={step}
                        flex={1}
                        height={8}
                        borderRadius={4}
                        sx={{
                            backgroundColor: activeStep >= step ? '#1E40FF' : '#E5E7EB',
                        }}
                    />
                ))}
            </Box>
        );
    };
    const handleApprove = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/disburseLoan/${loanId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            enqueueSnackbar(
                res?.data?.message || 'Loan disbursed successfully',
                { variant: 'success' }
            );

            onClose();
        } catch (err) {
            enqueueSnackbar(
                err?.response?.data?.message || 'Disbursement failed',
                { variant: 'error' }
            );
        }
    };


    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="xs"
            disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason === 'backdropClick') return;
                onClose();
            }}
        >

            <Box p={3}>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <IconButton size="small" onClick={handleBackOrClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography fontWeight={600}>Payment Approval</Typography>
                </Box>

                <StepProgress activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel />
                        </Step>
                    ))}
                </StepProgress >


                {activeStep === 0 && (
                    <>
                        <Typography fontWeight={600}>Bank Details :</Typography>
                        <Box mt={2}>
                            {Object.entries(LoanBankDetails || {}).map(([key, value]) => (
                                !['id', 'applicationId', 'createdAt', 'updatedAt'].includes(key) && (
                                    <Box key={key} mb={1}>
                                        <Typography >
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </Typography>
                                        <Typography>{value || '-'}</Typography>
                                    </Box>
                                )
                            ))}
                        </Box>
                        <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleNext}>
                            Next
                        </Button>
                    </>
                )}


                {activeStep === 1 && (
                    <>
                        <Typography fontWeight={600}>Fee & Deduction :</Typography>
                        <Box mt={2}>
                            {Object.entries(LoanCharges || {}).map(([key, value]) => {
                                if (
                                    ['id', 'applicationId', 'createdAt', 'updatedAt'].includes(key)
                                )
                                    return null;

                                const isTotal = key === 'totalCharges';

                                return (
                                    <Box key={key} mb={1}>
                                        <Typography
                                            
                                            fontWeight={isTotal ? 600 : 400}
                                        >
                                            {key
                                                .replace(/([A-Z])/g, ' $1')
                                                .replace(/^./, str => str.toUpperCase())}
                                            : ₹{value ?? '-'}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>

                        <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleNext}>
                            Next
                        </Button>
                    </>
                )}


                {activeStep === 2 && (
                    <>
                        <Typography fontWeight={600}>Disbursement Details :</Typography>
                        <Box mt={2}>
                            {Object.entries(LoanDisbursalSummary || {}).map(([key, value]) => {
                                if (
                                    ['id', 'applicationId', 'createdAt', 'updatedAt'].includes(key)
                                )
                                    return null;

                                const isNetAmount = key === 'netDisbursalAmount';

                                return (
                                    <Box key={key} mb={1}>
                                        <Typography
                                            fontWeight={isNetAmount ? 600 : 400}
                                            color={isNetAmount && Number(value) < 0 ? 'error.main' : 'text.primary'}
                                        >
                                            {key
                                                .replace(/([A-Z])/g, ' $1')
                                                .replace(/^./, str => str.toUpperCase())}
                                            : ₹{value ?? '-'}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>


                        <Box display="flex" gap={2} mt={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                onClick={onClose}
                            >
                                Decline
                            </Button>

                            <Button
                                fullWidth
                                variant="contained"
                                color="success"
                                onClick={handleApprove}
                            >
                                Approve
                            </Button>

                        </Box>
                    </>
                )}
            </Box>
        </Dialog>
    );
};

export default PaymentApprovalModal;
