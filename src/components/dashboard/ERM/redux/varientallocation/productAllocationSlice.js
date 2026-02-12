import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

const productAllocationSlice = createSlice({
  name: 'productAllocation',
  initialState,
  reducers: {
    submitStart(state) {
      state.loading = true;
      state.error = null;
    },
    submitSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    submitFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearState(state) {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
});

export const {
  submitStart,
  submitSuccess,
  submitFailure,
  clearState,
} = productAllocationSlice.actions;

export const submitProductAllocation = (formData, callback) => async (dispatch) => {
  dispatch(submitStart());

  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/associate/productAllocation/allocateProductToEmployer`,
      formData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    enqueueSnackbar('Product allocated successfully!', { variant: 'success' });
    dispatch(submitSuccess(response.data));

    if (typeof callback === 'function') callback();

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to allocate product';
    enqueueSnackbar(message, { variant: 'error' });
    dispatch(submitFailure(message));
  }
};

export default productAllocationSlice.reducer;
