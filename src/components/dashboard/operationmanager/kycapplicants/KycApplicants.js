import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Typography,
    Divider,
    TextField,
    MenuItem,
    DialogActions,
    IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import ReusableTable from '../../../subcompotents/ReusableTable';
import FilterModal from '../../../subcompotents/FilterModal';
import { fetchKycApplicantDetails } from '../../../../redux/creditManager/kycApplicantsSlice';
import axios from 'axios';
import { ASSIGN_TO_BY_ROLE } from '../../../subcompotents/UtilityService';
import { useNavigate } from 'react-router-dom';




const KycApplicants = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [openFilter, setOpenFilter] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const { details, loading, pagination } = useSelector(
        (state) => state.kycApplicants
    );

    // const [approveModalOpen, setApproveModalOpen] = useState(false);
    // const [action, setAction] = useState('APPROVE');
    // const [assignTo, setAssignTo] = useState('');
    // const [remarks, setRemarks] = useState('');
    const userRole = localStorage.getItem('role');
    const assignOptions = ASSIGN_TO_BY_ROLE[userRole] || [];
    useEffect(() => {
        dispatch(fetchKycApplicantDetails({
            page: pagination.currentPage,
            limit: pagination.limit,
        }));
    }, [dispatch, pagination.currentPage, pagination.limit]);


    // console.log(details);

    // useEffect(() => {
    //     if (openPreview && selectedLoanId) {
    //         dispatch(fetchKycApplicantDetails({ loanId: selectedLoanId, enqueueSnackbar }));
    //     }
    // }, [openPreview, selectedLoanId, dispatch, enqueueSnackbar]);


    const selectedLoan = useMemo(
        () => details.find((l) => l.id === selectedLoanId),
        [details, selectedLoanId]
    );

    const openDocument = (path) => {
        if (!path) return;
        const baseUrl = process.env.REACT_APP_BACKEND_MEDIA;
        window.open(`${baseUrl}${path}`, '_blank', 'noopener,noreferrer');
    };


    const renderDocuments = (documents = {}) => {
        const docLabels = {
            photo: 'Photo',
            panCard: 'PAN Card',
            aadharCard: 'Aadhaar Card',
            incomeProof: 'Income Proof',
            addressProof: 'Address Proof',
        };

        return (
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {Object.entries(documents).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {docLabels[key] || key}
                        </Typography>

                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => openDocument(value)}
                            sx={{ textTransform: 'none' }}
                        >
                            View
                        </Button>
                    </Grid>
                ))}
            </Grid>
        );
    };



    const tableData = useMemo(() => {
        if (!Array.isArray(details)) return [];

        return details.map((loan) => {
            const basic = loan.LoanFormData?.formJsonData?.basicDetails || {};

            return {
                id: loan.id,
                customerId: loan?.employee?.customEmployeeId || '—',
                // customerId: loan.customerId,
                customerName: `${basic.firstName || ''} ${basic.lastName || ''}`.trim() || '—',
                mobile: basic.phone || '—',
                loanCode: loan.loanCode || '—',
                videoKyc: loan.vkycStatus === 'LINK_GENERATED' ? 'Completed' : 'Pending',
                documents: loan.LoanFormData?.formJsonData?.documents ? 'Completed' : 'Pending',
                __raw: loan,
            };
        });
    }, [details]);




    // const columns = useMemo(() => [
    //     { key: 'employeeName', label: 'EMPLOYEE NAME' },
    //     { key: 'email', label: 'EMAIL' },
    //     { key: 'mobile', label: 'MOBILE' },
    //     { key: 'loanCode', label: 'LOAN CODE' },
    //     { key: 'loanStatus', label: 'LOAN STATUS' },
    //     { key: 'vkycStatus', label: 'VKYC STATUS' },
    //     {
    //         key: 'action',
    //         label: 'KYC',
    //         align: 'right',
    //         render: (_, row) => (
    //             <Button
    //                 size="small"
    //                 variant="outlined"
    //                 onClick={() => {
    //                     setSelectedLoanId(row.id);
    //                     setOpenPreview(true);
    //                 }}
    //             >
    //                 <VisibilityIcon />
    //             </Button>
    //         ),
    //     },
    // ], []);

    const columns = [
        { key: 'customerId', label: 'Customer ID' },
        { key: 'customerName', label: 'Customer Name' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'loanCode', label: 'Loan ID' },

        // {
        //     key: 'videoKyc',
        //     label: 'VIDEO KYC',
        //     render: (value) => (
        //         <Button
        //             size="small"
        //             variant="contained"
        //             sx={{
        //                 backgroundColor: value === 'Completed' ? '#E6F4EA' : '#FFF3E0',
        //                 color: value === 'Completed' ? '#2E7D32' : '#EF6C00',
        //                 textTransform: 'none',
        //                 boxShadow: 'none',
        //                 '&:hover': { boxShadow: 'none' },
        //             }}
        //         >
        //             {value}
        //         </Button>
        //     ),
        // },

        // {
        //     key: 'documents',
        //     label: 'DOCUMENTS',
        //     render: (value) => (
        //         <Button
        //             size="small"
        //             variant="contained"
        //             sx={{
        //                 backgroundColor: value === 'Completed' ? '#E6F4EA' : '#FFF3E0',
        //                 color: value === 'Completed' ? '#2E7D32' : '#EF6C00',
        //                 textTransform: 'none',
        //                 boxShadow: 'none',
        //                 '&:hover': { boxShadow: 'none' },
        //             }}
        //         >
        //             {value}
        //         </Button>
        //     ),
        // },

        // {
        //     key: 'kyc',
        //     label: 'KYC',
        //     align: 'right',
        //     render: (_, row) => (
        //         <Button
        //             size="small"
        //             variant="contained"
        //             sx={{ textTransform: 'none' }}
        //             onClick={() => {
        //                 setSelectedLoanId(row.id);
        //                 setOpenPreview(true);
        //             }}
        //         >
        //             Preview
        //         </Button>
        //     ),
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
        // },
        {
            key: 'action',
            label: 'Action',
            render: (_, row) => {
                return (
                    <IconButton
                       sx={{
                            '& svg': {
                                color: 'var(--theme-btn-bg)',
                            },
                        }}
                        onClick={() =>
                            navigate(`/kyc-applicants/view-details/${row.id}`, {
                                state: { source: 'KYC_APPLICANTS' },
                            })
                        }
                    >
                        <VisibilityIcon />
                    </IconButton>
                );
            },
        },
    ];





    const isBase64Image = (str) => {
        if (typeof str !== 'string') return false;

        return (
            str.startsWith('/9j/') ||
            str.startsWith('iVBORw0KGgo') ||
            str.startsWith('UklGR')
        );
    };

    const renderValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return '—';
        }


        if (isBase64Image(value)) {
            return (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        const win = window.open();
                        win.document.write(`
                        <html>
                            <body style="margin:0;display:flex;justify-content:center;">
                                <img 
                                    src="data:image/jpeg;base64,${value}" 
                                    style="max-width:100%;height:auto;" 
                                />
                            </body>
                        </html>
                    `);
                    }}
                >
                    <VisibilityIcon />
                </Button>
            );
        }


        if (typeof value === 'string' && value.startsWith('http')) {
            return (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => window.open(value, '_blank')}
                >
                    <VisibilityIcon />
                </Button>
            );
        }


        if (typeof value === 'object') {
            return (
                <Grid container spacing={1} sx={{ pl: 1 }}>
                    {Object.entries(value).map(([k, v]) => (
                        <Grid item xs={12} key={k}>
                            <Typography variant="body2">
                                <strong>{k}:</strong> {renderValue(v)}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            );
        }


        return value.toString();
    };

    // const handleLoanApproval = async () => {
    //     try {
    //         const token = localStorage.getItem('accessToken');

    //         await axios.post(
    //             `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/loanApproval/processLoanApproval/${selectedLoanId}`,
    //             { assignTo, action, remarks },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         enqueueSnackbar(`Loan ${action}ED successfully`, { variant: 'success' });
    //         setApproveModalOpen(false);
    //         dispatch(fetchKycApplicantDetails());
    //     } catch (error) {
    //         enqueueSnackbar(error?.response?.data?.message || error.message, {
    //             variant: 'error',
    //         });
    //     }
    // };
    const renderDetails = (data) => {
        if (!data) return null;

        return Object.entries(data)
            .filter(([key]) => key !== 'documents')
            .map(([key, value]) => (
                <div key={key}>
                    <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mt: 2 }}
                    >
                        {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    {renderValue(value)}
                </div>
            ));
    };

    const handleApplyFilter = (filters) => {
        console.log('Filters:', filters);

    };

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <ReusableTable
                title="KYC Applicant"
                columns={columns}
                data={tableData}
                loading={loading}
                showSearch
                showFilter
                onFilterClick={() => setOpenFilter(true)}

                page={pagination.currentPage}
                rowsPerPage={pagination.limit}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
                onPageChange={(newPage) =>
                    dispatch(fetchKycApplicantDetails({
                        page: newPage,
                        limit: pagination.limit,
                    }))
                }
                onRowsPerPageChange={(newLimit) =>
                    dispatch(fetchKycApplicantDetails({
                        page: 1,
                        limit: newLimit,
                    }))
                }
            />

            {openFilter && (
                <FilterModal
                    open={openFilter}
                    onClose={() => setOpenFilter(false)}
                    onApply={handleApplyFilter}
                />
            )}


            <Dialog
                open={openPreview}
                onClose={() => setOpenPreview(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>VKYC Preview</DialogTitle>
                <DialogContent dividers>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <>
                            {/* ===== ALL DETAILS ===== */}
                            {renderDetails(selectedLoan?.LoanFormData?.formJsonData)}

                            <Divider sx={{ my: 3 }} />

                            {/* ===== DOCUMENTS (BUTTONS) ===== */}
                            <Typography variant="subtitle1" fontWeight={600}>
                                Documents
                            </Typography>

                            {renderDocuments(
                                selectedLoan?.LoanFormData?.formJsonData?.documents
                            )}
                        </>
                    )}
                </DialogContent>




            </Dialog>

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

export default KycApplicants;
