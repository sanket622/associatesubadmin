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
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReusableTable from '../../../subcompotents/ReusableTable';
import FilterModal from '../../../subcompotents/FilterModal';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, Typography } from '@mui/material';

import {
    fetchMyPendingLoans,
    setPage,
    setLimit,
} from '../../../../redux/getPendingLoans/getpendingloanslice';
import { ASSIGN_TO_BY_ROLE, handleViewKyc } from '../../../subcompotents/UtilityService';
import { fetchMyAppliedLoans } from '../../../../redux/getPendingLoans/getappliedloansslice';




const OmLoanApplications = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [openFilter, setOpenFilter] = useState(false);
    const [kycAnchorEl, setKycAnchorEl] = useState(null);
    const [kycLink, setKycLink] = useState('');
    const [kycLoadingId, setKycLoadingId] = useState(null);
    const [generatedKycIds, setGeneratedKycIds] = useState({});

    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [action, setAction] = useState('APPROVE');
    const [assignTo, setAssignTo] = useState('');
    const [remarks, setRemarks] = useState('');
    const [loadingRowId, setLoadingRowId] = useState(null);

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
    } = useSelector((state) => state.appliedLoans);
    const assignOptions = ASSIGN_TO_BY_ROLE[role] || [];




    useEffect(() => {
        dispatch(fetchMyAppliedLoans({ page, limit }));
    }, [dispatch, page, limit]);



    const handleGenerateKyc = async (loan) => {
        try {
            const token = localStorage.getItem('accessToken');
            setKycLoadingId(loan.id);

            const employee = loan.employee || {};
            const basicDetails = loan.LoanFormData?.formJsonData?.basicDetails || {};

            const payload = {
                firstName: basicDetails.firstName || employee.employeeName || '',
                lastName: basicDetails.lastName || '',
                mobile: Number(basicDetails.phone || employee.mobile),
                email: basicDetails.email || employee.email || '',
            };


            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/vkyc/createVKYCLinkForCustomer/${loan.id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setGeneratedKycIds((prev) => ({ ...prev, [loan.id]: true }));
            enqueueSnackbar(res.data.message, { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(
                error?.response?.data?.message || error.message,
                { variant: 'error' }
            );
        } finally {
            setKycLoadingId(null);
        }
    };




    const handleLoanApproval = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/processLoanApproval/${selectedLoanId}`,
                { assignTo, action, remarks },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            enqueueSnackbar(`Loan ${action}ED successfully`, { variant: 'success' });
            setApproveModalOpen(false);
            dispatch(fetchMyPendingLoans({ page, limit }));
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message || error.message, {
                variant: 'error',
            });
        }
    };


    const handleClosePopover = () => {
        setKycAnchorEl(null);
        setKycLink('');
    };

    const handleOpenAadhar = (aadharPath) => {
        if (!aadharPath) return;

        const fileUrl = `${process.env.REACT_APP_BACKEND_MEDIA}${aadharPath}`;
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
    };


    const tableData = loans.map((loan) => {
        const form = loan.LoanFormData?.formJsonData || {};
        const basic = form.basicDetails || {};
        const loanDetails = form.loanDetails || {};

        return {
            id: loan.id,
            customerId: loan?.employee?.customEmployeeId || '—',
            loanCode: loan.loanCode || '-',
            loanType: loan.masterProduct?.productName || '-',
            customerName: loan?.employee?.employeeName || '—',
            loanAmount: loanDetails.loanAmount
                ? `₹${Number(loanDetails.loanAmount).toLocaleString()}`
                : '-',
            vkycStatus: loan.vkycStatus,
        };
    });


    const handleApplyFilter = (filters) => {
        console.log('Filters:', filters);

    };

    const columns = [
        { key: 'customerId', label: 'Customer ID' },
        {
            key: 'customerName',
            label: 'Customer Name',
        },
        {
            key: 'loanCode',
            label: 'Loan ID',
        },
        {
            key: 'loanType',
            label: 'Loan Type',
        },

        // {
        //     key: 'loanAmount',
        //     label: 'Loan Amount',
        // },
        {
            key: 'kyc',
            label: 'KYC Link',
            render: (_, row) => {
                const loan = loans.find((l) => l.id === row.id);
                const isGenerated =
                    loan?.vkycStatus !== 'NOT_INITIATED'

                return (
                    <Button
                        size="small"
                        variant="contained"
                        disabled={isGenerated}
                        onClick={() => handleGenerateKyc(loan)}
                        sx={{
                            background: 'var(--table-btn)',
                            textTransform: 'none',
                        }}
                    >
                        {isGenerated ? 'Generated' : 'Send KYC Link'}
                    </Button>
                );
            },
        },
        {
            key: 'action',
            label: 'Action',
            render: (_, row) => {
                const loan = loans.find((l) => l.id === row.id);

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

                                navigate(`/omloanapplications/view-details/${row.id}`, {
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
                title="Loan Application"
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

            <Popover
                open={Boolean(kycAnchorEl)}
                anchorEl={kycAnchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Typography sx={{ p: 2, maxWidth: 300, wordBreak: 'break-all' }}>
                    {kycLink}
                </Typography>
            </Popover>

            <Dialog open={approveModalOpen} onClose={() => setApproveModalOpen(false)}>
                <DialogTitle>Loan Approval</DialogTitle>

                <DialogContent sx={{ mt: 1 }}>
                    <TextField
                        select
                        fullWidth
                        label="Action"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        margin="dense"
                    >
                        <MenuItem value="APPROVE">Approve</MenuItem>
                        <MenuItem value="REJECT">Reject</MenuItem>
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Assign To"
                        value={assignTo}
                        onChange={(e) => setAssignTo(e.target.value)}
                        margin="dense"
                    >
                        {assignOptions.map((role) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label="Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        margin="dense"
                        multiline
                        rows={3}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setApproveModalOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        disabled={!assignTo}
                        onClick={handleLoanApproval}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>


        </Paper>
    );
};

export default OmLoanApplications;
