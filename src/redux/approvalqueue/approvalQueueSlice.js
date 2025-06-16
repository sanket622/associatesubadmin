// src/redux/masterproduct/tableslice/approvalQueueSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  updateRequests: [],
  loading: false,
  error: null,

  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
  totalPages: 1,
};

const approvalQueueSlice = createSlice({
  name: 'approvalQueue',
  initialState,
  reducers: {
    fetchUpdateRequestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUpdateRequestsSuccess: (state, action) => {
      const data = action.payload;
      state.updateRequests = data;
      state.totalCount = data.length;
      state.totalPages = Math.ceil(data.length / state.rowsPerPage);
      state.loading = false;
    },
    fetchUpdateRequestsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload;
      state.totalPages = Math.ceil(state.updateRequests.length / action.payload);
    },
  },
});

export const {
  fetchUpdateRequestsStart,
  fetchUpdateRequestsSuccess,
  fetchUpdateRequestsFailure,
  setPage,
  setRowsPerPage,
} = approvalQueueSlice.actions;

export const fetchUpdateRequests = () => async (dispatch) => {
  dispatch(fetchUpdateRequestsStart());
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      '/api/v1/associate/masterProduct/getAllMasterProductUpdateRequests',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.data.success) {
      dispatch(fetchUpdateRequestsSuccess(response.data.data));
    } else {
      dispatch(fetchUpdateRequestsFailure(response.data.message || 'Failed to fetch update requests'));
    }
  } catch (err) {
    dispatch(fetchUpdateRequestsFailure(err?.response?.data?.message || 'Failed to fetch update requests'));
  }
};

export default approvalQueueSlice.reducer;
