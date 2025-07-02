import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartners } from '../redux/employeronboarding/employerOnboardingSlice';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PartnerTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { partners } = useSelector((state) => state.employerOnboarding || { partners: { loading: false, error: null, data: [] } });

    useEffect(() => {
        dispatch(fetchPartners());
    }, [dispatch]);

    return (
        <div className="p-6">
            <h1 className="text-[24px] font-semibold mb-4">Partner List</h1>
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
                                {['Sno.','Employer Id', 'Name', 'Email', 'Mobile', 'Contract Types', 'Status', 'Assign'].map((header) => (
                                    <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>{header}</TableCell>
                                ))}

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {partners.loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center"><CircularProgress /></TableCell>
                                </TableRow>
                            ) : partners.error ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" style={{ color: 'red' }}>{partners.error}</TableCell>
                                </TableRow>
                            ) : partners.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">No Partner found.</TableCell>
                                </TableRow>
                            ) : (
                                partners.data.map((partner, index) => (
                                    <TableRow key={partner.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{partner.employerId}</TableCell>
                                        <TableCell>{partner.name}</TableCell>
                                        <TableCell>{partner.email}</TableCell>
                                        <TableCell>{partner.mobile}</TableCell>
                                        <TableCell>
                                            <TableCell>
                                                <ul style={{ listStyle: 'none' }}>
                                                    {partner.EmployerContractType.map((contract, index) => (
                                                        <li key={index} style={{ position: 'relative', paddingLeft: '12px', marginBottom: '4px' }}>
                                                            <span style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0000FF', display: 'inline-block' }} />
                                                            <span style={{ fontSize: '14px', color: '#333' }}>{contract.contractType.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                style={{
                                                    color: partner.isActive ? 'green' : 'red',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {partner.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button sx={{ background: "#0000FF", color: "white", px: 2, borderRadius: 2, fontSize: "14px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} onClick={() => navigate(`/payment-cycle-list/${partner.id}`)} title="View Details">
                                                Asign
                                            </Button>
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

export default PartnerTable;
