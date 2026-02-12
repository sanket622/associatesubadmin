import React, { useEffect, useState } from 'react';
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Dialog,
    DialogContent
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllocatedProducts } from '../redux/varientallocation/allocatedProductsSlice';
import VariantAllocationForm from './VariantAllocationForm';

const AllocatedProductsTable = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.allocatedProducts);

    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        dispatch(fetchAllocatedProducts());
    }, [dispatch]);

    const handleDialogOpen = () => setOpenDialog(true);
    const handleDialogClose = () => {
        setOpenDialog(false);
        dispatch(fetchAllocatedProducts());
    };

    return (
        <div className="p-6">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <h1 className="text-[24px] font-semibold">Allocated Product Variants</h1>
                <Button
                    variant="contained"
                    onClick={handleDialogOpen}
                    sx={{
                        background: '#0000FF',
                        color: 'white',
                        px: 3,
                        borderRadius: 2,
                        fontSize: '14px',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': { background: '#0000FF' },
                    }}
                >
                    Add Variant Allocation
                </Button>
            </Box>

           
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '10px' } }} >
                <DialogContent>
                    <VariantAllocationForm onClose={handleDialogClose} />
                </DialogContent>
            </Dialog>

            <TableContainer component={Paper}
                sx={{
                    overflowX: 'auto',
                    borderRadius: 2,
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#0000FF', borderRadius: '4px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                }}
            >
                <Table>
                    <TableHead sx={{ background: '#F5F5FF' }}>
                        <TableRow>
                            {['S.No.', 'Employer', 'Contract Type', 'Combination ID', 'Variant Name', 'Variant Code', 'Created At'].map((header) => (
                                <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" style={{ color: 'red' }}>{error}</TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No allocated products found.</TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.employer?.name || '-'}</TableCell>
                                    <TableCell>{row.contractType?.contractType?.name || '-'}</TableCell>
                                    <TableCell>{row.contractCombination?.uniqueId || '-'}</TableCell>
                                    {/* <TableCell>{row.ruleBook?.id || '-'}</TableCell> */}
                                    <TableCell>{row.productVariant?.variantName || '-'}</TableCell>
                                    <TableCell>{row.productVariant?.variantCode || '-'}</TableCell>
                                    <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AllocatedProductsTable;
