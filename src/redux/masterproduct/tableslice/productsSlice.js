// src/redux/masterproduct/tableslice/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  loading: false,
  error: null,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
  totalPages: 1,

  productDetails: null,
  productDetailsLoading: false,
  productDetailsError: null,

  productVersions: [],
  productVersionsLoading: false,
  productVersionsError: null,

  versionDetails: null,
  versionDetailsLoading: false,
  versionDetailsError: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Existing pagination data
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      const { data, totalItems, currentPage, totalPages, pageSize } = action.payload;
      state.products = data;
      state.totalCount = totalItems;
      state.page = currentPage;
      state.totalPages = totalPages;
      state.rowsPerPage = pageSize;
      state.loading = false;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload;
    },

    // Product Detail
    fetchProductDetailsStart: (state) => {
      state.productDetailsLoading = true;
      state.productDetailsError = null;
    },
    fetchProductDetailsSuccess: (state, action) => {
      state.productDetails = action.payload;
      state.productDetailsLoading = false;
    },
    fetchProductDetailsFailure: (state, action) => {
      state.productDetailsError = action.payload;
      state.productDetailsLoading = false;
    },

    // Product Versions
    fetchProductVersionsStart: (state) => {
      state.productVersionsLoading = true;
      state.productVersionsError = null;
    },
    fetchProductVersionsSuccess: (state, action) => {
      state.productVersions = action.payload;
      state.productVersionsLoading = false;
    },
    fetchProductVersionsFailure: (state, action) => {
      state.productVersionsError = action.payload;
      state.productVersionsLoading = false;
    },

    // Version Details
    fetchVersionDetailsStart: (state) => {
      state.versionDetailsLoading = true;
      state.versionDetailsError = null;
    },
    fetchVersionDetailsSuccess: (state, action) => {
      state.versionDetails = action.payload;
      state.versionDetailsLoading = false;
    },
    fetchVersionDetailsFailure: (state, action) => {
      state.versionDetailsError = action.payload;
      state.versionDetailsLoading = false;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setPage,
  setRowsPerPage,

  fetchProductDetailsStart,
  fetchProductDetailsSuccess,
  fetchProductDetailsFailure,

  fetchProductVersionsStart,
  fetchProductVersionsSuccess,
  fetchProductVersionsFailure,

  fetchVersionDetailsStart,
  fetchVersionDetailsSuccess,
  fetchVersionDetailsFailure,
} = productsSlice.actions;

// API CALLS (without createAsyncThunk)

export const fetchProducts = (page, rowsPerPage) => async (dispatch) => {
  dispatch(fetchProductsStart());
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      'https://api.earnplus.net/api/v1/associate/masterProduct/getAllMasterProducts',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, rowsPerPage },
      }
    );
    dispatch(fetchProductsSuccess(response.data.data));

  } catch (err) {
    dispatch(fetchProductsFailure(err?.response?.data?.message || 'Failed to fetch products'));
  }
};

export const fetchProductDetails = (productId, callback) => async (dispatch) => {
  dispatch(fetchProductDetailsStart());
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      `https://api.earnplus.net/api/v1/associate/masterProduct/getMasterProductDetails/${productId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // console.log(response);
    dispatch(fetchProductDetailsSuccess(response.data.data));
    if (callback && typeof callback === "function") {
      callback()
    }
  } catch (err) {
    dispatch(fetchProductDetailsFailure(err?.response?.data?.message || 'Failed to fetch product details'));
  }
};

export const fetchProductVersions = (productId) => async (dispatch) => {
  dispatch(fetchProductVersionsStart());
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      `https://api.earnplus.net/api/v1/associate/masterProduct/getMasterProductVersions/${productId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(fetchProductVersionsSuccess(response.data.data));


  } catch (err) {
    dispatch(fetchProductVersionsFailure(err?.response?.data?.message || 'Failed to fetch version history'));
  }
};

export const fetchVersionDetails = (versionId) => async (dispatch) => {
  dispatch(fetchVersionDetailsStart());
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      `https://api.earnplus.net/api/v1/associate/masterProduct/getMasterProductVersionById/${versionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(fetchVersionDetailsSuccess(response.data.data));
  } catch (err) {
    dispatch(fetchVersionDetailsFailure(err?.response?.data?.message || 'Failed to fetch version detail'));
  }
};

export default productsSlice.reducer;
