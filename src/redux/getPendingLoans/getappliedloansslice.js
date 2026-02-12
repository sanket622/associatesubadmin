import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMyAppliedLoans = createAsyncThunk(
  'appliedLoans/fetchMyAppliedLoans',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/manager/getAppliedLoans`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch applied loans'
      );
    }
  }
);

const appliedLoanSlice = createSlice({
  name: 'appliedLoans',
  initialState: {
    loans: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    totalPages: 0,
    totalCount: 0,
    role: null,
  },
  reducers: {
    setAppliedPage(state, action) {
      state.page = action.payload;
    },
    setAppliedLimit(state, action) {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAppliedLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAppliedLoans.fulfilled, (state, action) => {
        state.loading = false;

        const { loans, pagination, role } = action.payload;

        state.loans = loans;
        state.page = pagination.currentPage;
        state.limit = pagination.limit;
        state.totalPages = pagination.totalPages;
        state.totalCount = pagination.totalCount;
        state.role = role;
      })
      .addCase(fetchMyAppliedLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAppliedPage, setAppliedLimit } = appliedLoanSlice.actions;
export default appliedLoanSlice.reducer;
