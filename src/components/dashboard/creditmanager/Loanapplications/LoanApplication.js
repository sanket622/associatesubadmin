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
    role,
    setPage,
    setLimit,
} from '../../../../redux/getPendingLoans/getpendingloanslice';
import { ASSIGN_TO_BY_ROLE } from '../../../subcompotents/UtilityService';




const LoanApplication = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [openFilter, setOpenFilter] = useState(false);
    const [kycAnchorEl, setKycAnchorEl] = useState(null);
    const [kycLink, setKycLink] = useState('');
    const [kycLoadingId, setKycLoadingId] = useState(null);
    const [generatedKycIds, setGeneratedKycIds] = useState({});
    const [loadingRowId, setLoadingRowId] = useState(null);
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
    const assignOptions = ASSIGN_TO_BY_ROLE[role] || [];

    useEffect(() => {
        dispatch(fetchMyPendingLoans({ page, limit }));
    }, [dispatch, page, limit]);



    const handleGenerateKyc = async (loan) => {
        try {
            const token = localStorage.getItem('accessToken');
            setKycLoadingId(loan.id);

            const employee = loan.employee || {};
            const basicDetails = loan.LoanFormData?.formJsonData?.basicDetails || {};

            let firstName = (basicDetails.firstName || employee.employeeName || '').trim();
            let lastName = (basicDetails.lastName || '').trim();
            let mobile = (basicDetails.phone || employee.mobile || '').toString().trim();
            let email = (basicDetails.email || employee.email || '').trim();

            if (!firstName || !lastName || !mobile || !email) {
                const detailsRes = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/manager/getLoanDetails/${loan.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const detailsData = detailsRes?.data?.data || {};
                const detailsEmployee = detailsData?.employee || {};
                const detailsBasic = detailsData?.LoanFormData?.formJsonData?.basicDetails || {};

                firstName = (firstName || detailsBasic.firstName || detailsEmployee.employeeName || '').trim();
                lastName = (lastName || detailsBasic.lastName || '').trim();
                mobile = (mobile || detailsBasic.phone || detailsEmployee.mobile || '').toString().trim();
                email = (email || detailsBasic.email || detailsEmployee.email || '').trim();
            }

            if (!firstName || !lastName || !mobile || !email) {
                enqueueSnackbar('Unable to generate VKYC link: customer basic details are incomplete.', {
                    variant: 'error',
                });
                return;
            }

            const payload = {
                firstName,
                lastName,
                mobile: Number(mobile),
                email,
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




    // const handleLoanApproval = async () => {
    //     try {
    //         const token = localStorage.getItem('accessToken');

    //         const response = await axios.post(
    //             `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/processLoanApproval/${selectedLoanId}`,
    //             { assignTo, action, remarks },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         enqueueSnackbar(response?.data?.message, { variant: 'success' });
    //         setApproveModalOpen(false);
    //         dispatch(fetchMyPendingLoans({ page, limit }));
    //     } catch (error) {
    //         enqueueSnackbar(error?.response?.data?.message || error.message, {
    //             variant: 'error',
    //         });
    //     }
    // };

    console.log('User Role:', role);
    const handleViewKyc = async (event, loanId) => {
        try {
            const token = localStorage.getItem('accessToken');

            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/vkyc/getVKYCDataPointDetails/${loanId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setKycLink(res.data?.data?.kycLink || '-');
            setKycAnchorEl(event.currentTarget);
        } catch (error) {
            console.log(error);

            enqueueSnackbar(`${error?.response?.data?.message} ${error.message}`, { variant: 'error' });
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
        const formData = loan.LoanFormData?.formJsonData || {};
        const basicDetails = formData.basicDetails || {};
        const employee = loan.employee || {};

        return {
            id: loan.id,
            customerId: loan?.employee?.customEmployeeId || '—',
            loanCode: loan?.loanCode || '-',
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
        { key: 'loanCode', label: 'Loan ID' },
        { key: 'employeeName', label: 'Customer Name' },
        { key: 'email', label: 'Email' },
        { key: 'mobile', label: 'Mobile' },
        // { key: 'pan', label: 'PAN' },
        // {
        //     key: 'aadhar',
        //     label: 'Aadhaar',
        //     render: (_, row) => (
        //         row.aadhar !== '-' ? (
        //             <IconButton
        //                 size="small"
        //                 variant="outlined"
        //                 onClick={() => handleOpenAadhar(row.aadhar)}
        //             >
        //                 <VisibilityOutlinedIcon />
        //             </IconButton>
        //         ) : '-'
        //     ),
        // },

        // {
        //     key: 'kyc',
        //     label: 'KYC',
        //     render: (_, row) => {
        //         const loan = loans.find(l => l.id === row.id);
        //         const isGenerated = loan?.vkycStatus === 'LINK_GENERATED';

        //         return (
        //             <Button
        //                 size="small"
        //                 variant="contained"
        //                 disabled={isGenerated || kycLoadingId === row.id}
        //                 onClick={(e) =>
        //                     isGenerated
        //                         ? handleViewKyc(e, row.id)
        //                         : handleGenerateKyc(loan)
        //                 }
        //                 sx={{
        //                     background: isGenerated ? '#9e9e9e' : '#5577FD',
        //                     textTransform: 'none',
        //                     '&:hover': {
        //                         background: isGenerated ? '#9e9e9e' : '#5375fdff',
        //                     },
        //                 }}
        //             >
        //                 {isGenerated ? 'Generated' : 'Send KYC Link'}
        //             </Button>
        //         );
        //     },
        // },
        // {
        //     key: 'approval',
        //     label: 'Approve / Reject',
        //     render: (_, row) => (
        //         <Button
        //             size="small"
        //             variant="outlined"
        //             onClick={() => {
        //                 setSelectedLoanId(row.id);
        //                 setAssignTo('');
        //                 setAction('APPROVE');
        //                 setRemarks('');
        //                 setApproveModalOpen(true);
        //             }}
        //         >
        //             Approve / Reject
        //         </Button>
        //     ),
        // }
        // ,
        {
            key: 'action',
            label: 'Action',
            render: (_, row) => {
                const loan = loans.find(l => l.id === row.id);
                console.log(loans);

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
                                        source: 'loanapplication',
                                        role,
                                        loanId: loan?.id,
                                        employee: loan?.employee,
                                        formData: loan?.LoanFormData?.formJsonData,
                                        loanMeta: {
                                            loanCode: loan?.loanCode,
                                            vkycStatus: loan?.vkycStatus,
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

            {/* <Dialog open={approveModalOpen} onClose={() => setApproveModalOpen(false)}>
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
            </Dialog> */}


        </Paper>
    );
};

export default LoanApplication;
