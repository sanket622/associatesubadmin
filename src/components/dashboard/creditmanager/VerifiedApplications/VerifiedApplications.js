
import {
    Paper,
    Chip,
    IconButton,
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterModal from '../FilterModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../../subcompotents/ReusableTable';

const verifiedApplications = Array.from({ length: 5 }).map((_, i) => ({
    id: `0000000${i + 1}`,
    customerName: 'Rajesh Kumar',
    phone: 'US26365',
    amount: '₹1500000',
    status: 'Approved',
    date: '25 June 2025',
}));



const VerifiedApplications = () => {
    const navigate = useNavigate();
    const [openFilter, setOpenFilter] = useState(false);
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
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <ReusableTable
                title="Verified Application"
                columns={columns}
                data={verifiedApplications}
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
    );
};

export default VerifiedApplications;
