import { useEffect, useState } from 'react';
import {
    Button, CircularProgress, IconButton, Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReusableTable from '../../subcompotents/ReusableTable';
import FilterModal from '../../subcompotents/FilterModal';
import PaymentApprovalModal from './PaymentApprovalModal';
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


const PaymentApproval = () => {
    const navigate = useNavigate();
    const [openFilter, setOpenFilter] = useState(false);
    const [loadingRowId, setLoadingRowId] = useState(null);
    // const [openApproval, setOpenApproval] = useState(false);
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
        { key: 'employeeName', label: 'Customer Name' },
        { key: 'email', label: 'Email' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        // {
        //     key: 'paymentApproval',
        //     label: 'Payment Approval',
        //     render: () => (
        //         <Button
        //             size="small"
        //             variant="contained"
        //             sx={{ textTransform: 'none' }}
        //             onClick={() => setOpenApproval(true)}
        //         >
        //             Preview
        //         </Button>
        //     ),
        // },

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
                title="Payment Approval"
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

export default PaymentApproval;
