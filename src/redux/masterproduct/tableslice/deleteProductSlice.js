// redux/masterproduct/deleteSlice/deleteProductSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: null,
  deleteResponse: null,
};

const deleteProductSlice = createSlice({
  name: 'deleteProduct',
  initialState,
  reducers: {
    deleteProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess: (state, action) => {
      state.loading = false;
      state.deleteResponse = action.payload;
    },
    deleteProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearDeleteProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.deleteResponse = null;
    },
  },
});

export const {
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  clearDeleteProductState,
} = deleteProductSlice.actions;

export const submitDeleteProduct = (productId, reason, callback, enqueueSnackbar) => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken');
  dispatch(deleteProductStart());

  try {
    const response = await axios.post(
      'https://api.earnplus.net/api/v1/associate/masterProduct/createMasterProductDeleteRequest',
      {
        masterProductId: productId,
        reason: reason,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.success) {
      dispatch(deleteProductSuccess(response.data));
      if (enqueueSnackbar) {
        enqueueSnackbar('Product delete request submitted successfully!', { variant: 'success' });
      }
      if (typeof callback === 'function') {
        callback();
      }
    } else {
      dispatch(deleteProductFailure(response.data.message || 'Failed to delete master product'));
      if (enqueueSnackbar) {
        enqueueSnackbar(response.data.message || 'Failed to delete product', { variant: 'error' });
      }
    }
  } catch (error) {
    dispatch(deleteProductFailure(error.message || 'Unexpected error occurred'));
    if (enqueueSnackbar) {
      enqueueSnackbar(error.message || 'Unexpected error occurred', { variant: 'error' });
    }
  }
};


export default deleteProductSlice.reducer;
