import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
    Button, IconButton, Paper, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    TextField,
    Chip,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReusableTable from '../../subcompotents/ReusableTable';
import FilterModal from '../../subcompotents/FilterModal';
import { useDispatch, useSelector } from 'react-redux';
// import { Popover, Typography } from '@mui/material';

import {
    fetchMyPendingLoans,
    role,
    setPage,
    setLimit,
} from '../../../redux/getPendingLoans/getpendingloanslice';
import { handleViewKyc } from '../../subcompotents/UtilityService';
// import { ASSIGN_TO_BY_ROLE } from '../../subcompotents/UtilityService';




const Disbursements = () => {
    const navigate = useNavigate();
    // const { enqueueSnackbar } = useSnackbar();
    const [openFilter, setOpenFilter] = useState(false);
    const [loadingRowId, setLoadingRowId] = useState(null);
    // const [kycAnchorEl, setKycAnchorEl] = useState(null);
    // const [kycLink, setKycLink] = useState('');
    // const [kycLoadingId, setKycLoadingId] = useState(null);
    // const [generatedKycIds, setGeneratedKycIds] = useState({});

    // const [approveModalOpen, setApproveModalOpen] = useState(false);
    // const [selectedLoanId, setSelectedLoanId] = useState(null);
    // const [action, setAction] = useState('APPROVE');
    // const [assignTo, setAssignTo] = useState('');
    // const [remarks, setRemarks] = useState('');


    const dispatch = useDispatch();

    const {
        loans,
        loading,
        error,
        page,
        limit,
        totalPages,
        totalCount,
        role
    } = useSelector((state) => state.pendingLoans);
    // const assignOptions = ASSIGN_TO_BY_ROLE[role] || [];

    useEffect(() => {
        dispatch(fetchMyPendingLoans({ page, limit }));
    }, [dispatch, page, limit]);




    const tableData = loans.map((loan) => {
        const formData = loan.LoanFormData?.formJsonData || {};
        const basicDetails = formData.basicDetails || {};
        const employee = loan.employee || {};

        return {
            id: loan.id,
            customerId: loan?.employee?.customEmployeeId || '—',
            employeeName: employee.employeeName || '-',
            email: employee.email || '-',
            mobile: employee.mobile || '-',


            firstName: basicDetails.firstName || '-',
            lastName: basicDetails.lastName || '-',

            pan: basicDetails.panNumber || '-',
            aadhar: formData.documents?.aadharCard || '-',
        };
    });

    const handleApplyFilter = (filters) => {
        console.log('Filters:', filters);

    };

    const columns = [
        { key: 'customerId', label: 'Customer ID' },
        { key: 'employeeName', label: 'Employee Name' },
        { key: 'email', label: 'Email' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        {
            key: 'action',
            label: 'Action',
            render: (_, row) => {
                const loan = loans.find(l => l.id === row.id);

                return (
                    <IconButton
                        disabled={loadingRowId === row.id}
                        sx={{
                            '& svg': {
                                color: 'var(--theme-btn-bg)',
                            },
                        }}
                        onClick={async (e) => {
                            try {
                                setLoadingRowId(row.id);

                                // await handleViewKyc(e, row.id);

                                navigate(`/loan-applications/review-details/${row.id}`, {
                                    state: {
                                        role,
                                        loanId: loan.id,
                                        employee: loan.employee,
                                        formData: loan.LoanFormData?.formJsonData,
                                        loanMeta: {
                                            loanCode: loan.loanCode,
                                            vkycStatus: loan.vkycStatus,
                                        },
                                    },
                                });
                            } finally {
                                setLoadingRowId(null);
                            }
                        }}
                    >
                        {loadingRowId === row.id ? (
                            <CircularProgress size={20} />
                        ) : (
                            <VisibilityIcon />
                        )}
                    </IconButton>
                );
            },
        }


    ];

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <ReusableTable
                title="Disbursements"
                columns={columns}
                data={tableData}
                loading={loading}
                error={error}
                showSearch
                showFilter
                onFilterClick={() => setOpenFilter(true)}

                page={page}
                rowsPerPage={limit}
                totalPages={totalPages}
                totalCount={totalCount}

                onPageChange={(newPage) => dispatch(setPage(newPage))}
                onRowsPerPageChange={(newLimit) => dispatch(setLimit(newLimit))}
            />

            {
                openFilter && (
                    <FilterModal
                        open={openFilter}
                        onClose={() => setOpenFilter(false)}
                        onApply={handleApplyFilter}
                    />
                )
            }
        </Paper>
    );
};

export default Disbursements;
