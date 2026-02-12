import { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, IconButton, Paper, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../../subcompotents/ReusableTable';
import DeleteModal from './DeleteModal';
import ApprovalModal from '../../../subcompotents/ApprovalModal';
import {
  fetchProducts,
  setPage,
  setRowsPerPage
} from '../../../../redux/masterproduct/tableslice/productsSlice';
import {
  setEditGeneralProductMetaData,
} from '../../../../redux/masterproduct/productmetadata/createProductSlice';
import {
  setEditProductparameter,
} from '../../../../redux/masterproduct/productparameter/financialTermsSlice';

import { submitMasterProductForApproval } from
  '../../../../redux/masterproduct/createmasterproductrequest/masterProductCreateRequestSlice';
import { primaryBtnSx } from '../../../subcompotents/UtilityService';


const MasterProductTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitProductId, setSubmitProductId] = useState(null);

  const {
    products,
    loading,
    error,
    page,
    rowsPerPage,
    totalCount,
    totalPages
  } = useSelector((state) => state.products);


  useEffect(() => {
    dispatch(fetchProducts(page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);


  const columns = [
    {
      key: 'sno',
      label: 'Sno.',
      render: (_, row, index) =>
        (page - 1) * rowsPerPage + index + 1
    },
    { key: 'productName', label: 'Name' },
    { key: 'productId', label: 'Product ID' },
    { key: 'productCode', label: 'Code' },
    { key: 'status', label: 'Status' },

    {
      key: 'edit',
      label: 'Edit',
      render: (_, row) => (
        <IconButton
          sx={{ color: '#084E77' }}
          onClick={() => {
            dispatch(setEditGeneralProductMetaData(null));
            dispatch(setEditProductparameter(null));
            localStorage.setItem('createdProductId', row.id);
            navigate(`/createproduct/${row.id}`, { state: { mode: 'EDIT', status: row?.status, } });
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      key: 'variant',
      label: 'View Variant',
      render: (_, row) => (
        <IconButton sx={{ color: '#084E77' }} onClick={() => navigate(`/varient-details/${row.id}`)}>
          <CategoryIcon />
        </IconButton>
      ),
    },
    {
      key: 'delete',
      label: 'Delete',
      render: (_, row) => (
        <IconButton color="error" onClick={() => { setSelectedProduct(row); setDeleteModal(true) }}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      key: 'history',
      label: 'History',
      render: (_, row) => (
        <IconButton sx={{ color: '#084E77' }} onClick={() => navigate(`/version-history/${row.id}`)}>
          <HistoryIcon />
        </IconButton>
      ),
    },
    {
      key: 'view',
      label: 'View',
      render: (_, row) => (
        <IconButton sx={{ color: '#084E77' }} onClick={() => navigate(`/view-product/${row.id}`)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      key: 'add',
      label: 'Add Fields',
      render: (_, row) => (
        <IconButton sx={{ color: '#084E77' }}
          onClick={() => {
            navigate(`/add-fields/${row.id}`, {
              state: {
                status: row.status,
              },
            });
          }}
        >
          <PlaylistAddIcon />
        </IconButton>
      ),
    },
    // {
    //   key: 'gonopolicy',
    //   label: 'Go/No Policy',
    //   render: (_, row) => (
    //     <IconButton sx={{ color: '#084E77' }}
    //       onClick={() => {
    //         navigate(`/product-policy/${row.id}`, {
    //           state: {
    //             status: row.status,
    //           },
    //         });
    //       }}
    //     >
    //       <PlaylistAddIcon />
    //     </IconButton>
    //   ),
    // },
    // {
    //   key: 'Bre Policy',
    //   label: 'Bre Policy',
    //   render: (_, row) => (
    //     <IconButton sx={{ color: '#084E77' }}
    //       onClick={() => {
    //         navigate(`/productbre-policy/${row.id}`, {
    //           state: {
    //             status: row.status,
    //           },
    //         });
    //       }}
    //     >
    //       <PlaylistAddIcon />
    //     </IconButton>
    //   ),
    // },

    {
      key: 'submit',
      label: 'Approval',
      render: (_, row) => (
        <IconButton sx={{ color: '#084E77' }}
          color="primary"
          disabled={row.status === 'Active'}
          onClick={() => {
            setSubmitProductId(row.id);
            setConfirmOpen(true);
          }}
        >
          <SendIcon />
        </IconButton>
      ),
    },


  ];




  const headerActions = (
    < Button
      startIcon={< AddIcon />}
      sx={primaryBtnSx}
      onClick={() => navigate('/createproduct')}
    >
      Create Product
    </Button >
  )



  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      {/* <Box mb={2}>
        <div className="flex justify-end items-center">
          <Button startIcon={<AddIcon />} sx={{ background: "#0000FF", color: "white", px: 4, py: 1, borderRadius: 2, fontSize: "16px", fontWeight: 500, textTransform: "none", "&:hover": { background: "#0000FF" } }} onClick={() => navigate('/createproduct')}>
            Create Product
          </Button>
        </div>
      </Box> */}

      <ReusableTable
        title="Master Products"
        columns={columns}
        data={products}
        loading={loading}
        error={error}
        page={page}
        // showSearch = {true}
        // showFilter= {true}
        headerActions={headerActions}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(newPage) => dispatch(setPage(newPage))}
        onRowsPerPageChange={(size) => {
          dispatch(setRowsPerPage(size));
          dispatch(setPage(1));
        }}
      />

      {deleteModal && (
        <DeleteModal
          selectedItem={selectedProduct}
          type="PRODUCT"
          setDeleteModal={setDeleteModal}
        />
      )}

      <ApprovalModal
        open={confirmOpen}
        entityLabel="product"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          dispatch(submitMasterProductForApproval(submitProductId));
          setConfirmOpen(false);
          setSubmitProductId(null);
        }}
      />

    </Paper>
  );
};

export default MasterProductTable;
