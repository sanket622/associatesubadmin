import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableContainer,
  CircularProgress,
  Pagination,
  PaginationItem
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { fetchProductVersions } from '../../../redux/masterproduct/tableslice/productsSlice';

const VersionHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { masterProductId } = useParams();
  const versionList = useSelector((state) => state.products.productVersions) || [];
  console.log(versionList);
  
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10; 

  useEffect(() => {
    if (masterProductId) {
      dispatch(fetchProductVersions(masterProductId));
    }
  }, [dispatch, masterProductId]);

  const handleChangePage = (event, value) => {
    setPage(value);
    // Dispatch redux action if you have pagination support
  };

  // Pagination logic for slicing versionList if needed
  const paginatedVersions = versionList.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(versionList.length / rowsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-[24px] font-semibold mb-4 text-black">Product Version History</h1>

      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
        style={{ minWidth: '700px' }}
      >
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
                {['Version', 'Status', 'Created At', 'Product Name', 'Actions'].map((header) => (
                  <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" style={{ color: 'red' }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : paginatedVersions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No versions found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedVersions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell>{version.versionId}</TableCell>
                    <TableCell>{version.snapshot?.status || '-'}</TableCell>
                    <TableCell>
                      {version.snapshot?.createdAt
                        ? new Date(version.snapshot.createdAt).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell>{version.snapshot?.productName || '-'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/view-version/${version.id}`)}>
                        <VisibilityIcon color="primary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="px-6 py-4 flex justify-between items-center bg-white">
          <div className="flex items-center text-gray-500">
            <span className="mr-2 text-sm">Rows per page:</span>
            <select
              value={rowsPerPage}
              disabled 
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing {(page - 1) * rowsPerPage + 1} to{' '}
            {Math.min(page * rowsPerPage, versionList.length)} out of {versionList.length} records
          </div>

          <div className="flex items-center space-x-2">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              size="small"
              shape="rounded"
              variant="outlined"
              renderItem={(item) => (
                <PaginationItem
                  components={{ previous: ChevronLeftIcon, next: ChevronRightIcon }}
                  {...item}
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    px: 0,
                    color: item.selected ? '#0000FF' : 'black',
                    borderColor: item.selected ? '#0000FF' : 'transparent',
                    '&:hover': { borderColor: '#0000FF', backgroundColor: 'transparent' },
                    fontWeight: item.selected ? 600 : 400,
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;
