import {
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Chip,
    IconButton,
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ReusableTable from '../../subcompotents/ReusableTable';
import FilterModal from '../../subcompotents/FilterModal';




const summaryCards = [
    { title: 'Pending Approvals', count: 10 },
    { title: 'Pending Disbursed', count: 500000 },
    { title: 'Overdue Loans', count: 1 },
    { title: 'Critical Issue', count: 1 },

];

const applications = Array.from({ length: 5 }).map((_, i) => ({
    id: `0000000${i + 1}`,
    customerName: 'Rajesh Kumar',
    phone: 'US26365',
    amount: '₹1500000',
    status: 'Disbursement',
    date: '25 June 2025',
}));


const OverView = () => {
    const [openFilter, setOpenFilter] = useState(false);
    const navigate = useNavigate();

    const handleApplyFilter = (filters) => {
        console.log('Filters:', filters);

    };


    const columns = [
        { key: 'id', label: 'Loan ID' },
        { key: 'customerName', label: 'Customer Name' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'amount', label: 'Loan Amount' },
        {
            key: 'status',
            label: 'Status',
            render: (_, row) => (
                <Chip
                    label={row.status}
                    size="small"
                    sx={{
                        backgroundColor: '#E8F5E9',
                        color: '#2E7D32',
                        fontWeight: 500,
                    }}
                />
            ),
        },
        { key: 'date', label: 'Date' },
        {
            key: 'action',
            label: 'Action',
            render: () => (
                <IconButton
                    size="small"
                    onClick={() =>
                        navigate('/verified-applications/view-details')
                    }
                >
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            ),
        },
    ];

    return (
        <>
            <Grid container spacing={2} mb={3}>
                {summaryCards?.map((card, index) => (
                    <Grid item xs={12} sm={6} md={2.4} key={index}>
                        <Card elevation={1}>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {card.title}
                                </Typography>
                                <Typography variant="h5" fontWeight={600}>
                                    {card.count}
                                </Typography>
                                <Typography variant="caption" color="success.main">
                                    ▲ 11% this month
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <ReusableTable
                    title="Application"
                    columns={columns}
                    data={applications}
                    showSearch
                    showFilter
                    onFilterClick={() => setOpenFilter(true)}
                />
                <FilterModal
                    open={openFilter}
                    onClose={() => setOpenFilter(false)}
                    onApply={handleApplyFilter}
                />


            </Paper>
        </>
    );
};

export default OverView;
