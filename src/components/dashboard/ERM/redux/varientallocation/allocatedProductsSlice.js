import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: null,
  data: [],
};

const allocatedProductsSlice = createSlice({
  name: 'allocatedProducts',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearAllocatedProductsState(state) {
      state.loading = false;
      state.error = null;
      state.data = [];
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  clearAllocatedProductsState,
} = allocatedProductsSlice.actions;

export const fetchAllocatedProducts = () => async (dispatch) => {
  dispatch(fetchStart());

  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/associate/productAllocation/getAllocatedProductsToEmployers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    dispatch(fetchSuccess(response.data.data));
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to fetch allocated products';
    dispatch(fetchFailure(message));
  }
};

export default allocatedProductsSlice.reducer;
