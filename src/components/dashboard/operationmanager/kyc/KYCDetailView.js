// KYCDetailView.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchKYCDetail } from '../redux/kyc/kycSlice';
import { CheckCircle, Close, Download, FlagCircle, Visibility, Warning } from '@mui/icons-material';
import Flag from 'react-world-flags';

const KYCDetailView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { kycDetail, loading } = useSelector((state) => state.kyc);
  const documents = Array(5).fill({ name: 'PAN Card' });

  useEffect(() => {
    dispatch(fetchKYCDetail(id));
  }, [dispatch, id]);

  if (loading || !kycDetail) {
    return <div className="p-6"><CircularProgress /></div>;
  }

  const data = kycDetail;

  return (
    <div className="p-6 mt-4 rounded-t-xl">
      <h1 className="text-[#0000FF] font-semibold text-xl mb-4">View KYC Detail</h1>

      <div className="bg-white border rounded-xl p-5 my-6 grid grid-cols-1 md:grid-cols-2 gap-y-4">
        <div><span className="font-semibold">Customer ID</span><br />{data.id}</div>
        <div><span className="font-semibold">Employee Name</span><br />{data.employee.employeeName}</div>
        <div><span className="font-semibold">Employer</span><br />{data.employee.employer.name}</div>
        <div><span className="font-semibold">Mobile Number</span><br />{data.employee.mobile}</div>
        <div><span className="font-semibold">Employee ID</span><br />{data.employee.customEmployeeId}</div>
        <div><span className="font-semibold">KYC Submission Date</span><br />{new Date(data.createdAt).toLocaleDateString()}</div>
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
                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Document</TableCell>
                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Actions</TableCell>
                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Status</TableCell>
                <TableCell sx={{ fontSize: '14px', color: '#0000FF' }}>Status Indicator</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Visibility className="cursor-pointer text-blue-600" />
                      <FlagCircle className="cursor-pointer text-red-500" />
                      <Download className="cursor-pointer text-green-600" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <select className="border rounded bg-green-500 text-white px-3 py-1">
                      <option>Approve</option>
                      <option>Reject</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center mr-2 text-green-600">
                      <CheckCircle fontSize="small" className="mr-1" />Green
                    </span>
                    <span className="inline-flex items-center mr-2 text-yellow-500">
                      <Warning fontSize="small" className="mr-1" />Yellow
                    </span>
                    <span className="inline-flex items-center text-red-500">
                      <Close fontSize="small" className="mr-1" />Red
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default KYCDetailView;
