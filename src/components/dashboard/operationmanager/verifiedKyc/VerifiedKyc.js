import React, { useEffect, useState, useMemo } from 'react';
import {
    Chip,
    CircularProgress,
    IconButton,
    Paper,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReusableTable from '../../../subcompotents/ReusableTable';
import FilterModal from '../../../subcompotents/FilterModal';
import { useNavigate } from 'react-router-dom';
import {
    fetchLoanManagerHistory,
    setLoanManagerHistoryPage,
    setLoanManagerHistoryLimit,
} from '../../../../redux/getPendingLoans/loanManagerHistorySlice';

import { useDispatch, useSelector } from 'react-redux';
import { handleViewKyc } from '../../../subcompotents/UtilityService';
const VerifiedKyc = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openFilter, setOpenFilter] = useState(false);
    const [loadingRowId, setLoadingRowId] = useState(null);
    const {
        rows,
        loading,
        error,
        page,
        limit,
        totalPages,
        totalCount,
    } = useSelector((state) => state.loanManagerHistory);

    useEffect(() => {
        dispatch(fetchLoanManagerHistory({ page, limit }));
    }, [dispatch, page, limit]);


    // ================= TABLE DATA =================
    const tableData = useMemo(() => {
        return rows.map((item) => {
            const loan = item.loanApplication;

            return {
                customerId: loan?.employee?.customEmployeeId || '—',
                loanApplicationId: loan?.id,
                name: loan?.employee?.employeeName || '—',
                loanId: loan?.loanCode || '—',
                status: item.action?.includes('REJECT')
                    ? 'Rejected'
                    : 'Completed',
                processedBy:
                    item.assignedTo?.role?.roleName?.replace('_', ' ') || '—',
            };
        });
    }, [rows]);

    // ================= COLUMNS =================
    const columns = [
        { key: 'customerId', label: 'Customer ID' },
        { key: 'name', label: 'Customer Name' },
        { key: 'loanId', label: 'Loan ID' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <Chip
                    label={value}
                    size="small"
                    sx={{
                        backgroundColor:
                            value === 'Completed' ? '#E8F5E9' : '#FDECEA',
                        color:
                            value === 'Completed' ? '#2E7D32' : '#D32F2F',
                        fontWeight: 500,
                    }}
                />
            ),
        },
        { key: 'processedBy', label: 'Processed By' },
        {
            key: 'action',
            label: 'Action',
            align: 'right',
            render: (_, row) => {
                return (
                    <IconButton
                        disabled={loadingRowId === row.loanApplicationId}
                        sx={{
                            '& svg': {
                                color: 'var(--theme-btn-bg)',
                            },
                        }}
                        onClick={async (e) => {
                            try {
                                setLoadingRowId(row.loanApplicationId);

                                // await handleViewKyc(e, row.loanApplicationId);

                                navigate(
                                    `/loan-applications/review-details/${row.loanApplicationId}`,
                                    {
                                        state: {
                                            source: 'approvals',
                                            PageName: 'verifiedpage',
                                        },
                                    }
                                );
                            } finally {
                                setLoadingRowId(null);
                            }
                        }}
                    >
                        {loadingRowId === row.loanApplicationId ? (
                            <CircularProgress size={20} />
                        ) : (
                            <VisibilityIcon />
                            
                        )}
                    </IconButton>
                );
            },
        }

    ];

    const handleApplyFilter = (filters) => {
        console.log('Filters:', filters);

    };
    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <ReusableTable
                title="Verified KYC"
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
                onPageChange={(newPage) => dispatch(setLoanManagerHistoryPage(newPage))}
                onRowsPerPageChange={(newLimit) =>
                    dispatch(setLoanManagerHistoryLimit(newLimit))
                }
            />

            {openFilter && (
                <FilterModal
                    open={openFilter}
                    onClose={() => setOpenFilter(false)}
                    onApply={handleApplyFilter}
                />
            )}
        </Paper>
    );
};

export default VerifiedKyc;
