// redux/masterproduct/masterProductCreateRequestSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const masterProductCreateRequestSlice = createSlice({
  name: 'masterProductCreateRequest',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    requestSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetRequestState: () => initialState,
  },
});

export const {
  requestStart,
  requestSuccess,
  requestFailure,
  resetRequestState,
} = masterProductCreateRequestSlice.actions;


export const submitMasterProductForApproval =
  (productId) => async (dispatch) => {
    dispatch(requestStart());

    try {
      const accessToken = localStorage.getItem('accessToken');

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/associate/masterProductCreateRequest/submitMasterProductForApproval`,
        { masterProductId: productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      enqueueSnackbar('Product submitted for approval!', { variant: 'success' });
      dispatch(requestSuccess());

    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to submit product for approval';

      enqueueSnackbar(message, { variant: 'error' });
      dispatch(requestFailure(message));
    }
  };

export default masterProductCreateRequestSlice.reducer;
