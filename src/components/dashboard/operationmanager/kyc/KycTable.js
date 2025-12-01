import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from '@mui/material';
import { Visibility, Flag, Download } from '@mui/icons-material';
import { fetchKYCRequests } from '../redux/kyc/kycSlice';
import { useNavigate } from 'react-router-dom';

const KycTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { kycList, loading, error } = useSelector((state) => state.kyc);

    useEffect(() => {
        dispatch(fetchKYCRequests());
    }, [dispatch]);

    return (
        <div className="p-6">
            <h1 className="text-[24px] font-semibold mb-2">KYC Details</h1>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <TableContainer
                    component={Paper}
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
                                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Employee ID</TableCell>
                                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Employee Name</TableCell>
                                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Mobile</TableCell>
                                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Employer</TableCell>
                                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Status</TableCell>
                                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>KYC Date</TableCell>
                                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" className="text-red-600">{error}</TableCell>
                                </TableRow>
                            ) : kycList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No KYC records found.</TableCell>
                                </TableRow>
                            ) : (
                                kycList.map((kyc) => (
                                    <TableRow key={kyc.id}>
                                        <TableCell>{kyc.employee.customEmployeeId}</TableCell>
                                        <TableCell>{kyc.employee.employeeName}</TableCell>
                                        <TableCell>{kyc.employee.mobile}</TableCell>
                                        <TableCell>{kyc.employee.employer.name}</TableCell>
                                        <TableCell>{kyc.kycStatus}</TableCell>
                                         <TableCell>{new Date(kyc.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Visibility
                                                className="cursor-pointer text-[#0000FF]"
                                                onClick={() => navigate(`/kyc-detail/${kyc.id}`)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default KycTable;
