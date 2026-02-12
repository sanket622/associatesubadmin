import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  data: null,
  editTimelyRepaymentData:null,
};

const variantProductRepaymentSubmitSlice = createSlice({
  name: 'variantProductRepaymentSubmit',
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
     setEditTimelyRepaymentData(state, action) {
      state.editTimelyRepaymentData = action.payload
    },
  },
});

export const {
  submitStart,
  submitSuccess,
  submitFailure,
  clearSubmitState,
  setEditTimelyRepaymentData,
} = variantProductRepaymentSubmitSlice.actions;

// Thunk to submit repayment incentives
export const submitVariantRepayment = (formData, callback) => async (dispatch) => {
  dispatch(submitStart());

  try {
    const accessToken = localStorage.getItem('accessToken');
    const variantId = localStorage.getItem('createdVariantId');

    const payload = {
      variantProductId: variantId,
      penalInterestApplicable: formData.penalInterestApplicable === 'yes',
      incentiveType: formData.incentiveType?.name || null,
      incentiveValue: Number(formData.incentiveValue),
      payoutMode: formData.payoutMode?.name || null,
      // payoutTimeline: formData.payoutTimeline || '',
      incentiveReversalConditions: formData.incentiveReversalConditions || '',
    };

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/associate/variantProduct/createVariantProductRepayment`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    enqueueSnackbar('Repayment Incentives submitted successfully!', { variant: 'success' });
    dispatch(submitSuccess(response.data));

    if (typeof callback === 'function') callback();
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit repayment incentives';
    enqueueSnackbar(message, { variant: 'error' });
    dispatch(submitFailure(message));
  }
};

export default variantProductRepaymentSubmitSlice.reducer;
