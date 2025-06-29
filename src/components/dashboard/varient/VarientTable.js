import React, { useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    CircularProgress, Button,
    IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVariantsByProductId } from '../../../redux/varient/variantProductsSlice';
import { useNavigate, useParams } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import ArchiveIcon from '@mui/icons-material/Archive';
import ArchiveDialog from './ArchiveDialog';
import EditIcon from '@mui/icons-material/Edit';


const VarientTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedVariant, setSelectedVariant] = React.useState(null);


    const { variants, loading, error } = useSelector((state) => state.variantProducts);

    useEffect(() => {
        dispatch(fetchVariantsByProductId(productId));
    }, [dispatch, productId]);

    const handleAssignPartner = (variantId) => {
        navigate(`/assign-partner/${variantId}`);
    };

    const handleViewAssignedPartner = (variantId) => {
        navigate(`/assigned-partners/${variantId}`);
    };


    return (
        <>
            <div className="p-6">
                <h1 className="text-[24px] font-semibold mb-4">Variant List</h1>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <TableContainer component={Paper}
                        sx={{
                            overflowX: 'auto',
                            borderRadius: 2,
                            '&::-webkit-scrollbar': { height: '8px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#0000FF', borderRadius: '4px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                        }}>
                        <Table>
                            <TableHead sx={{ background: '#F5F5FF' }}>
                                <TableRow>
                                    {['Sno.', 'Name', 'Type', 'Code', 'Product Type', 'View Varient', 'Assign', 'View Assigned', 'Archive', 'Edit'].map((header) => (
                                        <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" style={{ color: 'red' }}>{error}</TableCell>
                                    </TableRow>
                                ) : variants.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">No variants found.</TableCell>
                                    </TableRow>
                                ) : (
                                    variants.map((variant, index) => (
                                        <TableRow key={variant.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{variant.variantName}</TableCell>
                                            <TableCell>{variant.variantType}</TableCell>
                                            <TableCell>{variant.variantCode}</TableCell>
                                            <TableCell>{variant.productType}</TableCell>
                                            <TableCell>

                                                <IconButton
                                                    onClick={() => navigate(`/varient-details-single/${variant.id}`)}
                                                    title="View Details"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => handleAssignPartner(variant.id)}
                                                    title="Assign Partner"
                                                    sx={{ color: '#0000FF' }}
                                                >
                                                    <PersonAddIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => handleViewAssignedPartner(variant.id)}
                                                    title="View Assigned Partners"
                                                    sx={{ color: '#28a745' }}
                                                >
                                                    <GroupIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => {
                                                        setSelectedVariant(variant);
                                                        setOpenDialog(true);
                                                    }}

                                                    title="Archive"
                                                    sx={{ color: 'red' }}
                                                >
                                                    <ArchiveIcon />
                                                </IconButton>

                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => navigate(`/createvarient/${variant.id}`, { state: { mode: 'EDIT' } })}
                                                    title="Edit Variant"
                                                    sx={{ color: 'green' }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            {selectedVariant && (
                <ArchiveDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    variant={selectedVariant}
                />
            )}

        </>
    );
};

export default VarientTable;