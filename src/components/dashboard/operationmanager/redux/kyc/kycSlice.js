import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  kycList: [],
  kycDetail: null,
  loading: false,
  error: null,
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    fetchKYCStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchKYCListSuccess: (state, action) => {
      state.loading = false;
      state.kycList = action.payload;
    },
    fetchKYCDetailSuccess: (state, action) => {
      state.loading = false;
      state.kycDetail = action.payload;
    },
    fetchKYCFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearKYCDetail: (state) => {
      state.kycDetail = null;
    },
  },
});

export const {
  fetchKYCStart,
  fetchKYCListSuccess,
  fetchKYCDetailSuccess,
  fetchKYCFailure,
  clearKYCDetail,
} = kycSlice.actions;

export default kycSlice.reducer;

// ✅ Thunks

export const fetchKYCRequests = () => async (dispatch) => {
  dispatch(fetchKYCStart());
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/employee/kyc/getKYCRequest`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(fetchKYCListSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchKYCFailure(error?.response?.data?.message || 'Failed to fetch KYC list'));
  }
};

export const fetchKYCDetail = (id) => async (dispatch) => {
  dispatch(fetchKYCStart());
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/employee/kyc/getKYCDetails/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(fetchKYCDetailSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchKYCFailure(error?.response?.data?.message || 'Failed to fetch KYC detail'));
  }
};
