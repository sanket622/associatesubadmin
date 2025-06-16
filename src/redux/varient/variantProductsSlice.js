// src/redux/masterproduct/tableslice/variantProductsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  variants: [],
  loading: false,
  error: null,
};

const variantProductsSlice = createSlice({
  name: 'variantProducts',
  initialState,
  reducers: {
    fetchVariantsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchVariantsSuccess: (state, action) => {
      state.variants = action.payload;
      state.loading = false;
    },
    fetchVariantsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchVariantsStart,
  fetchVariantsSuccess,
  fetchVariantsFailure,
} = variantProductsSlice.actions;

export const fetchVariantsByProductId = (productId) => async (dispatch) => {
  dispatch(fetchVariantsStart());
  const token = localStorage.getItem('accessToken');

  try {
    const response = await axios.get(
      `https://api.earnplus.net/api/v1/associate/variantProduct/getAllVariantProductsByProduct/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(fetchVariantsSuccess(response.data.data));
  } catch (err) {
    dispatch(
      fetchVariantsFailure(err?.response?.data?.message || 'Failed to fetch variant products')
    );
  }
};

export default variantProductsSlice.reducer;
