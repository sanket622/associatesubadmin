import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Pagination, PaginationItem,
  Button
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage, setRowsPerPage } from '../../../../redux/masterproduct/tableslice/productsSlice';
import { useNavigate } from 'react-router';


const ProductMasterList = () => {

  const dispatch = useDispatch();
  const {
    products, loading, error,
    page, rowsPerPage, totalCount, totalPages
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (event, value) => {
    dispatch(setPage(value));
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="p-6">
        <h1 className="text-[24px] font-semibold mb-4">Product Master List</h1>
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
                  {['Sno.', 'Name', 'Product ID', 'Code', 'Status', 'Count', 'Manage Varient'].map((header) => (
                    <TableCell key={header} sx={{ fontSize: '14px', color: '#0000FF' }}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center"><CircularProgress /></TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" style={{ color: 'red' }}>{error}</TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">No products found.</TableCell>
                  </TableRow>
                ) : (
                  products.map((prod, index) => (
                    <TableRow key={prod.id}>
                      <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{prod.productName}</TableCell>
                      <TableCell>{prod.productId}</TableCell>
                      <TableCell>{prod.productCode}</TableCell>
                      <TableCell>{prod.status}</TableCell>
                      <TableCell>{prod.VariantProduct}</TableCell>

                      {/* <TableCell>
                        <IconButton style={{ color: '#0000FF' }} onClick={() => {
                          dispatch(setEditGeneralProductMetaData(null))
                          navigate(`/createproduct/${prod.id}`, { state: { mode: 'EDIT' } })
                        }}><EditIcon /></IconButton>
                      </TableCell> */}
                      <TableCell>
                        <Button  sx={{ background: "#0000FF", color: "white", px: 3, py: 0.5, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} onClick={() => navigate(`/varient-details/${prod.id}`)}>View</Button>
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
                onChange={(e) => {
                  dispatch(setRowsPerPage(Number(e.target.value)));
                  dispatch(setPage(1));
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[5, 10, 25, 50].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, totalCount)} out of {totalCount} records
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
    </>
  )
}

export default ProductMasterList
