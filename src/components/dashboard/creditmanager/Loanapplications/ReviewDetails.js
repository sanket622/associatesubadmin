
import {
    Box,
    Typography,
    Button,
    Chip,
    Divider,
    IconButton,
    Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SendIcon from '@mui/icons-material/Send';
import BasicDetails from './BasicDetails';
import KYCVerification from './KYCVerification';
import CRIFBureau from './CRIFBureau';
import IncomeAnalysis from './IncomeAnalysis';
import DeviceRisks from './DeviceRisks';
import ReAssignModal from '../ReAssignModal';

import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

const tabs = [
    'Basic Details',
    'KYC Verification',
    'CRIF Bureau',
    'Income Analysis',
    'Device & Risks',
];

const ReviewDetails = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [modalType, setModalType] = useState(null);
    const [agreementSent, setAgreementSent] = useState(false);
    const navigate = useNavigate();
    const handleModalSubmit = (data) => {
        if (modalType === 'reassign') {
            enqueueSnackbar('Re-Assign:', { variant: 'success' });

        }

        if (modalType === 'askDocument') {
            enqueueSnackbar('Ask Document:', { variant: 'success' });

        }

        if (modalType === 'confirm') {
            enqueueSnackbar('Agreement Sent', { variant: 'success' });
            setAgreementSent(true);
        }

        if (modalType === 'verify') {
            setModalType('approvePanel');
        }

        setModalType(null);
    };




    return (
        <Paper elevation={3} >
            <Box p={3}>

                <Box display="flex" justifyContent="space-between" mb={2} sx={{
                    borderBottom: '1px solid #D9D9D9',
                    padding: 2,
                }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton size="small" onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography fontWeight={600}>Review Details</Typography>
                    </Box>

                    <Box display="flex" gap={1}>
                        <Button
                            startIcon={<DescriptionIcon />}
                            variant="contained"
                            color="warning"
                            onClick={() => setModalType('askDocument')}
                        >
                            Ask Document
                        </Button>

                        <Button
                            startIcon={<AutorenewIcon />}
                            variant="contained"
                            color="primary"
                            onClick={() => setModalType('reassign')}
                        >
                            Re-Assign
                        </Button>

                        <Button
                            startIcon={<SendIcon />}
                            variant="contained"
                            color="success"
                            onClick={() => {
                                if (agreementSent) {
                                    setModalType('approvePanel');
                                } else {
                                    setModalType('confirm');
                                }
                            }}
                        >
                            {agreementSent ? 'Verify' : 'Send Agreement'}
                        </Button>


                    </Box>
                </Box>


                <Typography fontWeight={600}>Amit Patel</Typography>
                <Box display="flex" gap={1} alignItems="center" mb={2}>
                    <Typography variant="body2">Loan ID: CUST001236</Typography>
                    <Chip label="Medium Risk" size="small" color="warning" />
                </Box>


                <Box
                    display="flex"
                    width="100%"
                    borderBottom="1px solid #E5E7EB"
                    mb={3}
                >

                    {tabs.map((tab, i) => (
                        <Typography
                            key={tab}
                            onClick={() => setActiveTab(i)}
                            sx={{
                                flex: 1,
                                textAlign: 'center',
                                cursor: 'pointer',
                                p: 1.5,
                                fontSize: 14,
                                fontWeight: activeTab === i ? 600 : 400,
                                background: '#0000FF0A',
                                color: activeTab === i ? '#0000FF' : '#6B7280',
                                borderBottom: activeTab === i
                                    ? '3px solid #0000FF'
                                    : '3px solid transparent',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {tab}
                        </Typography>

                    ))}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {activeTab === 0 && <BasicDetails />}
                {activeTab === 1 && <KYCVerification />}
                {activeTab === 2 && <CRIFBureau />}
                {activeTab === 3 && <IncomeAnalysis />}
                {activeTab === 4 && <DeviceRisks />}


                <ReAssignModal
                    open={Boolean(modalType)}
                    type={modalType}
                    onClose={() => setModalType(null)}
                    onSubmit={handleModalSubmit}
                    options={
                        modalType === 'reassign'
                            ? [
                                { id: 1, name: 'Manager A' },
                                { id: 2, name: 'Manager B' },
                            ]
                            : [
                                { id: 1, name: 'Aadhar Card' },
                                { id: 2, name: 'Bank Statement' },
                            ]
                    }
                />


            </Box>
        </Paper>
    );
};

export default ReviewDetails;
