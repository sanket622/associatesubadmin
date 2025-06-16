// redux/masterproduct/productCreate/createProductSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  success: false,
  editGeneralProductMetaData: null
};

const createProductSlice = createSlice({
  name: 'createProduct',
  initialState,
  reducers: {
    createProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createProductSuccess: (state) => {
      state.loading = false;
    },
    createProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setEditGeneralProductMetaData: (state, action) => {
      state.editGeneralProductMetaData = action.payload
    },
  },
});

export const {
  createProductStart,
  createProductSuccess,
  createProductFailure,
  setEditGeneralProductMetaData
} = createProductSlice.actions;

export const createGeneralProduct = (formData, callback) => async (dispatch) => {
  dispatch(createProductStart());
  try {
    const accessToken = localStorage.getItem('accessToken');
    const payload = {
      productName: formData.productName,
      productDescription: formData.productDescription,
      productCode: formData.productCode,
      productCategoryId: formData.subLoanType?.id,
      loanTypeId: formData.loanType?.id,
      deliveryChannel: formData.businessSegment?.[0]?.id || '',
      partnerId: formData.productType?.id,
      status: formData.status?.id,
      purposeIds: formData.partnerCode?.map((item) => item.id),
      segments: formData.segmentType?.map((item) => item.id),
    };

    const response = await axios.post(
      'https://api.earnplus.net/api/v1/associate/masterProduct/createMasterProduct',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const productId = response.data?.data?.id;
    if (productId) {
      localStorage.setItem('createdProductId', productId);
    }
    if (callback && typeof callback === "function") {
      callback()
    }
    enqueueSnackbar('Product created successfully!', { variant: 'success' });
    dispatch(createProductSuccess());
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to create product';
    enqueueSnackbar(message, { variant: 'error' });
    dispatch(createProductFailure(message));
    return { success: false, message };
  }
};

export default createProductSlice.reducer;
