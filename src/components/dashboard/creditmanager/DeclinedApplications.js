
import {
    Paper,
    Chip,
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FilterModal from '../creditmanager/FilterModal';
import ReAssignModal from '../creditmanager/ReAssignModal';
import { useState } from 'react';
import ReusableTable from '../../subcompotents/ReusableTable';
import { LightTooltip } from '../../subcompotents/UtilityService';


const declinedApplications = Array.from({ length: 5 }).map((_, i) => ({
    id: `0000000${i + 1}`,
    customerName: 'Rajesh Kumar',
    phone: '8522567237',
    amount: '₹1500000',
    status: 'Declined',
    date: '25 June 2025',
}));



const DeclinedApplications = () => {
    const navigate = useNavigate();
    const [openFilter, setOpenFilter] = useState(false);
    const [modalType, setModalType] = useState(null);
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
                        backgroundColor: '#FDECEA',
                        color: '#D32F2F',
                        fontWeight: 500,
                    }}
                />
            ),
        },
        { key: 'date', label: 'Date' },
        {
            key: 'viewReason',
            label: 'View Reason',
            render: () => (
                <LightTooltip
                    title="View"
                    placement="top"
                    arrow
                    slotProps={{
                        popper: {
                            modifiers: [{ name: 'offset', options: { offset: [0, -14] } }],
                        },
                    }}
                >
                    <IconButton
                        size="small"
                        sx={{ color: 'red' }}
                        onClick={() => setModalType('decline')}
                    >
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </LightTooltip>
            ),
        },
        {
            key: 'action',
            label: 'Action',
            render: () => (
                <IconButton
                    size="small"
                    onClick={() =>
                        navigate('/declined-applications/view-details')
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
                title="Declined Application"
                columns={columns}
                data={declinedApplications}
                showSearch
                showFilter
                onFilterClick={() => setOpenFilter(true)}
            />

            <FilterModal
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                onApply={handleApplyFilter}
            />

            <ReAssignModal
                open={Boolean(modalType)}
                type={modalType}
                headerbg='#FFF2F2'
                onClose={() => setModalType(null)}
                onSubmit={() => setModalType(null)}
            />
        </Paper>
    );
};

export default DeclinedApplications;
