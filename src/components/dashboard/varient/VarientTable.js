import React, { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVariantsByProductId } from '../../../redux/varient/variantProductsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import ArchiveIcon from '@mui/icons-material/Archive';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ReusableTable from '../../subcompotents/ReusableTable';
import ArchiveDialog from './ArchiveDialog';
import DeleteModal from '../productmanager/masterproduct/DeleteModal';
import { primaryBtnSx } from '../../subcompotents/UtilityService';
import { submitVariantProductForApproval } from '../../../redux/varient/createvariantproductrequest/variantProductCreateRequestSlice';
import ApprovalModal from '../../subcompotents/ApprovalModal';
import axios from 'axios';

const VarientTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();
    const [deleteModal, setDeleteModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitProductId, setSubmitProductId] = useState(null);
    const [rejectionReasons, setRejectionReasons] = useState({});
    const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
    const [selectedRejections, setSelectedRejections] = useState([]);

    const { variants = [], loading, error } = useSelector(
        (state) => state.variantProducts || {}
    );

    useEffect(() => {
        if (productId) {
            dispatch(fetchVariantsByProductId(productId));
            fetchRejectionReasons();
        }
    }, [dispatch, productId]);

    const fetchRejectionReasons = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/associate/variantProductUpdateRequest/getVariantProductUpdateRequestsForSubAdmin`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const rejectedRequests = (res?.data?.data?.data || []).filter(
                    (req) => req.status === 'REJECTED' && req.rejectionReason && req.variantProductId
                );

                const reasonsMap = {};
                rejectedRequests.forEach((req) => {
                    if (!reasonsMap[req.variantProductId]) {
                        reasonsMap[req.variantProductId] = [];
                    }
                    reasonsMap[req.variantProductId].push({
                        reason: req.rejectionReason,
                        date: req.updatedAt || req.createdAt,
                    });
                });

                Object.keys(reasonsMap).forEach((key) => {
                    reasonsMap[key].sort((a, b) => new Date(b.date) - new Date(a.date));
                });

                setRejectionReasons(reasonsMap);
            }
        } catch (err) {
            console.error('Failed to fetch variant rejection reasons:', err);
        }
    };

    /* ===================== TABLE COLUMNS ===================== */
    const columns = [
        {
            key: 'sno',
            label: 'Sno.',
            render: (_, __, index) => index + 1,
        },
        { key: 'variantName', label: 'Name' },
        { key: 'variantType', label: 'Type' },
        { key: 'variantCode', label: 'Code' },
        { key: 'productType', label: 'Product Type' },
        { key: 'status', label: 'Status' },
        {
            key: 'rejection',
            label: 'Rejection Reason',
            render: (_, row) => {
                const rejections = rejectionReasons[row.id];
                if (!rejections || rejections.length === 0) return '-';
                return (
                    <Button
                        size="small"
                        sx={{ textTransform: 'none', color: '#d32f2f' }}
                        onClick={() => {
                            setSelectedRejections(rejections);
                            setRejectionDialogOpen(true);
                        }}
                    >
                        View ({rejections.length})
                    </Button>
                );
            },
        },

        {
            key: 'view',
            label: 'View Variant',
            render: (_, row) => (
                <IconButton
                    onClick={() => navigate(`/varient-details-single/${row.id}`)}
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
        {
            key: 'assign',
            label: 'Assign',
            render: (_, row) => (
                <IconButton
                    sx={{ color: '#0000FF' }}
                    onClick={() => navigate(`/assign-partner/${row.id}`)}
                >
                    <PersonAddIcon />
                </IconButton>
            ),
        },
        {
            key: 'viewAssigned',
            label: 'View Assigned',
            render: (_, row) => (
                <IconButton
                    sx={{ color: '#28a745' }}
                    onClick={() => navigate(`/assigned-partners/${row.id}`)}
                >
                    <GroupIcon />
                </IconButton>
            ),
        },
        {
            key: 'gonopolicy',
            label: 'Go/No Policy',
            render: (_, row) => (
                <IconButton sx={{ color: '#084E77' }}
                    onClick={() => {
                        navigate(`/variant-product-policy/${row.id}`, {
                            state: {
                                status: row.status,
                            },
                        });
                    }}
                >
                    <PlaylistAddIcon />
                </IconButton>
            ),
        },
        {
            key: 'Bre Policy',
            label: 'Bre Policy',
            render: (_, row) => (
                <IconButton sx={{ color: '#084E77' }}
                    onClick={() => {
                        navigate(`/variant-bre-policy/${row.id}`, {
                            state: {
                                status: row.status,
                            },
                        });
                    }}
                >
                    <PlaylistAddIcon />
                </IconButton>
            ),
        },
        {
            key: 'archive',
            label: 'Archive',
            render: (_, row) => (
                <IconButton
                    sx={{ color: 'red' }}
                    onClick={() => {
                        setSelectedVariant(row);
                        setOpenDialog(true);
                    }}
                >
                    <ArchiveIcon />
                </IconButton>
            ),
        },


        {
            key: 'edit',
            label: 'Edit',
            render: (_, row) => (
                <IconButton
                    sx={{ color: 'green' }}
                    onClick={() => {
                        localStorage.setItem('createdVariantId', row?.id);
                        navigate(`/createvarient/${row.id}`,  { state: { mode: 'EDIT', status: row?.status } })
                    }
                    }
                >
                    <EditIcon />
                </IconButton>
            ),
        },

        {
            key: 'delete',
            label: 'Delete',
            render: (_, row) => (
                <IconButton
                    sx={{ color: 'red' }}
                    onClick={() => {
                        setSelectedVariant(row);
                        setDeleteModal(true);
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
        {
            key: 'submit',
            label: 'Approval',
            render: (_, row) => (
                <IconButton sx={{ color: '#084E77' }}
                    color="primary"
                    disabled={row.status === 'Active'}
                    onClick={() => {
                        setSubmitProductId(row.id);
                        setConfirmOpen(true);
                    }}
                >
                    <SendIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box mb={2}>
                <div className="flex justify-between items-center">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                    <Button
                        startIcon={<AddIcon />}
                        sx={primaryBtnSx}
                        onClick={() =>
                            navigate('/createvarient', { state: { productId } })
                        }
                    >
                        Create Variant
                    </Button>
                </div>
            </Box>


            <ReusableTable
                title="Variant List"
                columns={columns}
                data={variants}
                loading={loading}
                error={error}
                footerText={
                    variants.length
                        ? `Total variants: ${variants.length}`
                        : 'No variants available'
                }
            />


            {selectedVariant && (
                <ArchiveDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    variant={selectedVariant}
                />
            )}

            {deleteModal && (
                <DeleteModal
                    selectedItem={selectedVariant}
                    type="VARIANT"
                    setDeleteModal={setDeleteModal}
                />
            )}

            <ApprovalModal
                open={confirmOpen}
                entityLabel="variant"
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => {
                    dispatch(submitVariantProductForApproval(submitProductId));
                    setConfirmOpen(false);
                    setSubmitProductId(null);
                }}
            />

            <Dialog
                open={rejectionDialogOpen}
                onClose={() => setRejectionDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1,
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Typography variant="h6" fontWeight={600}>Rejection History</Typography>
                    <IconButton
                        onClick={() => setRejectionDialogOpen(false)}
                        size="small"
                        sx={{ color: '#666' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedRejections.length === 0 ? (
                        <Typography color="text.secondary" textAlign="center" py={3}>
                            No rejection history found
                        </Typography>
                    ) : (
                        selectedRejections.map((rejection, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    mb: 2,
                                    p: 2.5,
                                    bgcolor: '#fef2f2',
                                    borderRadius: 2,
                                    borderLeft: '4px solid #ef4444'
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {new Date(rejection.date).toLocaleString('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1, color: '#374151' }}>
                                    {rejection.reason}
                                </Typography>
                            </Box>
                        ))
                    )}
                </DialogContent>
            </Dialog>

        </Paper >
    );
};

export default VarientTable;
