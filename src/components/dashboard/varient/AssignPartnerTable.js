import React, { useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    CircularProgress, IconButton, Chip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAssignedPartners } from '../../../redux/varient/employerAssignmentSlice';

const AssignPartnerTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { variantId } = useParams();

    const { assignedPartners, loading, error } = useSelector((state) => state.employerAssignment);

    useEffect(() => {
        if (variantId) {
            dispatch(fetchAssignedPartners(variantId));
        }
    }, [dispatch, variantId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'success' : 'error';
    };

    const getStatusText = (isActive) => {
        return isActive ? 'Active' : 'Inactive';
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-[24px] font-semibold">Assigned Partners</h1>
            </div>
            
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
                                {[
                                    'Sno.', 
                                    'Employer Name', 
                                    'Employer ID', 
                                    'Assignment Date', 
                                    'End Date', 
                                    'Actions'
                                ].map((header) => (
                                    <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" style={{ color: 'red' }}>
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : !assignedPartners || assignedPartners.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        No assigned partners found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                assignedPartners.map((assignment, index) => (
                                    <TableRow key={assignment.id || index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {assignment.employer?.name || assignment.employerName || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {assignment.employer?.employerId || assignment.employerId || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(assignment.assignmentDate || assignment.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(assignment.endDate)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: '#f44336' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Summary */}
            {assignedPartners && assignedPartners.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700">
                        <strong>Total Assigned Partners:</strong> {assignedPartners.length}
                    </div>
                    <div className="text-sm text-blue-700">
                        <strong>Active Assignments:</strong> {assignedPartners.filter(a => a.isActive !== false).length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignPartnerTable;