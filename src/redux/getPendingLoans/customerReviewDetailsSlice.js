import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCustomerReviewDetails = createAsyncThunk(
  'customerReviewDetails/fetchByCustomerId',
  async (customerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [vkycRes, dedupeRes] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/manager/getCustomerVKYCDetails/${customerId}`,
          { headers }
        ),
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/manager/checkCustomerLoanDedupe/${customerId}`,
          { headers }
        ),
      ]);

      return {
        vkyc: vkycRes?.data?.data || null,
        dedupe: dedupeRes?.data?.data || null,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch customer review details'
      );
    }
  }
);

const customerReviewDetailsSlice = createSlice({
  name: 'customerReviewDetails',
  initialState: {
    data: {
      vkyc: null,
      dedupe: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    resetCustomerReviewDetails: (state) => {
      state.data = {
        vkyc: null,
        dedupe: null,
      };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerReviewDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerReviewDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerReviewDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = {
          vkyc: null,
          dedupe: null,
        };
      });
  },
});

export const { resetCustomerReviewDetails } = customerReviewDetailsSlice.actions;
export default customerReviewDetailsSlice.reducer;
