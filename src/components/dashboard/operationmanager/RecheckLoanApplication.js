import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, IconButton, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

import ReusableTable from '../../subcompotents/ReusableTable';
import {
    fetchRecheckLoans,
    setRecheckPage,
    setRecheckLimit,
} from '../../../redux/getPendingLoans/recheckLoanSlice';

const RecheckLoanApplication = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loans,
        loading,
        error,
        page,
        limit,
        totalPages,
        totalCount,
    } = useSelector((state) => state.recheckLoans);

    useEffect(() => {
        dispatch(fetchRecheckLoans({ page, limit }));
    }, [dispatch, page, limit]);

    const tableData = useMemo(
        () =>
            loans.map((loan) => ({
                id: loan.id,
                customerId: loan?.employee?.customEmployeeId || '—',
                loanCode: loan.loanCode,
                employeeName: loan.employee?.employeeName || '-',
                email: loan.employee?.email || '-',
                mobile: loan.employee?.mobile || '-',
                product: loan.masterProduct?.productName || '-',
                status: loan.internalStatus,
            })),
        [loans]
    );

    const columns = [
        { key: 'customerId', label: 'Customer ID' },
        { key: 'employeeName', label: 'Customer Name' },
        { key: 'loanCode', label: 'Loan ID' },

        // { key: 'email', label: 'Email' },
        // { key: 'mobile', label: 'Mobile' },
        { key: 'product', label: 'Loan Type' },
        // { key: 'status', label: 'Status' },
        {
            key: 'action',
            label: 'Action',
            render: (_, row) => (
                <IconButton
                    sx={{
                        '& svg': {
                            color: 'var(--theme-btn-bg)',
                        },
                    }}
                    onClick={() =>
                        navigate(`/loan-applications/review-details/${row.id}`, {
                            state: { source: 'recheck', showAllTabs: true, },
                        })
                    }
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <ReusableTable
                title="Recheck Loans"
                columns={columns}
                data={tableData}
                loading={loading}
                error={error}
                page={page}
                rowsPerPage={limit}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={(newPage) => dispatch(setRecheckPage(newPage))}
                onRowsPerPageChange={(newLimit) =>
                    dispatch(setRecheckLimit(newLimit))
                }
            />
        </Paper>
    );
};

export default RecheckLoanApplication;
