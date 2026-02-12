import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  data: null,
  editVarientBasicData: null
};

const variantProductSubmitSlice = createSlice({
  name: 'variantProductSubmit',
  initialState,
  reducers: {
    submitStart(state) {
      state.loading = true;
      state.error = null;
    },
    submitSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    submitFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSubmitState(state) {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
    setEditVarientBasicData(state, action) {
      state.editVarientBasicData = action.payload
    },
  },
});

export const {
  submitStart,
  submitSuccess,
  submitFailure,
  clearSubmitState,
  setEditVarientBasicData,
} = variantProductSubmitSlice.actions;

// Thunk for submitting variant product
export const submitVariantProduct = (formData, callback) => async (dispatch) => {
  dispatch(submitStart());

  try {
    const accessToken = localStorage.getItem('accessToken');
    const masterProductId = formData.linkedProductId?.id;
    const partnerId = formData.partner?.id || null;

    const payload = {
      masterProductId,
      variantName: formData.variantName,
      variantCode: formData.variantCode,
      variantType: formData.variantType,
      remark: formData.remarks,
      productType: formData.productType.id,
      partnerId,
      geographyIds: formData.geographyIds,
    };

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/associate/variantProduct/createVariantProduct`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const variantId = response?.data?.data?.id;
    localStorage.setItem('createdVariantId', variantId);

    enqueueSnackbar('Basic information submitted successfully!', { variant: 'success' });
    dispatch(submitSuccess(response.data));

    if (typeof callback === 'function') callback();
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit variant product';
    enqueueSnackbar(message, { variant: 'error' });
    dispatch(submitFailure(message));
  }
};

export default variantProductSubmitSlice.reducer;
