import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractCombinations } from '../redux/employeronboarding/paymentCycleSlice'; 
import { useNavigate } from 'react-router-dom';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
} from '@mui/material';

const PaymentCycleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contractCombinations, loading, error } = useSelector((state) => state.paymentCycle);

  // Replace with real employerId
  const employerId = '941f60bf-c896-4f7c-8be5-a5d41fad3132';

  useEffect(() => {
    dispatch(fetchContractCombinations(employerId));
  }, [dispatch, employerId]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[24px] font-semibold">Payment Cycle List</h1>
        <Button
          sx={{
            background: "#0000FF",
            color: "white",
            px: 2,
            borderRadius: 2,
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": { background: "#0000FF" },
          }}
          onClick={() => navigate(`/add-payment-cycle/${employerId}`)}
        >
          Add Payment Cycle
        </Button>
      </div>

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
                {['Sno.', 'Unique ID', 'Contract Type', 'Start Date', 'End Date', 'Payout Date', 'Rules'].map((header) => (
                  <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" style={{ color: 'red' }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : contractCombinations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Payment Cycles found.
                  </TableCell>
                </TableRow>
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

export default PaymentCycleList;
