import { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, IconButton, Paper, Dialog,
  DialogContent, Typography
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReusableTable from '../../../subcompotents/ReusableTable';
import DeleteModal from './DeleteModal';
import ApprovalModal from '../../../subcompotents/ApprovalModal';
import CreateProduct from './CreateProduct';
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
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedRejections, setSelectedRejections] = useState([]);

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
    fetchRejectionReasons();
  }, [dispatch, page, rowsPerPage]);

  const fetchRejectionReasons = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/associate/masterProductUpdateRequest/getAllMasterProductUpdateRequestsForSubAdmin`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        const rejectedRequests = res.data.data.data.filter(
          req => req.status === 'REJECTED' && req.rejectionReason && req.masterProductId
        );
        
        const reasonsMap = {};
        rejectedRequests.forEach(req => {
          if (!reasonsMap[req.masterProductId]) {
            reasonsMap[req.masterProductId] = [];
          }
          reasonsMap[req.masterProductId].push({
            reason: req.rejectionReason,
            date: req.updatedAt || req.createdAt
          });
        });
        
        Object.keys(reasonsMap).forEach(key => {
          reasonsMap[key].sort((a, b) => new Date(b.date) - new Date(a.date));
        });
        
        setRejectionReasons(reasonsMap);
      }
    } catch (err) {
      console.error('Failed to fetch rejection reasons:', err);
    }
  };


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
      key: 'rejection',
      label: 'Rejection Reason',
      render: (_, row) => {
        const rejections = rejectionReasons[row.id];
        if (!rejections || rejections.length === 0) return '-';
        return (
          <Button
            size="small"
            sx={{ textTransform: 'none', color: '#d32f2f' }}
            onClick={() => {
              setSelectedRejections(rejections);
              setRejectionDialogOpen(true);
            }}
          >
            View ({rejections.length})
          </Button>
        );
      }
    },

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
            setEditProduct(row);
            setEditDialogOpen(true);
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
        <IconButton 
          sx={{ color: '#084E77' }}
          color="primary"
          disabled={row.status === 'Active' || row.status === 'Pending'}
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

      <Dialog
        open={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Rejection History</Typography>
          {selectedRejections.map((rejection, idx) => (
            <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {new Date(rejection.date).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {rejection.reason}
              </Typography>
            </Box>
          ))}
        </DialogContent>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          {editProduct && (
            <CreateProduct
              mode="EDIT"
              status={editProduct?.status}
              productId={editProduct?.id}
              isDialog
              onEditSuccess={() => {
                setEditDialogOpen(false);
                setEditProduct(null);
                dispatch(fetchProducts(page, rowsPerPage));
              }}
            />
          )}
        </DialogContent>
      </Dialog>

    </Paper>
  );
};

export default MasterProductTable;
