// redux/varient/variantSingleSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  variantDetail: null,
  loading: false,
  error: null,
};

const variantSingleSlice = createSlice({
  name: 'variantSingle',
  initialState,
  reducers: {
    fetchVariantDetailStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchVariantDetailSuccess: (state, action) => {
      state.loading = false;
      state.variantDetail = action.payload;
    },
    fetchVariantDetailFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearVariantDetail: (state) => {
      state.variantDetail = null;
    },
  },
});

export const {
  fetchVariantDetailStart,
  fetchVariantDetailSuccess,
  fetchVariantDetailFailure,
  clearVariantDetail,
} = variantSingleSlice.actions;

export default variantSingleSlice.reducer;

// Thunk
export const fetchVariantProductDetail = (id) => async (dispatch) => {
  dispatch(fetchVariantDetailStart());
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/associate/variantProduct/getVariantProductDetail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(fetchVariantDetailSuccess(response.data.data));
  } catch (error) {
    dispatch(
      fetchVariantDetailFailure(
        error?.response?.data?.message || 'Failed to fetch variant product detail'
      )
    );
  }
};
