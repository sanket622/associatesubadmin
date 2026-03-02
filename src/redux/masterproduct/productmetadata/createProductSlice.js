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
  setEditGeneralProductMetaData,
} = createProductSlice.actions;

export const createGeneralProduct = (payload, callback) => async (dispatch) => {
  dispatch(createProductStart());

  try {
    const accessToken = localStorage.getItem('accessToken');

    console.log("API FINAL PAYLOAD 🚀", payload);

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/associate/masterProduct/createMasterProduct`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const productId = response.data?.data?.id;
    if (productId) {
      localStorage.setItem('createdProductId', productId);
    }

    callback?.();
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

//create master product
export const submitMasterProductUpdateRequest = (payload, callback) => async (dispatch) => {
  dispatch(createProductStart());

  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/associate/masterProductUpdateRequest/submitMasterProductUpdateRequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(createProductSuccess());
    callback?.();

    return { success: true, data: response.data };

  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to submit update request';

    enqueueSnackbar(message, { variant: 'error' });
    dispatch(createProductFailure(message));

    return { success: false, message };
  }
};



export default createProductSlice.reducer;
