
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
import BasicDetails from '../Loanapplications/BasicDetails';
import KYCVerification from '../Loanapplications/KYCVerification';
import CRIFBureau from '../Loanapplications/CRIFBureau';
import IncomeAnalysis from '../Loanapplications/IncomeAnalysis';
import DeviceRisks from '../Loanapplications/DeviceRisks';
import { useState } from 'react';


const tabs = [
    'Basic Details',
    'KYC Verification',
    'CRIF Bureau',
    'Income Analysis',
    'Device & Risks',
];

const ViewDetailsVerApp = () => {
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

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
                        <Typography fontWeight={600}>View Details</Typography>
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
            </Box>
        </Paper>
    );
};

export default ViewDetailsVerApp;
