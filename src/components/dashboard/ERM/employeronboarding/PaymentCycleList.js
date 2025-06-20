// PaymentCycleList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractCombinations } from '../redux/employeronboarding/paymentCycleSlice';
import { fetchWorkLocations, submitRuleBook } from '../redux/employeronboarding/contractRuleSlice';
import { useNavigate, useParams } from 'react-router-dom';
import {
    TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Divider
} from '@mui/material';
import RHFAutocomplete from '../../../subcompotents/RHFAutocomplete';
import RHFTextField from '../../../subcompotents/RHFTextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormProvider from '../../../subcompotents/FormProvider';
import Label from '../../../subcompotents/Label';
import VisibilityIcon from '@mui/icons-material/Visibility';


const schema = yup.object().shape({
    workLocation: yup.object().required('Work Location is required'),
    workingPeriod: yup.number().required('Working Time Period is required').positive().integer(),
});

const PaymentCycleList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { employerId } = useParams();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);

    const { contractCombinations, loading, error } = useSelector(state => state.paymentCycle);
    const workLocations = useSelector(state => state.contractRule.workLocations || []);

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            workLocation: null,
            workingPeriod: '',
        },
    });

    useEffect(() => {
        if (employerId) {
            dispatch(fetchContractCombinations(employerId));
        }
    }, [dispatch, employerId]);

    const openRuleDialog = (contractId) => {
        setSelectedContractId(contractId);
        dispatch(fetchWorkLocations(employerId));
        setOpenDialog(true);
    };

    const handleDialogSubmit = (data) => {
        dispatch(
            submitRuleBook({
                contractCombinationId: selectedContractId,
                workLoacationId: data.workLocation.value,
                workingPeriod: data.workingPeriod,
            }, () => {
                setOpenDialog(false);
                methods.reset();
            })
        );
    };


    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-[24px] font-semibold">Payment Cycle List</h1>
                <Button
                    sx={{ background: '#0000FF', color: 'white', px: 2, borderRadius: 2, fontSize: '14px', fontWeight: 500, textTransform: 'none', '&:hover': { background: '#0000FF' } }}
                    onClick={() => {
                        const firstId = contractCombinations?.[0]?.id;
                        if (firstId) navigate(`/add-payment-cycle/${employerId}/${firstId}`);
                    }}
                >Add Payment Cycle</Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: 2, '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#0000FF', borderRadius: '4px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' } }}>
                    <Table>
                        <TableHead sx={{ background: '#F5F5FF' }}>
                            <TableRow>
                                {['Sno.', 'Unique ID', 'Contract Type', 'Start Date', 'End Date', 'Payout Date', 'Rules', 'Action', 'View'].map(header => (
                                    <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={8} align="center"><CircularProgress /></TableCell></TableRow>
                            ) : error ? (
                                <TableRow><TableCell colSpan={8} align="center" style={{ color: 'red' }}>{error}</TableCell></TableRow>
                            ) : contractCombinations.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center">No Payment Cycles found.</TableCell></TableRow>
                            ) : (
                                contractCombinations.map((cycle, index) => (
                                    <TableRow key={cycle.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{cycle.uniqueId}</TableCell>
                                        <TableCell>{cycle.contractType?.name}</TableCell>
                                        <TableCell>{new Date(cycle.accuralStartAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(cycle.accuralEndAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(cycle.payoutDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{cycle.noOfRules}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => openRuleDialog(cycle.id)}
                                                variant="outlined"
                                                sx={{ color: '#0000FF', borderColor: '#0000FF', fontSize: '12px', textTransform: 'none' }}
                                            >Add Rule</Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => navigate(`/payment-cycle-detail/${cycle.id}`)}
                                                variant="text"
                                                sx={{ minWidth: 0 }}
                                            >
                                                <VisibilityIcon sx={{ color: '#0000FF' }} />
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Add Rule Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: '#0000FF', display: 'flex', justifyContent: 'center', fontSize: 24 }}>Add Rule</DialogTitle>
                <Divider />
                <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleDialogSubmit)}>
                    <DialogContent>
                        <div className="space-y-4">
                            <Label>Work Location</Label>
                            <RHFAutocomplete
                                name="workLocation"
                                options={workLocations}
                                placeholder="Select Work Location"
                                getOptionLabel={(option) => option?.label ?? ''}
                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                            />

                            <Label>Working Period</Label>
                            <RHFTextField name="workingPeriod" type="number" />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} sx={{ background: "#0000FF", color: "white", px: 6, mb: 1, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ background: "#0000FF", color: "white", px: 6, mb: 1, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }}>Submit</Button>
                    </DialogActions>
                </FormProvider>
            </Dialog>
        </div>
    );
};

export default PaymentCycleList;
