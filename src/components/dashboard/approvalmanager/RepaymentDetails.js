import { Paper, Box, Chip, Typography, IconButton } from '@mui/material';
import ReusableTable from '../../subcompotents/ReusableTable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
const summaryCards = [
    { label: 'EMIs Paid', value: 10 },
    { label: 'EMIs Pending', value: 30 },
    { label: 'EMIs Overdue', value: 1 },
    { label: 'Repayment Score', value: 1 },
];

const emiData = Array.from({ length: 10 }).map((_, index) => ({
    id: index + 1,
    emiNo: '01',
    dueDate: '05/04/2024',
    emiAmount: '₹16,607',
    principal: '₹12,107',
    interest: '₹4,500',
    paymentDate: '05/04/2024',
    status: index < 5 ? 'Paid' : 'Pending',
}));

const columns = [
    { key: 'emiNo', label: 'EMI No' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'emiAmount', label: 'EMI Amount' },
    { key: 'principal', label: 'Principal' },
    { key: 'interest', label: 'Interest' },
    { key: 'paymentDate', label: 'Payment Date' },
    {
        key: 'status',
        label: 'Status',
        render: (value) => (
            <Chip
                label={value}
                size="small"
                sx={{
                    backgroundColor: value === 'Paid' ? '#E8F5E9' : '#FDECEA',
                    color: value === 'Paid' ? '#2E7D32' : '#D32F2F',
                }}
            />
        ),
    },
];

const RepaymentDetails = () => {
    const navigate = useNavigate();
    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <IconButton size="small" onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography fontWeight={600}>View Details</Typography>
            </Box>
            <Typography fontWeight={600} mb={2}>
                Repayment Details
            </Typography>

            {/* Summary Cards */}
            <Box display="flex" gap={2} mb={3}>
                {summaryCards.map((item) => (
                    <Paper key={item.label} sx={{ p: 2, flex: 1 }}>
                        <Typography variant="caption">{item.label}</Typography>
                        <Typography fontWeight={600}>{item.value}</Typography>
                    </Paper>
                ))}
            </Box>

            {/* EMI Payment Track */}
            <ReusableTable
                title="EMI Payment Track"
                columns={columns}
                data={emiData}
                showSearch={false}
                showFilter={false}
            />
        </Paper>
    );
};

export default RepaymentDetails;
